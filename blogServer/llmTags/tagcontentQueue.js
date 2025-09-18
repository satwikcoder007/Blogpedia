import amqp from "amqplib"
import { Blog } from "../models/Blog.js";
import {generateTags} from "./genTag.js"
import { configDotenv } from "dotenv";

configDotenv()

export async function consumeQueue() {
  const conn = await amqp.connect(process.env.AMQP_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue("tagQueue");

  channel.consume("tagQueue", async (msg) => {
    if (msg) {
      try {
        // Parse blog id
        const blog_id = JSON.parse(msg.content.toString());

        // Find blog by ID (returns a single doc)
        const blog = await Blog.findById(blog_id);
        if (!blog) {
          console.error(`Blog ${blog_id} not found`);
          channel.ack(msg);
          return;
        }

        // Generate tags using the blog’s content/title
        const tags = await generateTags(blog.title, blog.content);
        //console.log("Generated tags:", tags);

        // Update the blog
        await Blog.findByIdAndUpdate(
          blog._id,
          { $set: { tags } },
          { new: true }
        );

        //console.log(`Tags updated for blog ${blog._id}`);
        channel.ack(msg);
      } catch (err) {
        console.error("Error consuming message:", err);
        channel.nack(msg, false, false); // reject without requeue
      }
    }
  });
}
