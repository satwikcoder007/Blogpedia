import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import cloudinary from "../utils/cloudinary.js";
import { configDotenv } from "dotenv";
// import upload from "../middleware/multer.js";
import amqp from "amqplib"
configDotenv()

export const getBlog=asyncHandler( async(req,res)=>{
    const _id=req.params.id

    if(!_id){
        throw new apiError(400,"Username is required")
    }

    const blogs= await Blog.find({owner:_id})

     if (!blogs || blogs.length === 0) {
        throw new apiError(404, "No blogs found for this user")
    }

    return res
    .status(200)
    .json(new apiResponse(200,blogs,"All Blogs fetched successfully!"))

})    

let channel;

async function connectRabbit() {
  try {
    const conn = await amqp.connect(process.env.AMQP_URL); // change to rabbitmq://rabbitmq:5672 in Docker
    channel = await conn.createChannel();
    await channel.assertQueue("tagQueue");
    console.log(" Connected to RabbitMQ and tagQueue created");
  } catch (err) {
    console.error(" Failed to connect RabbitMQ:", err);
  }
}
connectRabbit();


export const postBlog = asyncHandler(async (req, res) => {
  try {
    const _id = req.params.id
    if (!_id) {
      throw new apiError(400, "User ID is required");
    }

    const { title, content } = req.body;
    if (!title || !content) {
      throw new apiError(400, "Title and content are required");
    }

    let imageurl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });
      if (!result) {
        return res.status(500).json({ message: "Image not uploaded" });
      }
      imageurl = result.secure_url;
    }

    const blog = await Blog.create({
      owner: _id,
      title,
      content,
      image: imageurl,
    });

    if(channel){
        channel.sendToQueue("tagQueue", Buffer.from(JSON.stringify(blog._id)))
        console.log(blog._id)
    }
    else {
      console.error(" RabbitMQ channel not ready, blog not queued");
    }
    // Tag Queue Implementation.
    res.status(201).json({
      success: true,
      message: "Blog Created",
      blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


