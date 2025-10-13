import asyncio
import json
import os
from dotenv import load_dotenv
import aio_pika
from bson import ObjectId
from generateTags import generate_tags  # adjust import path as needed
from models.blog import blogs_collection, BlogModel  # adjust import path as needed

load_dotenv()

AMQP_URL = os.getenv("AMQP_URL")

async def process_message(message: aio_pika.IncomingMessage):
    async with message.process():
        try:
            # Parse the blog ID from the queue message
            blog_id = json.loads(message.body.decode())
            print(f" Received Blog ID: {blog_id}")

            # Fetch the blog asynchronously
            blog_data = await blogs_collection.find_one({"_id": ObjectId(blog_id)})

            if not blog_data:
                print(f" Blog {blog_id} not found")
                return

            # Parse into Pydantic model (for validation)
            blog = BlogModel(**blog_data)

            # Generate tags from title + content
            tags = await generate_tags(blog.title, blog.content)
            print(f"🧠 Generated tags: {tags}")

            # Update blog document with tags
            await blogs_collection.update_one(
                {"_id": ObjectId(blog_id)},
                {"$set": {"tags": tags}},
            )

            print(f" Tags updated for blog {blog_id}")

        except Exception as e:
            print(f"❌ Error processing message: {e}")


async def consume_queue():
    # Connect to RabbitMQ
    connection = await aio_pika.connect_robust(AMQP_URL)
    channel = await connection.channel()

    # Declare queue
    queue = await channel.declare_queue("tagQueue", durable=True)
    print(" Listening for messages on tagQueue...")

    # Start consuming
    await queue.consume(process_message)

    return connection


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(consume_queue())

    try:
        loop.run_forever()
    finally:
        loop.run_until_complete(connection.close())
