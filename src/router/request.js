const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const {ConnectionRequestModel} = require('../models/connection');
const { UserModel } = require('../models/user');

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['like', 'pass'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({message: 'invalid status type'})
        }

        const toUser = await UserModel.findById(toUserId);
        
        
        if (!toUser) {
            return res.status(400).json({Error: 'User not fuond'})            
        }
        
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if (existingConnectionRequest) {
            throw new Error("Connection request already sent");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save()
        
        return res.status(200).json({message: `${req.user.firstName} ${status} ${toUser.firstName}`})

    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
})

module.exports = router