var express	 = require('express'),
	config 	 = require('./config'),
	log 	 = require('./config/log')(module);

var app = express();

module.exports = require('./config/express') (app, config);

app.listen(config.port, function(){
	log.info('Агрегатор запущен на порту ' + config.port);
});