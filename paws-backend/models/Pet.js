const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    desc: { type: String, required: true },
    imageUrl: { type: String, default: 'default.jpg' },
    type: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Pet', petSchema);