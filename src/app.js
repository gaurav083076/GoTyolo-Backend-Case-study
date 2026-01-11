require("dotenv").config()
const express = require("express");
const app = express();
const connectDb = require("./config/database");

app.get("/",(req,res) => {
    res.send("...");
})

connectDb().then(() => {
    app.listen(process.env.PORT, () => {
         console.log(`Server connect to port ${process.env.PORT}`)
    });
})
.catch((error) => {
    console.error("Database not connected successfully!",error.message);
})