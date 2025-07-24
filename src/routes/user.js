const express = require('express')
const router = express.Router()
const {userAuth} = require('../middlewares/auth');
const { ConnectionRequestModel } = require('../models/connection');
const { UserModel } = require('../models/user');

// const USER_SAFE_DATA = 'firstName lastName age gender bio skills imageURL'
const USER_SAFE_DATA = 'firstName'

router.get('/user/request/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;        
        
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        })
        .populate('fromUserId', USER_SAFE_DATA)      

        return res.status(200).json({message: 'success', data: connectionRequest})

    } catch (error) {
        return res.status(400).json({Error: error.message})
    }   
})

router.get('/user/connections', userAuth, async (req, res) => {
    try {
       const loggedInUser = req.user
       
       const connections = await ConnectionRequestModel.find({
        $or:[
            { toUserId: loggedInUser._id, status: 'accepted' },
            { fromUserId: loggedInUser._id, status: 'accepted' }
        ]
       })
       .populate('fromUserId', USER_SAFE_DATA)
       .populate('toUserId', USER_SAFE_DATA)

       const data = connections.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
       });

       return res.status(200).json({message: 'success', data})
       
    } catch (error) {
        return res.status(400).json({Error : error.message})
    }
})

router.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = (parseInt(req.query.limit) > 5) ? 5 : parseInt(req.query.limit); 
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId')

        const connectedUserIds = new Set()

        connectionRequests.forEach(req => {
            connectedUserIds.add(req.fromUserId)
            connectedUserIds.add(req.toUserId)
        });

        connectedUserIds.add(loggedInUser._id);

        const users = await UserModel.find({
            _id: { $nin: Array.from(connectedUserIds) }
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        return res.status(200).json({data: users})

    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
})

module.exports = router;