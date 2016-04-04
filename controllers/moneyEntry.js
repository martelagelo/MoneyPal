var MoneyEntry = require('../models/MoneyEntry.js');
var loginContoller = require('./users.js');
var Topic = require('../models/Topic.js');
var unirest = require('unirest');

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

exports.getMoneyEntriesForCalendar = function(req, res) {
	var fields = 'cost isCost year month day';
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id}, select:fields}, function(err, entries) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				entries: entries,
				user: req.user
			});
		}
	});
}

exports.getMoneyEntriesByDay = function(req, res) {
	MoneyEntry.getMoneyEntries({criteria: {userId: req.user._id, day:req.query.day, month:req.query.month, year:req.query.year}}, function(err, allMoneyEntries) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				allMoneyEntries: allMoneyEntries,
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
	var fields = 'cost isCost';
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
	getNewTopics(entry.description, req.user);
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
	var fields = 'location description latlng';
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

function getNewTopics(description, user) {
	var fields = 'keywords topics keywordFreqs topicFreqs';
	unirest.post("https://twinword-topic-tagging.p.mashape.com/generate/")
	.header("X-Mashape-Key", "5D7ZbLtpR7mshm3Y0JR5oHY42Tbip1BE21ljsnUuSmKsM0XyfJ")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.header("Accept", "application/json")
	.send("text="+description)
	.end(function (result) {
		Topic.getTopics({criteria: {userId: user._id}, select: fields}, function(err, topic) {
			if (topic.length == 0) {
		 		var entry = {
		 			userId 		: user._id,
		 			keywords	: [],
		 			keywordFreqs: [],
		 			topics 		: [],
		 			topicFreqs  : []
		 		};
		 		for(var key in result.body.topic) {
		 			entry.topics.push(key);
		 			entry.topicFreqs.push(result.body.topic[key]);
		 		}
		 		for(var key in result.body.keyword) {
		 			entry.keywords.push(key);
		 			entry.keywordFreqs.push(result.body.keyword[key]);
		 		}
				var topic = new Topic(entry);
				topic.save();
			} else {
				var entry = topic[0];
				for(var key in result.body.topic) {
		 			if (entry.topics.indexOf(key) == -1) {
		 				entry.topics.push(key);
		 				entry.topicFreqs.push(result.body.topic[key]);
		 			} else {
		 				entry.topicFreqs[entry.topics.indexOf(key)] = entry.topicFreqs[entry.topics.indexOf(key)] + result.body.topic[key];
		 			}
		 		}
		 		for(var key in result.body.keyword) {
		 			if (entry.keywords.indexOf(key) == -1) {
		 				entry.keywords.push(key);
		 				entry.keywordFreqs.push(result.body.keyword[key]);
		 			} else {
		 				entry.keywordFreqs[entry.keywords.indexOf(key)] = entry.keywordFreqs[entry.keywords.indexOf(key)] + result.body.keyword[key];
		 			}
				}
				Topic.findByIdAndUpdate(entry._id, {$set: entry}, function(err, entry) {
		 		});
			}
		});
	});
};