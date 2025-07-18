const express = require('express');
const {connectDB} = require('./config/database');
const app = express();

const { UserModel } = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser())

const authRouter = require('./router/auth')
const profileRouter = require('./router/profile')

app.use('/', authRouter)
app.use('/', profileRouter)

app.get("/feed", async (req, res) => {
    try {
        // const user = new UserModel(req.body);
        const allUsers = await UserModel.find({});        
        return res.status(200).json({data: allUsers})
    } catch (error) {
        return res.status(400).json({Error: error.message})
    }
});

// app.post("/user", async (req, res) => {
//     try {
//         const user = await UserModel.findOne({_id: req.body.userId})
//         return res.status(200).json({data: user})
//     } catch (error) {
//         return res.status(400).json({Error: 'user not found'})
//     }
// });

app.delete('/user', async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({_id: req.body.userId});
        return res.status(200).json({message: `${user.firstName} deleted successfully`})
    } catch (error) {
        return res.status(400).json({Error: 'user not found'})   
    }
});

app.patch('/user', userAuth, async (req, res) => {

    try {
        const ALLOWED_FIELDS = ['skills', 'image', 'gender', 'bio', 'password']
    
        const isUpdateAllowed = Object.keys(req.body).every(f => ALLOWED_FIELDS.includes(f))
    
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        
        if (req.body?.skills?.length > 3) {
            throw new Error("maximum 3 skills allowed");
        }

        const user = req.user;

        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, req.body, {returnDocument:"after", runValidators: true});
        return res.status(200).json({message:'user updated succesfully', data: updatedUser});
    } catch (error) {        
        return res.status(400).json({Error: error.message});
    }
});

connectDB()
  .then(() => {
    console.log('database connected');
    app.listen(3000, () => {
        console.log(`server listening on port 3000`)
    });
})
  .catch(err => {
    console.log(err);
});

