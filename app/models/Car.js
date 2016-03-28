var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
  createdOn: {type: Date, default: Date.now},
  make: String,
  model: String,
  year: Number,
  licenseplate: String,
  owner: String,
}) 

module.exports = mongoose.model('Car', CarSchema);