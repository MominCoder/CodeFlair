const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength:10
    },
    lastName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength:10
    },
    emailId:{
        type: String,
        required: true,
        lowercase:true,
        unique: true,
        trime: true
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
        required: true
    },
    skills:{
        type:[String]
    },
    image:{
        type: String,
        default:'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
    },
    bio:{
        type: String
    }
}, {timestamps:true});

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel}