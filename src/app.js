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
const requestRouter = require('./router/request')
const userRouter = require('./router/user')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)

app.delete('/user', async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({_id: req.body.userId});
        return res.status(200).json({message: `${user.firstName} deleted successfully`})
    } catch (error) {
        return res.status(400).json({Error: 'user not found'})   
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

