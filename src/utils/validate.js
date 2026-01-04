const validator = require('validator');

function isValidSignUp(req) {
    const {firstName,email,password}=req.body;
    if(!firstName || firstName.length<2) {
        throw new Error("First Name is required and should be at least 2 characters long");
    }
    if(!validator.isEmail(email)) {
        throw new Error("Email is not in correct Format");
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

module.exports={isValidSignUp};