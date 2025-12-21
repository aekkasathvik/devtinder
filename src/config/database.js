const mongoose = require('mongoose');
const url="mongodb+srv://test:abcd@NamasteNodeJs.mcvpc9p.mongodb.net/devtinder?retryWrites=true&w=majority&appName=NamasteNodeJs";
const connectDB = async () => {
    try {
        await mongoose.connect(url);
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
};

module.exports = { connectDB };