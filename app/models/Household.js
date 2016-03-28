var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HouseholdSchema = new Schema({
  fbId: String,
  createdOn: {type: Date, default: Date.now},
  address: String,
  zipcode: String,
  city: String,
  State: String,
  bedrooms: Number,
  people: [{type: mongoose.Schema.Types.ObjectId, ref: 'Person'}],
  cars: [{type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
}) 

module.exports = mongoose.model('Household', HouseholdSchema);