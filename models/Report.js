const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Report = new Schema({
  perfScore : Number,
  firstContentfulPaint : Number,
  speedIndex: Number,
  timeToInteractive: Number,
  json: Schema.Types.Mixed,
  createdAt : { type: Date, required: true, default: Date.now },
}, { 
  strict: false,
});

module.exports = mongoose.model('Report', Report);
