var winston = require('winston');

// add info logger
var options = {
	exitOnError: GLOBAL.CONFIG.get('logging.exitOnError') || false,
	transports: []
};

if(GLOBAL.CONFIG.get('logging.info.enabled')){
	options.transports.push(new (winston.transports.DailyRotateFile)(GLOBAL.CONFIG.get('logging.info')))
}

// add error logger
if(GLOBAL.CONFIG.get('logging.error.enabled')){
  options.transports.push(new (winston.transports.DailyRotateFile)(GLOBAL.CONFIG.get('logging.error')));
}

// add console logger
if(GLOBAL.CONFIG.get('logging.console.enabled')){
  options.transports.push(new (winston.transports.Console)(GLOBAL.CONFIG.get('logging.console')))
}


var logger = new (winston.Logger)(options)

module.exports = logger;