const express = require('express');
const {connectDB} = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();
app.use(express.json());

const validator = require('validator');
const bcrypt = require('bcrypt');

app.post('/signup', async (req, res) => {  
    try {        
        validateSignupData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new UserModel({...req.body, password: passwordHash});
        await user.save();

        res.status(200).json({message:'new user created'})
    } catch (error) {
        res.status(400).json({'Error': error.message})
    }
});

app.post('/login', async (req, res) => {
    try {
        const {emailId, password} = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid email address");
        } else {
            const user = await UserModel.findOne({emailId});

            if (!user) {
                throw new Error("Invalid credential");
            }          

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
                res.status(200).json({message: 'Login successful'})
            } else {
                throw new Error("Invalid credential");
            }
        }
    } catch (error) {
        res.status(400).json({'Error': 'Login failed due to '+error.message})
    }
})

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

app.post("/user", async (req, res) => {
    try {
        const user = await UserModel.findOne({_id: req.body.userId})
        res.status(200).json({data: user})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({Error: 'user not found'})
    }
});

app.delete('/user', async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({_id: req.body.userId});
        res.status(200).json({message: `${user.firstName} deleted successfully`})
    } catch (error) {
        res.status(400).json({Error: 'user not found'})   
    }
});

app.patch('/user/:userId', async (req, res) => {

    try {
        const ALLOWED_FIELDS = ['skills', 'image', 'gender', 'bio', 'password']
    
        const isUpdateAllowed = Object.keys(req.body).every(f => ALLOWED_FIELDS.includes(f))
    
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        
        if (req.body?.skills?.length > 3) {
            throw new Error("maximum 3 skills allowed");
        }

        const updatedUser = await UserModel.findByIdAndUpdate(req.params?.userId, req.body, {returnDocument:"after", runValidators: true});
        res.status(200).json({message:'user updated succesfully', data: updatedUser});
    } catch (error) {        
        res.status(400).json({Error: error.message});
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

