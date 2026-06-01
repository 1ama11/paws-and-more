const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:     { type: String, required: true, trim: true, minlength: 3 },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, required: true, match: /^\d{11}$/ },
  address:  { type: String, required: true, minlength: 5 },
  password: { type: String, required: true },           // will be bcrypt-hashed
  type:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
  image:    { type: String, default: 'default-avatar.png' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);