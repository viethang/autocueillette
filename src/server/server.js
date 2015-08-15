var path = require('path');
var fs = require('fs');
require('http').createServer(function(req, res) {
	var method = req.method.toLowerCase();
	console.log(req.url);
	if (method === 'get') {
		var filename = path.normalize('.' + req.url);
		if (filename === './') filename = 'index.html';
		fs.exists(filename, function(exists) {
			if (exists) {
				fs.createReadStream(filename).pipe(res);
				console.log('Serving file', filename);
			} else {
				fs.createReadStream('index.html').pipe(res);
			}
		});
	}
	if (req.url === '/newFarm.html') {
		if (method === 'post') {
			var jsonString = '';
			req.on('data', function (data) {
				jsonString += data;
			});
			req.on('end', function () {
				var farm = JSON.parse(jsonString);
				console.log('Data  received ok', farm);
				var nano = require('nano')('http://localhost:5984');
				var farmDB = nano.db.use('auto_cueillette_farms');
				farmDB.insert(farm, function(err, body) {
					if (!err) {
						console.log(body.rows);
					}
				});
			});
			res.end();
		}
	}
	if (req.url === '/showFarms.html') {
		var nano = require('nano')('http://localhost:5984');
		var farmDB = nano.db.use('auto_cueillette_farms');
		var jsonString = '';
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var farm = JSON.parse(jsonString);
			var key;
			console.log('search requested');
			if (farm.canton) {
				key = farm.canton;
			}
			farmDB.view('example', 'by_canton', {'key': key}, function(err, body) {
				console.log('fabulous view!', farm);
				res.write(JSON.stringify(body.rows));
				res.end();
			});
		});
	}
}).listen(8000);

function addFarm(farm) {
}