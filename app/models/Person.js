var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
  createdOn: {type: Date, default: Date.now},
  firstname: String,
  lastname: String,
  email: String,
  age: Number,
  gender: String,
  cars: [{type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
}) 

module.exports = mongoose.model('Person', PersonSchema);