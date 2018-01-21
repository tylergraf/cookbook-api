const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  name: String,
  picture: String,
  email: String,
  email_verified: Boolean,
  uid: String,
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
