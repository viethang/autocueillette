(function() {
	'use strict';
	angular.module('app')
	.factory('searchService', searchService);
	searchService.$inject = ['$http', 'BingKey'];

	function searchService($http, BingKey) {
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
				if ((response.resourceSets.length === 1) &
					(response.resourceSets[0].resources.length === 0)
				) {
					console.log('No result found');
					callback({status: 'NR'});
				} else {
					callback({status: 'OK', result: response.resourceSets[0].resources});
			}})
			.error(function() {
				callback({status: 'ERR'});
			});
		}
	}
})();
