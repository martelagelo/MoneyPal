var yahooFinance = require('yahoo-finance');

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


