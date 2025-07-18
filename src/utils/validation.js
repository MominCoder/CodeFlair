const validator = require('validator');

const validateSignupData = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email address");
    }
    else if (!firstName || !lastName ) {
        throw new Error("Enter name between 3-10 characters");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }    
}

module.exports = {validateSignupData}