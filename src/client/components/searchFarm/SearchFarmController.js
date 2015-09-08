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

		searchFarmCtrl.choose = function(place) {
			searchFarmCtrl.searchForm.place = place;
			search();
		};

		function search() {
			searchFarmCtrl.searchAlert = null;
			var place = searchFarmCtrl.searchForm.place || 'Lausanne, Suisse';
			searchService.bingSearch(place, function(response) {
				switch (response.status) {
					case 'ERR':
						alert('components/common/alertError.html');
						$timeout(function() {
							searchFarmCtrl.searchAlert = null;
						}, 2000);
						break;
					case 'OK':
						if (response.result.length > 1) {
							searchFarmCtrl.places = [];
							response.result.forEach(function(res) {
								var address = res.address;
								var place = [address.locality, address.adminDistrict, address.countryRegion].join(', ');
								searchFarmCtrl.places.push(place);
							});
						alert('components/searchFarm/multiAddr.alert.tpl.html');
						} else {
							searchIndex(response.result[0], searchFarmCtrl.searchForm.product);
						}
						break;
				}
			});
		}

		function alert(templateUrl) {
			searchFarmCtrl.searchAlert = templateUrl;
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
				alert('components/common/alertError.html');
				$timeout(function() {
					searchFarmCtrl.searchAlert = null;
				}, 2000);
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
