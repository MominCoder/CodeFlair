const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

router.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;        

        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
});

router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }
        
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        
        return res.status(200).json({message: 'user updated successfully', data: loggedInUser})
        
    } catch (error) {
        res.status(400).json({Error: error.message})
    }
})

module.exports = router;