const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate: {
        type:Date,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    maxCapacity: {
        type:Number,
        required:true
    },
    availableSeat: {
        type:Number,
        required:true
    },
    status: {
        type:String,
        enum:['Draft','Published'],
        default:"Draft",
        required:true
    },
    categories: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    }]
})

const tripModel = mongoose.model("Trip",tripSchema);
module.exports = tripModel;