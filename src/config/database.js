const mongoose = require("mongoose");

const connectDb = async () => {
    try{
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("connected to db");
    }
    catch(error)
    {
    console.error("Db connection failed",error.message);
    }
}

module.exports = connectDb;