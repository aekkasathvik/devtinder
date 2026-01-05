const { JsonWebTokenError } = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName: { type: String ,required: true , minLength:2},
    lastName: { type: String },
    email: { type: String , unique: true , required: true ,trim:true ,lowercase:true ,
        validate(data) {
            if(!validator.isEmail(data)) {
                throw new Error("Not a Valid Email Address");
            }
        }
    },
    password: { type: String ,required: true , minLength:6,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is not strong enough');
            }
        }
     },
    age: { type: Number, min:18},
    gender: { type: String ,
        validate(value) {
            if(!['Male','Female','Other'].includes(value)) {
                throw new Error('Gender is invalid');
        }
     }},
    bio: { type: String ,
        default:"the default value for Bio ",
     },
    dataOfBirth:{type:Date},
    interests: { type: [String] }
},{timestamps:true});
userSchema.methods.getJWT=async function () {
    //we generate the token and pass it to the client
    const user=this;
    const token=jwt.sign({_id:user._id},"coder$4849",{expiresIn:"1h"});
    return token;
};
userSchema.methods.validatePassword=async function (password) {
    //we get the user entered password and compare it with the hashed password in the db
    const user=this; 
    const hashedPassword=user.password;
    const isMatch=await bcrypt.compare(password,hashedPassword);
    return isMatch;
};
module.exports = mongoose.model('User', userSchema);
