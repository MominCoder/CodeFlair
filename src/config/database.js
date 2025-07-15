const mongoose = require("mongoose");

const uri = 'mongodb+srv://NodeMomin:9941nBu7xQwiFjL0@codeflaircluster.eluyhyf.mongodb.net/codeFlair';

const connectDB = async () => {
  await mongoose.connect(uri);
}

module.exports = {connectDB}