const express = require('express');
const {connectDB} = require('./config/database');
const { UserModel } = require('./models/user');

const app = express();
const port = 3000;

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: 'sachin',
        lastName: 'tendli',
        emailId: 'sachin@gmail.com',
        age: 36,
        password: 'sachin1234'
    }
try {
    const user = new UserModel(userObj);

    await user.save();

    res.status(200).json({message:'new user created'})
} catch (error) {
    res.status(400).json({message: error.message})
}
    
})


connectDB()
  .then(() => {
    console.log('database connected');
    app.listen(port, () => {
        console.log(`server listening on port ${port}`)
    });
})
  .catch(err => {
    console.log(err);
});

