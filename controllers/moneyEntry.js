var MoneyEntry = require('../models/MoneyEntry.js');
var loginContoller = require('./users.js');

exports.getMoneyEntries = function(req, res) {
	MoneyEntry.getMoneyEntries({criteria: {userId: req.params.id}}, function(err, allMoneyEntries) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				allMoneyEntries: allMoneyEntries,
				user: req.user
			});
		}
	});
};

exports.getMoneyEntriesByDay = function(req, res) {
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id, day:req.body.day, month:req.body.month, year:req.body.year}}, function(err, allMoneyEntries) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				allMoneyEntries: allMoneyEntries,
				user: req.user
			});
		}
	});
};

exports.getCostsByDay = function(req, res) {
	var fields = 'cost isCost';
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id, day:req.query.day, month:req.query.month, year:req.query.year}, select:fields}, function(err, listOfCosts) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				listOfCosts: listOfCosts,
				user: req.user
			});
		}
	});
};

exports.getCostsByMonth = function(req, res) {
	var fields = 'cost isCost day';
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id, month:req.query.month, year:req.query.year}, select:fields}, function(err, listOfCosts) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				listOfCosts: listOfCosts,
				user: req.user
			});
		}
	});
};

exports.getCostsByYear = function(req, res) {
	var fields = 'cost isCost';
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id, year:req.query.year}, select:fields}, function(err, listOfCosts) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				listOfCosts: listOfCosts,
				user: req.user
			});
		}
	});
};

exports.getAllMoneyEntries = function(option, cb) {
	MoneyEntry.find().select(options.select).exec(cb);
};

exports.createMoneyEntry = function(req, res, next) {
	loginContoller.checkToken(req, res);
	var entry = new MoneyEntry(req.body.entry);
	entry.save(function(err, createdEntry) {
		if(err) {
			res.status(409).send({
				status	: false,
				data	: null,
				msg		: err
			});
		} else{
			res.status(201).send({
	    		status	: true,
	    		data	: createdEntry,
	    		msg		: "Successfully created"
			});
		}
	});
};

exports.deleteMoneyEntry = function(req, res, next) {
	MoneyEntry.findById(req.params.id, function(err, entry) {
		if(entry != null) {
			MoneyEntry.findByIdAndRemove(req.params.id, function(err, e) {
				if(err) res.status(500).send({status: false});
				res.status(200).send({
					status: true,
					request: e
				})
			})
		} else {
			res.status(401).send({
				status	: false,
				data	: null,
				msg		: "Unable to delete the record as it is either in processing or the record doesn't exist"
			});
		}
	});
};

exports.updateMoneyEntry = function(req, res, next) {
	//Do this only if the reportStatus is pending and not processing or available.
	MoneyEntry.findByIdAndUpdate(req.params.id, {$set: req.body.entry}, function(err, entry) {	
		if(err){
			res.status(401).send({
    			status	: false,
    			data	: null,
    			msg		: err
			});
		} else {
			res.status(201).send({
    			status	: true,
    			data    : entry,
    			msg		: "Successfully Updated"
			});
		}		
	});	
};

exports.getMoneyLocations = function(req, res, next) {
	var fields = 'location description';
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id}, select: fields}, function(err, listOfLocations) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				listOfLocations: listOfLocations,
				user: req.user
			});
		}
	});
};