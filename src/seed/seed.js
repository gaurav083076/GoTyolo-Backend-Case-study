require("dotenv").config();
const mongoose = require("mongoose");
const categoryModel = require("../models/category");
const tripModel = require("../models/trip");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_SECRET);
        console.log("Connected to DB");

        // Clear old data
        await categoryModel.deleteMany({});
        await tripModel.deleteMany({});

        // Add categories
        const categories = await categoryModel.insertMany([
            { name: "Adventure" },
            { name: "Cultural" },
            { name: "Women-Only" },
            { name: "Weekend" },
            { name: "International" }
        ]);

        console.log("Categories added");

        // Add trips
        await tripModel.insertMany([
            {
                title: "Ladakh Bike Trip",
                destination: "Ladakh",
                startDate: new Date("2025-03-15"),
                endDate: new Date("2025-03-22"),
                price: 25000,
                maxCapacity: 20,
                availableSeat: 20,
                status: "Published",
                categories: [categories[0]._id, categories[3]._id]
            },
            {
                title: "Rajasthan Heritage Tour",
                destination: "Jaipur",
                startDate: new Date("2025-04-10"),
                endDate: new Date("2025-04-15"),
                price: 18000,
                maxCapacity: 35,
                availableSeat: 35,
                status: "Published",
                categories: [categories[1]._id]
            },
            {
                title: "Goa Weekend Getaway",
                destination: "Goa",
                startDate: new Date("2025-02-20"),
                endDate: new Date("2025-02-23"),
                price: 12000,
                maxCapacity: 30,
                availableSeat: 30,
                status: "Published",
                categories: [categories[3]._id]
            },
            {
                title: "Thailand Trip",
                destination: "Bangkok",
                startDate: new Date("2025-05-01"),
                endDate: new Date("2025-05-08"),
                price: 45000,
                maxCapacity: 15,
                availableSeat: 15,
                status: "Draft",
                categories: [categories[4]._id]
            }
        ]);

        console.log("Trips added");
        console.log("Seed data complete!");
        process.exit(0);

    } catch (err) {
        console.log("Error:", err.message);
        process.exit(1);
    }
};

seedData();