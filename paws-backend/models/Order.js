const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName:  { type: String, required: true },
    address:   { type: String, required: true },
    items:     { type: Array,  required: true },
    total:     { type: Number, required: true },
    donated:   { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
