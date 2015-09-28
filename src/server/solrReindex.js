var http = require('http');
var dbtools = require('./dbtools');
var nano = require('nano')('http://localhost:5984');
/*First remove all documents from autocueillette core*/
var delUrl = 'http://localhost:8983/solr/autocueillette/update?stream.body=<delete><query>*:*</query></delete>&commit=true';

var request = http.request(delUrl, function(response) {
	response.on('data', function() {
	});
	response.on("end", function() {
		console.log('finished');
	});
});
request.end();

/*Then index all document from CouchDB*/

var db = nano.db.use('autocueillette_farms');
db.view('farms', 'allFarms', function(err, body) {
	if (!err) {
		var results = body.rows;
		results.forEach(function(result) {
			var farm = result.value;
			dbtools.solrIndex(farm, farm._id);
		});
	}
});