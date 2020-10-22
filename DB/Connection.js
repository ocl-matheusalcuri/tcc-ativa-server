const mongoose = require('mongoose');

const URI = "mongodb+srv://elias:elias@cluster0.rm3ns.mongodb.net/<dbname>?retryWrites=true&w=majority";

const connectDB = async()=>{
  await  mongoose.connect(URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  console.log('db connected');
}

module.exports = connectDB;