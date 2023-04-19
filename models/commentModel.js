var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	'postedBy': String,
	'parrentPost': String,
	'comment': String,
	'selected': String,
	'time': String
});

module.exports = mongoose.model('comment', commentSchema);
