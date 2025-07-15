const express = require('express');
// const connectDB = require('./config/db');

const app = express();

const port = 3000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});