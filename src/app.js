const express = require('express');
const {connectDB} = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();
app.use(express.json())

app.post('/signup', async (req, res) => {    
    try {
        const user = new UserModel(req.body);
        await user.save();

        console.log('user saved into db');
        res.status(200).json({message:'new user created'})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({Error: 'User already exist'})
    }
});

app.get("/feed", async (req, res) => {
    try {
        // const user = new UserModel(req.body);
        const allUsers = await UserModel.find({});        
        res.status(200).json({data: allUsers})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({Error: error.message})
    }
});

app.post("/profile", async (req, res) => {
    try {
        const user = await UserModel.findOne({_id: req.body.userId})
        res.status(200).json({data: user})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({Error: 'user not found'})
    }
});

app.delete('/profile', async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({_id: req.body.userId});
        res.status(200).json({message: `${user.firstName} deleted successfully`})
    } catch (error) {
        res.status(400).json({Error: 'user not found'})   
    }
});

app.patch('/profile', async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.body.userId, req.body, {returnDocument:"after"});
        res.status(200).json({message:'user updated succesfully', data: updatedUser});
    } catch (error) {
        res.status(400).json({Error: error.message});
    }
})

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

