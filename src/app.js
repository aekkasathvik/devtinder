const express = require('express');
const app = express();
const validator = require('validator');
const { isValidSignUp } = require('./utils/validate');
const User = require('./models/users');  // FIXED: Capitalized Model import
const { connectDB } = require('./config/database');
const bcrypt= require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const userAuth=require('./middlewares/userAuth');
// Middleware to parse cookies
app.use(cookieParser());
// Parse JSON body and convert it into JS object so that we can use the body inside route handlers 
app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
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
app.post("/login", async (req, res) => {
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
        const isMatch = await bcrypt.compare(
            password,
            userRecord.password
        );

        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        //we have the user now create a cookie for the user 
        const token=jwt.sign({_id:userRecord._id},"coder$4849",{expiresIn:"1h"});
        res.cookie("token",token);
        return res.status(200).send("Login successful");

    } catch (err) {
        return res.status(500).send("Bad request: " + err.message);
    } finally {
        console.log("login attempt completed");
    }
});
//get the profile of the user based on cookie 
app.get('/profile',userAuth , async (req,res)=>{
    try {
       const userRecord=req.user;
        res.send(userRecord);
    }
    catch(err) {
        res.status(400).send("bad request"+ err.message);
    }

});

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
