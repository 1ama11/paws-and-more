const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String
    },

    stock: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        enum: ["dog", "cat", "other"],
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
