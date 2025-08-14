const jwt = require('jsonwebtoken');
const {UserModel} = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        
        const {token} = req.cookies;
    
        if (!token) {
            return res.status(401).json({Error: 'Please login'})
        }
    
        const decodedObj = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: '1d'});
    
        const _id = decodedObj._id;
        
        const user = await UserModel.findById(_id);
    
        if (!user) {
            throw new Error("Please login");
        }

        req.user = user
        next();
    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
}

module.exports = {userAuth}