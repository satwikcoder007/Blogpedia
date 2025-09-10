import {Profile} from "../models/Profile.js";
import client from "../config/redisconnect.js";

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

const getProfile = async(req,res)=>{
    try {
        const userid=req.params.userid

        if(!userid){
            return res.status(400).json({
                message: "User ID is required"
            })
        }

        //check in redis cache
        const cachedProfile = await client.json.get(userid);

        if(cachedProfile){
            return res.status(200).json({
                message: "Profile fetched from cache",
                profile: cachedProfile
            })  
        }

        //if not found in cache then fetch from db and set it 

        const profile = await Profile.findOne({userid});

        if(!profile){
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        await client.json.set(userid, "$", profile);

        return res.status(200).json({
            message: "Profile fetched successfully",
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export {createProfile, getProfile}

