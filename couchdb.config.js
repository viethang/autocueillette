var nano = require('nano')('http://localhost:5984');
var designdoc = {
	"views": {
       "by_location": {
           "map": "function(doc) {var key = [doc.city, doc.canton]; emit(key, doc)}"
       },
       "allFarms": {
           "map": "function(doc) {if (doc.type == 'farm') emit(null, doc)}"
       }
   }
};
nano.create('autocueillette_farms');
var db = nano.db.use('autocueillette_farms');
db.insert(designdoc, '_design/farms', function(err, res) {
	if (err) {
		console.log('error', err);
		return;
	}
	console.log('configured successfully');
});

