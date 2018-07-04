var express	 = require('express'),
	config 	 = require('./config'),
	log 	 = require('./config/log')(module),
	mongoose = require('mongoose');

var app = express();

mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Ошибка соединения:', err.message);
});

db.once('open', function callback() {
	log.info("Matrix: Успешное соединение с БД.");
});

module.exports = require('./config/express') (app, config);

app.listen(config.port, function(){
	log.info('Matrix: Сервер запущен на порту ' + config.port);
});