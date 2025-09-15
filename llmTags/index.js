import express from 'express';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import cors from 'cors';
import bodyParser from 'body-parser';
import blogRoutes from './routes/blog.route.js';

import dbConnector from './config/dbconnection.js';
import {consumeQueue} from './tagcontentQueue.js'
//import tagRoutes from './routes/tagRoutes.js';

dotenv.config();

const app=express();
// bodyParser.json({limit:'30mb',extended:true});
app.use(bodyParser.json());
app.use(express.json());

const PORT=process.env.PORT || 5000;

dbConnector();
consumeQueue();

app.use('/api/v1/',blogRoutes)


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.get('/',(req,res)=>{
    res.send('Hello to Blogpedia LLM Tags API');
})
