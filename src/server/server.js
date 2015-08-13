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
				console.log('Data  received ok' ,JSON.parse(jsonString));
			});
			res.end();
		}
	}
}).listen(8000);

function addFarm(farm) {
}