const express = require("express");
const tripRouter = express.Router();
const tripModel = require("../models/trip");
const categoryModel = require("../models/category")

tripRouter.post("/trips",async (req,res) => {
    try {
        const tripDetails = req.body;
        if (new Date(tripDetails.endDate) < new Date(tripDetails.startDate)) {
            return res.status(400).send({
                message: "End date must be after start date"
            });
        }

        if (tripDetails.availableSeat > tripDetails.maxCapacity) {
            return res.status(400).send({
                message: "Available seats cannot exceed max capacity"
            });
            }

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

tripRouter.post("/trips/:id/book",async (req,res) => {
    try{
    const _id = req.params.id;
    const trip = await tripModel.findOneAndUpdate(
                {
                    _id,
                    status: "Published",
                    availableSeat: { $gt: 0 },
                    startDate: { $gt: new Date() }
                },
                { $inc: { availableSeat: -1 } },
                { new: true }
                );

    if (!trip)
        return res.status(409).send({message:"No seat available"});
    
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

tripRouter.get("/trips",async (req,res) => {
    try {
        const { destination,startDate,category,minPrice,maxPrice,sortBy,order } = req.query; 
        const filter = {status:'Published'};
        if (destination)
        {
            filter.destination = destination.toLowerCase();
        } 
        if (startDate)
        {
            filter.startDate = { $gte: new Date(startDate) };
        }
        if (category) 
        {
            filter.categories = { $in: [category] };
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

tripRouter.get("/trips/:id",async (req,res) => {
    try{
        const _id = req.params.id;
        console.log(_id)
        const tripDetails = await tripModel.findById(_id).populate("categories","name -_id");
        console.log(tripDetails)
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

module.exports = tripRouter;