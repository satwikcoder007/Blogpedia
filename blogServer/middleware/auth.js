import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"

configDotenv()

const auth=async(req,res,next)=>{
    const accessToken=req.cookie.accessToken
    if(!accessToken)
        return res.status(500)

    try {
        const accessTokenKey=process.env.ACCESS_TOKEN_SECRET
        const accessTokenData=jwt.verify(accessToken,accessTokenKey)
        req.data=accessTokenData
        return next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Invalid access token"
        })
    }
}

export {auth}