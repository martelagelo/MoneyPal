var mongoose = require('mongoose');
var user = require('./User.js');
var Schema = mongoose.Schema;
var User = user.User;

var TopicSchema = new Schema({
	userId			: {type: Schema.Types.ObjectId, ref: 'User', defualt: null},
	topics  		: [{
		entry		: String, 
		freq		: Number,
		cost		: Number,
	}]
});

TopicSchema.statics = {
	getTopics: function(options,cb){
		this.find(options.criteria)
		.select(options.select)
		.exec(cb);
	},
}

module.exports = mongoose.model('Topic', TopicSchema);