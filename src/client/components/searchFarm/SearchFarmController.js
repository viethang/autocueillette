(function() {
	'use strict';

	searchFarmController.$inject = ['$scope', '$http', '$state', 'searchService', 'OLServices', '$timeout'];
	angular.module('app')
	.controller('SearchFarmController', searchFarmController);
	function searchFarmController($scope, $http, $state, searchService, OLServices, $timeout) {
		/* jshint validthis: true*/
		var searchFarmCtrl = this;
		var map = new OLServices.OLMap();
		var center;
		searchFarmCtrl.searchForm = {};
		searchFarmCtrl.search = search;
		$scope.show = {};

		function search() {
			var place = searchFarmCtrl.searchForm.place || 'Lausanne, Suisse';
			searchService.bingSearch(place, function(response) {
				switch (response.status) {
					case 'NR':
						alertAddressNotExist();
						break;
					case 'ERR':
						console.log('Error! Try again.');
						break;
					case 'OK':
						if (response.result.length > 1) {
							chooseAddress();
						} else {
							searchIndex(response.result[0], searchFarmCtrl.searchForm.product);
							console.log('searchIndex');
						}
						break;
				}
			});
		}

		function alertAddressNotExist() {
			console.log('not exist');
		}
		
		function chooseAddress() {
			console.log('More than one result');
		}
		function searchIndex(suggestion, product) {
			center = suggestion.geocodePoints[0].coordinates;
			var data = {
				coordinates: center,
				product: product
			};
			var req = {
				method: 'post',
				url: '/searchIndex',
				data: data
			};
			$http(req).then(function(res) {
				var results = res.data.response.docs;
				searchFarmCtrl.results = results;
				$scope.show.map = true;
				showMap(results);
			}, function(err) {
				console.log(err);
			});
		}

		function showMap(results) {
			map.map.setTarget('map_search');
			map.resetView(center);
			results.forEach(function(result) {
				var tmp = result.coordinates.split(',');
				var point = [parseFloat(tmp[0]), parseFloat(tmp[1])];
				map.addPoint(point, result.short_address);
			});
			map.fit();
		}
	}
})();
