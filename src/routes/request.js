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

        const allowedStatus = ['interested', 'ignored'];

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

        if (existingConnectionRequest && existingConnectionRequest.status === 'interested') {
            throw new Error("Connection request already sent");
        }
        else if (existingConnectionRequest && (existingConnectionRequest.status === 'ignored' || existingConnectionRequest.status === 'rejected')) {
            throw new Error("blocked by user");
        }
        else if(existingConnectionRequest){
            throw new Error("already a match");
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save()
        
        return res.status(200).json({message: `${req.user.firstName} ${status} ${toUser.firstName}`})

    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
});

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ['accepted', 'rejected'];

        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid status");
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if(!connectionRequest){
            return res.status(400).json({Error: 'connection request not found'})
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()

        return res.status(200).json({message: `connection request ${status}`})

    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
});

module.exports = router