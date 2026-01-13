const express=require("express");
const profileRouter=express.Router();
const userAuth=require('../middlewares/userAuth');
//route to get the profile of the user based on cookie
const user=require('../models/users');
//get all the profiles 
profileRouter.get('/profile',userAuth,async (req,res)=>{
    try {

    }
    catch(err) {

    }
    finally {
        console.log("Profile route executed");
    }
 })

 module.exports=profileRouter;