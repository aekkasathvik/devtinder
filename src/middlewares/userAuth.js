//import the users model
const User = require('../models/users');
const jwt=require('jsonwebtoken');

//middleware function to authenticate user based on cookie      
const userAuth=async (req,res,next)=>{
    try {
        //get the cookie
        const {token}=req.cookies;
        if(!token) {
            throw new Error("No token found!!!");
        }
        //get the user if from the cookie 
        const decryptedObject=jwt.verify(token,"coder$4849");
        const {_id}=decryptedObject;
        //find the user based on id
        const userRecord=await User.findById(_id);
        if(!userRecord) {
            throw new Error("User not found");
        }
        req.user=userRecord;
        next(); //go to the next middleware or the route handler
    }
    catch(err) {
        res.status(401).send("Unauthorized: "+ err.message);
    }   
    finally {
        console.log("User Authentication middleware executed");
    }

};
module.exports=userAuth;