var AutomaticEntry = require('../models/AutomaticEntry.js');
var loginContoller = require('./users.js');
var MoneyEntry = require('../models/MoneyEntry.js');
var User = require('../models/User.js');

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

var checkAutomaticEntries = function() {
	var curDate = new Date();
	loginContoller.getAllUsers({select:'_id'}, function(err, users) {
		for(var i = 0; i < users.length; i++) {
			AutomaticEntry.getAutomaticEntries({criteria: {userId: users[i]._id}}, function(err, allAutoEntries) {
				for(var j = 0; j < allAutoEntries.length; j++) {
					if (allAutoEntries[j].day == null && allAutoEntries[j].month == null && allAutoEntries[j].dayOfWeek == null) {
						//console.log("Hit: Every Day");
						saveAutoAsMoney(allAutoEntries[j], curDate);
					} else if (allAutoEntries[j].day == curDate.getDate() && allAutoEntries[j].month == curDate.getMonth()) {
						saveAutoAsMoney(allAutoEntries[j], curDate);
					} else if (allAutoEntries[j].dayOfWeek == curDate.getDay() || allAutoEntries[j].day == curDate.getDate() && allAutoEntries[j].month == null) {
						saveAutoAsMoney(allAutoEntries[j], curDate);
					}
				};
			});
		};
	});
};
exports.checkAutomaticEntries = checkAutomaticEntries;

var saveAutoAsMoney = function(e, curDate) {
	var M_entry = {
		description : e.description, 
		cost 		: e.cost,
		isCost 		: e.isCost,
		latlng		: {lat: null, lng: null},
		userId		: e.userId,
		date 		: curDate,
		month		: curDate.getMonth(),
		year 		: curDate.getFullYear(),
		day 		: curDate.getDate(),
		dayOfWeek	: curDate.getDay()
	}
	var entry = new MoneyEntry(M_entry);
	entry.save();
};