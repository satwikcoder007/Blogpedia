import amqp from "amqplib"
import { Blog } from "./models/Blog.js";
import {generateTags} from "./genTag.js"

export async function consumeQueue() {
    const conn=await amqp.connect(process.env.AMQP_URL)
    const channel = await conn.createChannel();
    await channel.assertQueue("tagQueue");

    channel.consume("tagQueue", async(msg)=>{
        if(msg!=null){
            const blog_id=JSON.parse(msg.content.toString())
            const blog=await Blog.find({_id:blog_id})
            // generating the tags

            const title=blog?.title
            const content=blog?.content

            const tags=generateTags(title,content)

            await Blog.findByIdAndUpdate(blog_id,
                { $push: { tags: { $each: tags } } },
                {new:true}
            )

            channel.ack(msg);
        }
    })
}