const express = require('express');
const app = express();

const User = require('./models/users');  // FIXED: Capitalized Model import
require('dotenv').config();
const { connectDB } = require('./config/database');

// Parse JSON body and convert it into JS object so that we can use the body inside route handlers 
app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();  // FIXED: use await properly

        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(500).send('Error creating user: ' + err);
    }
});
//get the user based on his email 
app.get('/user',async (req,res)=>{
   try{
    const userRecord= await User.findOne({"email":req.body.email});
      if(!userRecord) {
        return res.status(400).send("User not found");
      }
      
        res.send(userRecord);
    }
   catch(err) {
       return  res.status(400).send("bad request" +err.message);
   }
});
//feed API where we get all the USERS
app.get('/feed',async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);    
    }
    catch(err) {
        res.status(400).send("bad request" +err.message);
    }
});
//deleting a user form the data base by email id 
app.delete('/deleteUser/:email',async (req,res)=>{
    try{
        const emailId=req.params.email;
        const UserRecord =await User.findOneAndDelete({email:emailId});
        if(!UserRecord) {
            res.send("The user is not present in the database");
        }
        res.send("deleted the User record successfully");
    }
    catch(err) {
        res.status(500).send("we can not delete the record");
    }
});


//update the user based on the detail provided
app.patch('/updateUser/:email',async (req,res)=>{
    try{
        const emailId=req.params.email;
        const updatedData=req.body;
        const options={new:true};
        const result= await User.findOneAndUpdate({email:emailId},updatedData,options);
        res.send(result);
    }           
    catch(err) {
        res.status(500).send("can not update the user"+ err.message);
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
