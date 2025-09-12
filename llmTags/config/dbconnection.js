import mongoose from "mongoose";

const dbConnector = async()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGODBURL}/${process.env.MONGODBDBNAME}`)
        console.log(`MONGO_DB Connected !!!! DB:HOST:${connection.connection.host}`);
    }
    catch(err){
        console.error("Database connection error:", err);
         process.exit(1);
    }
}

export default dbConnector;
