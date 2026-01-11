const express = require("express");
const  categoryRouter = express.Router();
const categoryModel = require("../models/category");


categoryRouter.post("/categories",async (req,res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "Category name is required" });
        }
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

categoryRouter.get("/categories",async (req,res) => {
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

module.exports = categoryRouter;