var yahooFinance = require('yahoo-finance');
var Topic = require('../models/Topic.js');

exports.getStockPrice = function(req, res) {
	yahooFinance.snapshot({
		symbols: [req.query.stock1, req.query.stock2, req.query.stock3],
		fields: ['s', 'n', 'l1'],
	}, function (err, snapshot) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				stocks: snapshot
			});
		}
	});
};

exports.getTopic = function(req, res) {
	var fields = 'keywords topics keywordFreqs topicFreqs topicCosts keywordCosts';
	Topic.getTopics({criteria: {userId: req.user._id}, select: fields}, function(err, topic) {
		if(err) {
			res.status(500).send({
				status: false
			});
		}
		else {
			res.status(200).send({
				status: true,
				data: topic,
			});
		}
	});
};

exports.getFilteredTopics = function(req, res) {
	var fields = 'keywords topics keywordFreqs topicFreqs topicCosts keywordCosts';
	Topic.getTopics({criteria: {userId: req.user._id}, select: fields}, function(err, topic) {
		if(err) {
			res.status(500).send({
				status: false
			});
		} else {
			var data = {
				topics 	   : [],
				topicCosts : [],
				topicFreqs : []
			};
			for(var key in topic[0].topics) {
				if (data.topics.length == 5) {
					var ind = data.topicFreqs.indexOf(Math.max.apply(Math, data.topicFreqs));
					if (data.topicFreqs[ind] < topic[0].topicFreqs[topic[0].topics.indexOf(key)]) {
						data.topics.splice(ind, 1); 
						//TODO NOT DONE;
					}
				} else {
					data.topics.push(key);
					data.topicCosts.push(topic[0].topicCosts[topic[0].topics.indexOf(key)]);
					data.topicFreqs.push(topic[0].topicFreqs[topic[0].topics.indexOf(key)]);
				}
			}
			res.status(200).send({
				status: true,
				data: data,
			});
		}
	});
}


