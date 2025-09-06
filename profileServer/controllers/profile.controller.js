import {Profile} from "../models/Profile.js";

const createProfile = async(req,res)=>{
    try{
        const {name,username,userid} = req.body;
        const profile = await Profile.create({
            name,
            username,
            userid
        });

        res.status(200).json({
            message: `${name} profile created successfully`,
        })
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export {createProfile}