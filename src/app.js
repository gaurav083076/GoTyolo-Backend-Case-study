require("dotenv").config()
const express = require("express");
const app = express();
const connectDb = require("./config/database");

app.use(express.json());

const categoryRouter = require("./routes/category.js");
const tripRouter = require("./routes/trip.js");

app.use('/',categoryRouter);
app.use('/',tripRouter);

connectDb().then(() => {
    app.listen(process.env.PORT, () => {
         console.log(`Server connect to port ${process.env.PORT}`)
    });
})
.catch((error) => {
    console.error("Database not connected successfully!",error.message);
})