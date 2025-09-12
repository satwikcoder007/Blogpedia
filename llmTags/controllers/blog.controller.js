import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import cloudinary from "../utils/cloudinary.js";
// import upload from "../middleware/multer.js";


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



 export const postBlog=asyncHandler(async(req,res)=>{
 try{
    const _id=req.data._id
    if(!_id){
        throw new apiError(400,"Username is required")
    }

    const title=req.title;
    const content=req.content;
    let imageurl=null
    if(req.file){
        const result=await cloudinary.uploader.upload(req.file.path,{
            folder:'blogs'
        })
        imageurl=result.secure_url
    }

    const blog=await Blog.create({
        owner:_id,
        title: title,
        content: content,
        image :imageurl
    })

    await blog.save()

    res.status(201).json({
        success:true,
        message:"Blog Created",
        blog
    });
}
catch(error){
    res.status(500).json({success:false,message:error.message})
}


})

