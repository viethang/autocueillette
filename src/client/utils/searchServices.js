(function() {
	'use strict';
	angular.module('app')
	.factory('searchService', searchService);
	searchService.$inject = ['$http', 'BingKey'];

	function searchService($http, BingKey) {
		var tries = 0;
		var service = {
			bingSearch: bingSearch
		};
		return service;
		function bingSearch(searchStr, callback) {
			var request = 'http://dev.virtualearth.net/REST/v1/Locations?query=' +
				encodeURIComponent(searchStr) +
				'&jsonp=JSON_CALLBACK&key=' + BingKey +
				'&mkt=fr-fr';
			$http.jsonp(request)
			.success(function(response) {
				console.log(response);
				if ((response.resourceSets.length === 1) &&
					(response.resourceSets[0].resources.length === 0)
				) {
					if (tries < 5) {
						console.log('try bing again');
						console.log(tries);
						tries++;
						bingSearch(searchStr, callback);
						return;
					} else {
						console.log('No result found');
						callback({status: 'NR'});
					}
				} else {
					callback({status: 'OK', result: response.resourceSets[0].resources});
			}})
			.error(function() {
				callback({status: 'ERR'});
			});
		}
	}
})();
