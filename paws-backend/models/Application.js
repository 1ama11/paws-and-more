const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    homeType: { type: String, required: true },
    hasOtherPets: { type: String, required: true },
    petName: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);