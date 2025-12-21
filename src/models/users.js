const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String ,required: true , minLength:2},
    lastName: { type: String },
    email: { type: String , unique: true , required: true ,trim:true ,lowercase:true},
    password: { type: String ,required: true , minLength:6 },
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
