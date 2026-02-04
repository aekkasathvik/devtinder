const express=require("express");
const profileRouter=express.Router();
const userAuth=require('../middlewares/userAuth');
const validateEditProfile=require('../utils/validateEditProfile');
//route to get the profile of the user based on cookie
const User=require('../models/users');
const app=express();
profileRouter.use(express.json());
//get all the profiles 
profileRouter.get('/profile',userAuth,async (req,res)=>{
    try { 
        res.send({message:req.user});
    }
    catch(err) {

    }
    finally {
        console.log("Profile route executed");
    }
 })
//update the profile of the user
 profileRouter.patch('/updateProfile',userAuth ,async(req,res)=>{
    try {
        //get the date from the body
       if(!validateEditProfile(req)) {
            throw new Error("Attempt to edit restricted fields");
       }
       const loggedInUser=req.user;
       console.log(loggedInUser);
       Object.keys(req.body).forEach((fields)=>{
        loggedInUser[fields]=req.body[fields];
       })
       //update the user in the database
       await loggedInUser.save();
      res.status(200).send("Profile updated successfully");

    }       
    catch(err) {
        res.status(400).send({error:err.message+" error in updating profile"});
    }
    finally {
        console.log("Update profile route executed");
    }
 });


 //update the profile password API

 profileRouter.patch('/updatePassword',userAuth,(req,res)=>{
    try {

    }
    catch(err) {

    }
    finally {
        console.log("Update password route executed");
    }

 });
 module.exports=profileRouter;