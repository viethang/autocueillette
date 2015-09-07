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
			dbtools.updateDb(farm, db, function(err, body) {
				if (!err) {
					dbtools.solrIndex(farm, body.id);
					res.send({status: 'update', id: body.id});
				} else {
					console.log('Error', err);
					res.send({status: 'error'});
				}
			});
		}
	});
});

app.post('/getFarm', function(req, res) {
	var id = req.body.id;
	dbtools.getFarm(id, function(err, body) {
		if (!err) {
			res.send(body);
		} else {
			console.log('Get farm error:', err);
		}
	});
});

app.post('/updateFarm', function(req, res) {
	var farm = req.body;
	dbtools.updateFarm(farm, function(err) {
		if (err) {
			res.send({err: {msg: err.message}});
			return;
		}
		dbtools.solrIndex(farm, farm._id);
	});
});

app.post('/searchIndex', function(req, res) {
	var data = req.body;
	dbtools.searchIndex(data, function(err, body) {
		if (!err) {
			res.send(body);
		} else {
			res.send({err: err});
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

function serveFile(url) {
	app.get(url, function(req, res, next) {
		res.sendFile(path.join(__dirname, serverReversedPath, url));
	});
}
