const express = require('express');
const {connectDB} = require('./config/database');
var cors = require('cors')
const app = express();

const { UserModel } = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')

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

