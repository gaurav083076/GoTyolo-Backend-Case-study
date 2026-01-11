require("dotenv").config()
const express = require("express");
const app = express();
const connectDb = require("./config/database");
const categoryModel = require("./models/category");
const tripModel = require("./models/trip");

app.use(express.json());

app.post("/categories",async (req,res) => {
    try {
        const categoryName = req.body;
        const addCategory = new categoryModel(categoryName);
        await addCategory.save();
        res.status(201).send("Category added successfully.")
    }
    catch(err)
    {
        if (err.name === "ValidationError")
            res.status(400).send("Error: " + err.message);
        else
            res.status(500).send("Error: " + err.message);
    }
})

app.get("/categories",async (req,res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).send(
            {categories: categories}
        );
    }
    catch(err)
    {
        res.status(500).send("Error: "+err);
    }
})

app.post("/trips",async (req,res) => {
    try {
        const tripDetails = req.body;
        const addTrip = new tripModel(tripDetails);

        if (tripDetails.categories && tripDetails.categories.length > 0) {
            const validCategories = await categoryModel.find({
            _id: { $in: tripDetails.categories }
            });
        if (validCategories.length !== tripDetails.categories.length) {
            return res.status(400).send({ message: "Invalid category ID" });
            }
        }        
        await addTrip.save();
        res.status(201).send({
            "message":"Trip added successfully",
            "data":addTrip
        })
    }
    catch(err)
    {
        if (err.name === "ValidationError")
            res.status(400).send("Error: "+err.message)
        else
            res.status(500).send("Error: "+err.message);
    }
})

app.post("/trips/:id/book",async (req,res) => {
    try{
    const _id = req.params.id;
    const trip = await tripModel.findById(_id);

    if (!trip)
        return res.status(404).send({message:"Trip not found"});

    if (trip.availableSeat === 0)
        return res.status(400).send({message:"No seat available"});

    trip.availableSeat = trip.availableSeat - 1;
    await trip.save();
    res.status(200).send({
        message:"Booking successful",
        availableSeat:trip.availableSeat
    })
  }
  catch(err)
  {
    if (err.name === "CastError")
        res.status(400).send({ message: "Invalid trip ID" });
    else
        res.status(500).send("Error: "+err.message);
  }
})

app.get("/trips",async (req,res) => {
    try {
        const { destination,startDate,category,minPrice,maxPrice,sortBy,order } = req.query; 
        const filter = {status:'Published'};
        if (destination)
        {
            filter.destination = destination;
        } 
        if (startDate)
        {
            filter.startDate = { $gte: new Date(startDate) };
        }
        if (category) 
        {
            filter.categories = category;
        }
        if (minPrice || maxPrice)
        {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const allowedSortFields = ["startDate","price"];
        let sort = {};
        if (allowedSortFields.includes(sortBy))
        {
            sort[sortBy] = order === "desc" ? -1 : 1;
        }
        const trips = await tripModel.find(filter).sort(sort);
        res.status(200).send({trips});
    }
    catch(err)
    {
        res.status(500).send("Error: "+err.message);
    }
})

app.get("/trips/:id",async (req,res) => {
    try{
        const _id = req.params.id;
        const tripDetails = await tripModel.findById(_id).populate("categories","name -_id");
        if (!tripDetails)
        {
            return res.status(404).send({ message: "No trip found" });
        }
        res.status(200).send(tripDetails);
    }
    catch(err)
    {
        if (err.name === "CastError")
            res.status(400).send({ message: "Invalid trip ID" });
        else
        res.status(500).send("Error: "+err.message);
    }
})


connectDb().then(() => {
    app.listen(process.env.PORT, () => {
         console.log(`Server connect to port ${process.env.PORT}`)
    });
})
.catch((error) => {
    console.error("Database not connected successfully!",error.message);
})