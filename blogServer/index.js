import express from "express"
import cors from "cors"
import bodyParser  from "body-parser"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv"
import blogRoutes from "./routes/blog.route.js"
import dbConnector from "./config/dbconnection.js"

const app=express()
const PORT=process.env.PORT || 8001

configDotenv()

app.use(cors())
app.use(cookieParser())
app.use(express.json({extended: true, limit: '5mb' }))


app.use('/api/v1/',blogRoutes)

dbConnector();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.get("/",()=>{
    console.log("Hi everyone");
})