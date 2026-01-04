const mongoose = require('mongoose');
const validator = require('validator');
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

module.exports = mongoose.model('User', userSchema);
