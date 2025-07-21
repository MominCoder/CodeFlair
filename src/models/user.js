const mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength:10,
        trim:true,
        validate(value){
            if (!validator.isAlpha(value)) {
                throw new Error("only alphabets allowed");
            }
        }
    },
    lastName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength:10,
        trim:true,
        validate(value){
            if (!validator.isAlpha(value)) {
                throw new Error("only alphabets allowed");    
            }
        }
    },
    emailId:{
        type: String,
        required: true,
        lowercase:true,
        unique: true,
        trime: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error("Invallid email address");   
            }
        }
    },
    age:{
        type: Number,
        min: 15
    },
    gender:{
        type: String,
        required: true,
        // enum:['male', 'female', 'others']
        validate(value){
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password");
            }
        }
    },
    skills:{
        type:[String],
        validate(value){            
            if (value.length > 3) {
                throw new Error("maximum 3 skills allowed");
            }
        }
    },
    imageURL:{
        type: String,
        default:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740',
        validate(value){
            if (!validator.isURL(value)) {
                throw new Error("invalid image url");
            }
        }
    },
    bio:{
        type: String,
        default: `I'm a liver`
    }
}, {timestamps:true});

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, 'namasteNodeDev', {expiresIn: '1d'});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInput) {
    const passwordHash = this.password;
    const isValidPassword = await bcrypt.compare(passwordInput, passwordHash);
    return isValidPassword;
}

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel}