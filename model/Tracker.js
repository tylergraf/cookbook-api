const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const trackerSchema = new Schema({
  title: String,
  type: String,
  _user: {type: ObjectId, ref: 'User'},
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracker', trackerSchema);
