const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');

router.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;        

        return res.status(200).json({data: {
           firstName: user?.firstName,
           lastName: user.lastName,
           age: user.age,
           gender:user.gender,
           skills: user.skills,
           imageURL: user.imageURL,
           bio: user.bio
        }})
    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
});

module.exports = router;