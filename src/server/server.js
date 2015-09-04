var path = require('path');
var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var dbtools = require('./dbtools');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/assets', express.static('assets'));
app.use('/vendor', express.static('vendor'));
app.use('/src/client', express.static('src/client'));

var serverReversedPath = '../..';

var servedFiles = ['/index.html', '/templates-app.js', '/templates-common.js'];

function serveFile(url) {
	app.get(url, function(req, res, next) {
		res.sendFile(path.join(__dirname, serverReversedPath, url));
	});
}

servedFiles.forEach(function(url) {
	serveFile(url);
});

app.post('/addNewFarm', function(req, res, next) {
	var farm = req.body.farm;
	var forced = req.body.forced;
	var db = 'autocueillette_farms';
	dbtools.checkDbExistence(farm, db, function(resp) {
		if (resp.exists) {
			res.send({status: 'exists'});
		} else if (resp.closeFarms && !forced) {
			res.send({status: 'confirm', closeFarms: resp.closeFarms});
		} else {
			dbtools.updateDb(farm, db);
			res.send({status: 'update'});
		}
	});
});

app.use(function(req, res) {
	console.log(req.url, 'File not found! Send index.html');
	res.sendFile(path.join(__dirname, serverReversedPath, '/index.html'));
});

app.use(function(err, req, res) {
	res.end('Error!', err.toString());
});

http.createServer(app).listen(8000);

