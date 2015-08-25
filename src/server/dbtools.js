function checkDbExistence(doc, dbName, callback) {
	var res = {};
	var nano = require('nano')('http://localhost:5984');
	var db = nano.db.use(dbName);
	db.view('farms', 'by_location', {keys: [[doc.city, doc.canton]]},
		function(err, body) {
			if (!err) {
				var result = body.rows;
				if (result.length === 0) 
					res = {exists: false};
				for (var i = 0; i < result.length; i++) {
					if (result[i].value.formattedAddress === doc.formattedAddress) {
						res = {exists: true};
					}
				}
				if (!res.exists) {
					var closeFarms = findCloseFarms(doc, result);
					if (closeFarms.length > 0) {
						res.closeFarms = closeFarms;
					}
				}
				if (callback) {
					callback(res);
				}
			}
			
		}
	);
	
}

function findCloseFarms(doc, list) {
	var radius = 1; //km
	var closeFarms = [];
	list.forEach(function(item) {
		var distance = getStraightDistance(doc.coordinates, item.value.coordinates);
		if (distance < radius)
			closeFarms.push(item);
	});
	return closeFarms;
}

function updateDb(doc, dbName, callback) {
	var nano = require('nano')('http://localhost:5984');
	var db = nano.db.use(dbName);
	db.insert(doc, function(err, body) {
		if (err) {
			console.log('err');
		} else {
		}
	});
}

function getStraightDistance(x, y) {
	var R = 6371; //earth's radius
	var h;
	var d;
	h = haversine(toRad(x[0]-y[0])) +
		Math.cos(toRad(x[0]))*Math.cos(toRad(y[0]))*haversine(toRad(x[1]-y[1]));
	d = 2*R*Math.asin(Math.sqrt(h));
	console.log(d);
	return d;
}

function haversine(a) {
	return (Math.sin(a/2))*(Math.sin(a/2));
}

function toRad(l) {
	return l * Math.PI /180;
}

module.exports.checkDbExistence = checkDbExistence;
module.exports.updateDb = updateDb;
