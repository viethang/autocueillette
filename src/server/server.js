var path = require('path');
var fs = require('fs');
require('http').createServer(function(req, res) {
	var method = req.method.toLowerCase();
	console.log(req.url);
	if (method === 'get') {
		var file = path.normalize('.' + req.url);
		fs.exists(file, function(exists) {
			if (exists) {
				fs.createReadStream(file).pipe(res);
				console.log('Serving file', file);
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
	if (req.url === '/searchFarm.html') {
		var nano = require('nano')('http://localhost:5984');
		var farmDB = nano.db.use('auto_cueillette_farms');
		var jsonString = '';
		req.on('data', function (data) {
			jsonString += data;
		});
		req.on('end', function () {
			var farm = JSON.parse(jsonString);
			console.log('search requested');
			farmDB.view('example', 'by_canton', {'key': 'Vaud'}, function(err, body) {
				console.log('view!');
				res.write(JSON.stringify(body.rows));
				res.end();
			});
		});
	}
}).listen(8000);

function addFarm(farm) {
}