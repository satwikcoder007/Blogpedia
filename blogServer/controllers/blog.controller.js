import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { getServiceLogger } from "../config/logger.js";

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

export {getBlog}