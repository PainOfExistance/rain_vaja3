var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'postedBy' : String,
	'description' : String,
	'time' : String,
	'tags' : String
});

module.exports = mongoose.model('photo', photoSchema);
