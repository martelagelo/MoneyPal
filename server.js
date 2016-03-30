var express = require('express');
var path = require('path');
var bodyParser     = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var CronJob = require('cron').CronJob;

var engines = require('consolidate');
var expressSession = require('express-session');
var app = express();

app.use(expressSession({secret: 'mySecretKey'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

var Config = require('config-js');
GLOBAL.CONFIG= new Config(__dirname+"/log/##.js"); // config-js automatically replaces ## with right env

GLOBAL.mongoose = require('mongoose'); // used for dealing with mongoDB.
var mongo = GLOBAL.CONFIG.get('mongo');

mongoose.connect('mongodb://localhost/MoneyPal', function(err) {
    if(err) {
        console.log('mongodb connection error', err);
    } else {
        console.log('mongodb connection successful');
    }
});

//Initiating Logger
var logger = require('./utils/logger');
GLOBAL.logger=logger;

var db = mongoose.connection;
db.on('error', function(err, scope){
  logger.error(err);
});

db.once('open',function(){
	logger.info("Connected to MongoDB at: " + mongo.db_host);

	//common route for including bower_component files in the front-end.
	app.use('/bower_components',express.static(__dirname + '/client/bower_components'));
	// commom lib route for including common lib files in the front-end.
	app.use('/lib',express.static(__dirname + '/client/lib'));
	// commom assets route for including common css,fonts and images.
	app.use('/assets',express.static(__dirname + '/client/assets'));

	app.set('views', __dirname + '/client/'); // general config
	app.engine('html', engines.mustache);
	app.set('view engine', 'html');

	app.use('/',express.static(__dirname + '/client/'));
	//app.use('/sidebar', express.static(__dirname + '/client/sidenav.html'));

	// Passport authenticator init
	var passport = require('passport');
	app.use(passport.initialize());
	app.use(passport.session());
	// initialize passport capabilities
	var initPassport = require('./config/passport/init')(passport);
	var loginPassport = require('./config/passport/login')(passport);
	// Initialize all the routes
	var routes = require('./config/routes.js')(app,passport);

	logger.info("Starting TRACK server in " + process.env.NODE_ENV + " environment.");
	http.createServer(app).listen(GLOBAL.CONFIG.get("server.port"),GLOBAL.CONFIG.get("server.host"));
	logger.info("Server started on port " + GLOBAL.CONFIG.get("server.port"));

});

/******************************************************************************************/
/*Cron Job that sends report Requests to S3*/
/******************************************************************************************/
var job = new CronJob({
	cronTime: '00 30 11 * * 1-7',
	onTick: function() {
		expressSession.all(function(err, sessions) {
	        for (var i = 0; i < sessions.length; i++) {
	            expressSession.get(sessions[i], function() {} );
	        }
	    });
	}
});
job.start();
/******************************************************************************************/
/*login routes*/
/******************************************************************************************/
