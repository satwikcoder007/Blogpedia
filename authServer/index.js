import  express from "express"
import { configDotenv } from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import dbConnector from "./config/dbconnection.js"
import userRoutes from "./routes/userRouter.js"

configDotenv() // Load environment variables from .env file

const app = express() // Returns an instance of an Express server
const PORT = process.env.PORT || 3000


app.use(express.json({ extended: true, limit: '5mb' }))
// Middleware to parse JSON bodies
// Basically what happens is that the data is send in form of raw chuncks not string or JSON
// first we need to receive the chunks then then convert them to string and then JSON.parse()
// and the limit extends the limit of the request body for image uploads
app.use(cookieParser())
app.use(cors())

app.use("/api/v1", userRoutes);

dbConnector();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.get("/",(req,res)=>{
    res.send("Hello From Server")
})
