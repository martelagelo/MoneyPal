var AutomaticEntry = require('../models/AutomaticEntry.js');
var loginContoller = require('./users.js');

exports.getAutomaticEntries = function(req, res) {
	AutomaticEntry.getAutomaticEntries({criteria: {userId: req.params.id}}, function(err, allEntries) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				data: allEntries,
				user: req.user
			});
		}
	});
};

exports.createAutomaticEntry = function(req, res) {
	loginContoller.checkToken(req, res);
	var entry = new AutomaticEntry(req.body.entry);
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

exports.deleteAutomaticEntry = function(req, res) {
	AutomaticEntry.findById(req.params.id, function(err, entry) {
		if(entry != null) {
			AutomaticEntry.findByIdAndRemove(req.params.id, function(err, e) {
				if(err) res.status(500).send({status: false});
				res.status(200).send({
					status: true,
					data: e
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
	AutomaticEntry.findByIdAndUpdate(req.params.id, {$set: req.body.entry}, function(err, entry) {	
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



