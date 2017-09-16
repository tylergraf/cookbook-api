const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const trackSchema = new Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  _tracker: {type: ObjectId, ref: 'Tracker'},
  value: Number
});

module.exports = mongoose.model('Track', trackSchema);
