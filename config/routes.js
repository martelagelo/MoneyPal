var loginController = require('../controllers/users.js');
var moneyEntryController = require('../controllers/moneyEntry.js');
var miscController = require('../controllers/misc.js');
var ObjectId = require('mongoose').Schema.Types.ObjectId;
var config = GLOBAL.CONFIG;

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.status(401).send({
		
		data	: null,
		msg		: "User is not Authenticated to login"
    });
};

module.exports = function(app, passport) {

	app.post('/login', loginController.login);

	app.put('/login/change_password', isAuthenticated, loginController.changePassword);

	app.post('/login/compare_passwords', isAuthenticated, loginController.comparePasswords);

	app.put('/login/change_profile', isAuthenticated, loginController.changeProfile);

	app.post('/logout', isAuthenticated, loginController.logout);

	app.get('/dayCharts/:id', isAuthenticated, moneyEntryController.getMoneyEntries);

	app.get('/dayChartsByDay', isAuthenticated, moneyEntryController.getMoneyEntriesByDay);

	app.put('/dayCharts/:id', isAuthenticated, moneyEntryController.updateMoneyEntry);

	app.post('/dayCharts', isAuthenticated, moneyEntryController.createMoneyEntry);

	app.get('/charts/cost/day', isAuthenticated, moneyEntryController.getCostsByDay);

	app.get('/charts/cost/month', isAuthenticated, moneyEntryController.getCostsByMonth);

	app.get('/charts/cost/year', isAuthenticated, moneyEntryController.getCostsByYear);

	app.get('/charts/cost/calendar', isAuthenticated, moneyEntryController.getMoneyEntriesForCalendar);

	app.delete('/dayCharts/:id', isAuthenticated, moneyEntryController.deleteMoneyEntry);

	app.get('/data/locations', isAuthenticated, moneyEntryController.getMoneyLocations);

	app.get('/stock', miscController.getStockPrice);
};