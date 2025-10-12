import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getServiceLogger } from "../config/logger.js";
import kafka from "../config/kafkaClient.js";

const logger = getServiceLogger('BLOG');

const getBlog=asyncHandler( async(req,res)=>{
    const _id=req.params.id
 
    if(!_id){
        throw new apiError(400,"User ID is required")
    }

    const blogs= await Blog.find({owner:_id})

     if (!blogs || blogs.length === 0) {
        throw new apiError(404, "No blogs found for this user")
    }
    logger.info(`Blogs fetched for user ID: ${_id}`);
    return res
    .status(200)
    .json(new apiResponse(200,blogs,"All Blogs fetched successfully!"))

})  

const postBlog=asyncHandler( async(req,res)=>{
    const {owner,title,content,image,tags,keywords}=req.body

    if(!owner || !title || !content){
        throw new apiError(400,"Owner, Title and Content are required")
    }

    const newBlog = await Blog.create({
        owner,
        title,
        content,
        image,
        tags,
        keywords
    })

    logger.info(`New blog created with ID: ${newBlog._id}`);

    const producer = kafka.producer();
    await producer.connect();

    logger.info(" Kafka Producer connected");

    await producer.send({
        topic: 'test-topic',
        messages:[
            {
                value:JSON.stringify({
                    title:newBlog.title,
                    content:newBlog.content,
                })
            }
        ]
    })

    logger.info("Message sent to Kafka topic 'test-topic'");

    return res
    .status(201)
    .json(new apiResponse(201,newBlog,"Blog created successfully!"))

})



export {getBlog,postBlog}