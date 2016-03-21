var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName      : String,
	lastName       : String,
	userName	   : String,
	email		   : String,
	password       : String,
	isAdmin        : {type: Boolean, default: false},
	lastUpdatedAt  : {type: Date, default: Date.now},
	salary		   : {type: Number, default: 0}
});

UserSchema.statics = {
  //Function that gets the user details based on the input provided
  load: function (options, cb) {
  //this select criteria is used if the user wants to see specific attributes in the response.
    options.select = options.select;
    this.findOne(options.criteria).select(options.select).exec(cb);
  },
};

module.exports = mongoose.model('User', UserSchema);