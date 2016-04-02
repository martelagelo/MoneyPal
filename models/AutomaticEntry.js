var mongoose = require('mongoose');
var user = require('./User.js');
var Schema = mongoose.Schema;
var User = user.User;

var AutomaticEntrySchema = new Schema({
	description			 : String,
	cost 				 : Number, 
	userId				 : {type: Schema.Types.ObjectId, ref: 'User', defualt: null},
	hour				 : Number,
	day					 : Number,
	month                : Number, 
	dayOfWeek			 : Number,
	isCost			     : {type: Boolean, default: true},
});

AutomaticEntrySchema.statics = {
	getAutomaticEntries: function(options,cb){
		this.find(options.criteria)
		.select(options.select)
		.exec(cb);
	},

}

module.exports = mongoose.model('AutomaticEntry', AutomaticEntrySchema);