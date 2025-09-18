import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv"
import blogRoutes from "./routes/blog.route.js"
import dbConnector from "./config/dbconnection.js"
import {consumeQueue} from "./llmTags/tagcontentQueue.js"

const app=express()
const PORT=process.env.PORT || 8001

configDotenv()

app.use(cors())
app.use(cookieParser())
app.use(express.json({extended: true, limit: '5mb' }))


app.use('/api/v1/',blogRoutes)

dbConnector();
consumeQueue();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.get("/",()=>{
    console.log("Hi everyone");
})