const express = require('express');
const app = express();// FIXED: Capitalized Model import
const { connectDB } = require('./config/database');   // database connection module 
const cookieParser = require('cookie-parser');        //cookie parser middleware
const profileRouter=require('./routes/profileRouter'); //profile router 
const authRouter=require('./routes/authRouter');  //auth router
const requestRouter=require('./routes/requestRouter'); //user router
// Middleware to parse cookies
app.use(cookieParser());
// Parse JSON body and convert it into JS object so that we can use the body inside route handlers 
app.use(express.json());
//using the profile router for all the routes starting with /user
app.use('/user',profileRouter);
//using the auth router for all the routes starting with /auth
app.use('/auth',authRouter);
//using the request touter for all the routes starting with /request
app.use('/request',requestRouter);

//database connections and starting the server 
connectDB()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(3000, () => {
            console.log('server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log('Database connection failed', err);
    });
