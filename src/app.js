const express = require('express');
const app = express();

const User = require('./models/users');  // FIXED: Capitalized Model import
require('dotenv').config();

const { connectDB } = require('./config/database');

// Parse JSON body (important, even if you use static values now)
app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const newUser = new User({
            firstName: "Sathvik",
            lastName: "Aekka",
            age: 10
        });

        await newUser.save();  // FIXED: use await properly

        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(500).send('Error creating user: ' + err);
    }
});

// Connect DB and start server
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
