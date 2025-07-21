const express = require('express');
const router = express.Router();

const {validateSignupData} = require('../utils/validation');
const {UserModel} = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {  
    try {        
        validateSignupData(req);
        
        const {emailId, password} = req.body;

        const userExist = await UserModel.findOne({emailId})
        
        if (userExist) return res.status(400).json({message:'user already exist'})

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new UserModel({...req.body, password: passwordHash});
        await user.save();

        return res.status(200).json({message:'new user created'})
    } catch (error) {
        return res.status(400).json({'Error': error.message})
    }
});

router.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email address");
        } else {
            const user = await UserModel.findOne({emailId});

            if (!user) throw new Error("Invalid credential");          

            const isValidPassword = await user.validatePassword(password)

            if (isValidPassword) {
                const token = user.getJWT();
                res.cookie('token', token);
                return res.status(200).json({message: 'Login successful'})
            } else {
                throw new Error("Invalid credential");
            }
        }
    } catch (error) {
        return res.status(400).json({'Error': 'Login failed due to '+error.message})
    }
});

router.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })

    res.status(200).json({message: 'logged out'})
})

module.exports = router;