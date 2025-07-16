const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        unique: true
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    },
    password:{
        type: String
    },
    skills:{
        type:[String]
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel}