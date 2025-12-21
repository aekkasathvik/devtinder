const mongoose = require('mongoose');
require('dotenv').config();
const url="mongodb+srv://test:abcd@NamasteNodeJs.mcvpc9p.mongodb.net/devtinder?retryWrites=true&w=majority&appName=NamasteNodeJs";
const localUrl="mongodb://127.0.0.1:27017/devtinder";
const connectDB = async () => {
    try {
        await mongoose.connect(localUrl);
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
};
mongoose.set('bufferCommands', false);
module.exports = { connectDB };