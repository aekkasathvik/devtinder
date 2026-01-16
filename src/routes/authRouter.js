const express = require('express');
const authRouter = express.Router();
const userAuth=require('../middlewares/userAuth');
const User = require('../models/users');
const jwt=require('jsonwebtoken');
const bcrypt= require('bcrypt');
const validator = require('validator');
const { isValidSignUp } = require('../utils/validate');
authRouter.post('/signup', async (req, res) => {
   try {
    isValidSignUp(req); // Validate the signup data
    const {password}=req.body;
    const hashedPassword= await bcrypt.hash(password,10);
    req.body.password=hashedPassword;
    const user = new User(req.body);
    await user.save(); // Save the user to the database
    res.status(201).send("User signed up successfully");
   }
   catch (err) {
    //catch the error and send the error message to the client
    res.status(400).send("Error during signup: " + err.message);
   }
   finally {
    console.log("Signup attempt completed");
   }
});

// login route 
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send("Invalid email format");
        }

        // 2. Check user existence
        const userRecord = await User.findOne({ email });

        if (!userRecord) {
            return res.status(400).send("Invalid credentials");
        }

        // 3. Password verification
        const isMatch = await userRecord.validatePassword(password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        //we have the user now create a cookie for the user 
        const token=await userRecord.getJWT();
        console.log(token);
        res.cookie("token",token);
        res.user=userRecord;
        return res.status(200).send("Login successful");

    } catch (err) {
        return res.status(500).send("Bad request: " + err.message);
    } finally {
        console.log("login attempt completed");
    }
});

//logout Route - Clear the cookie+check if the user is valid user or not first and then logout
authRouter.post('/logout',userAuth,async (req,res)=>{

    try {
       
       res.cookie('token' ,null ,{expires: new Date(Date.now())})
       .send('Logged Out successfully').status(200);

    }
    catch(err) {
        res.status(500).send("Error during logout:" +err.message);
    }
    finally {
        console.log("Logout route executed");
    }
});

module.exports=authRouter;