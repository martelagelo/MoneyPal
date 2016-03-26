var mongoose = require('mongoose');
var user = require('./User.js');
var Schema = mongoose.Schema;
var User = user.User;

var MoneyEntrySchema = new Schema({
	description			 : String,
	cost 				 : Number, 
	location			 : {type: String, default: null}, 
	latlng		   		 : {lat: Number, lng: Number},
	userId				 : {type: Schema.Types.ObjectId, ref: 'User', defualt: null},
	date				 : {type: Date, default: Date.now},
	month                : Number,
	day					 : Number, 
	year				 : Number,
	dayOfWeek			 : Number,
	isCost			     : {type: Boolean, default: true},
});

MoneyEntrySchema.statics = {
	getMoneyEntries: function(options,cb){
		this.find(options.criteria)
		.select(options.select)
		.exec(cb);
	},

}

module.exports = mongoose.model('MoneyEntry', MoneyEntrySchema);