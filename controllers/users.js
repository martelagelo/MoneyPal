var User = require('../models/User.js');
var jwt = require('../JWT_Service/jwt.js');
var passport = require('passport');

exports.login = function(req,res,next){
	passport.authenticate('local', function(err, user){
		if(err) next(err);
		req.login(user, function(err){
			if(err) {
				res.status(401).send({
					status: false,
					user: null,
					token: null,
					msg: "User not validated"
				})
			} else createSendToken(user, res);
		});
	})(req,res,next);
};

function createSendToken(user, res) {
	var payload = {
		sub:user.id
	}
	var token = jwt.encode(payload,"shhh...");
	res.status(200).send({
		status: true,
		user:user,
		token:token
	});
}

exports.changePassword = function(req, res, next) {
	var user = req.user;
	User.findByIdAndUpdate(user._id, {$set: req.body.data}, function(err, report) {
		if (!err) {
      		res.status(200).send({
      			status: true,
      		});
      	} else {
      		res.status(401).send({
      			status: false,
      			msg: "Password could not be changed"
      		});
      	}
	});
};

exports.changeProfile = function(req, res, next) {
	var user = req.user;
	User.findByIdAndUpdate(user._id, {$set: req.body.data}, function(err, user) {
		if (!err) {
      		res.status(200).send({
      			status: true,
      			user: user,
      		});
      	} else {
      		res.status(401).send({
      			status: false,
      			msg: "Profile could not be changed"
      		});
      	}
	});
};

exports.comparePasswords = function(req, res, next) {
	var user = req.user;
	if(user.password == req.body.data) {
		res.status(200).send({
			status: true
		});
	} else {
		res.send({
			status: false
		});
	}
};

exports.logout = function (req, res) {
	req.session.destroy();
	req.logout();
	res.send({
		status:true
	});
};

exports.checkToken = function (req, res) {
	var token = req.headers.authorization.split(' ')[1];
 	var payload = jwt.decode(token,"shhh...");
 	if(!payload.sub) {
 		res.status(401).send({
 			status	: false,
			data	: null,
			msg 	:'Request Token missing'
		});
 	}
 	if(!req.headers.authorization){	
 		res.status(401).send({
 			status	: false,
			data	: null,
			msg 	:'You are not authorized'
		});
 	}
};

exports.getAllUsers = function(options,cb){
	User.find().select(options.select).exec(cb);
};

