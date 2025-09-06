import  express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import dbConnector from "./config/dbconnection.js"
import profileRoutes from "./routes/profile.route.js"

configDotenv() 

const app = express() 
const PORT = process.env.PORT || 8002


app.use(express.json({ extended: true, limit: '5mb' }))
app.use(cookieParser())
app.use(cors())

app.use("/api/v1", profileRoutes);

dbConnector();

app.listen(PORT, () => {
  console.log(`Profile server is running on port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send("Hello From profile server")
})
