(function() {
	'use strict';

	searchFarmController.$inject = ['$scope', '$http', '$state', 'searchService', 'OLServices', '$timeout', '$stateParams'];
	angular.module('app')
	.controller('SearchFarmController', searchFarmController);
	function searchFarmController($scope, $http, $state, searchService, OLServices, $timeout, $stateParams) {
		/* jshint validthis: true*/
		var searchFarmCtrl = this;
		var map = new OLServices.OLMap();
		var center;
		console.log('state = search');
		searchFarmCtrl.searchForm = {};
		searchFarmCtrl.searchForm.place = $stateParams.place;
		searchFarmCtrl.searchForm.product = $stateParams.product;
		if (searchFarmCtrl.searchForm.place || searchFarmCtrl.searchForm.product) {
			search(searchFarmCtrl.searchForm.place, searchFarmCtrl.searchForm.product);
		}
		searchFarmCtrl.search = function (place, product) {
			place = place || 'lausanne, suisse';
			$state.go('search', {place: place, product: product});
		};
		$scope.show = {};
		searchFarmCtrl.showFarm = function(farm) {
			$state.go('farmInfo.view', {farmId: farm.id});
		};

		searchFarmCtrl.choose = function(place) {
			searchFarmCtrl.searchForm.place = place.formattedAddress;
			$state.go('search', {place: place.formattedAddress, product:  searchFarmCtrl.searchForm.product});
			searchIndex(place, searchFarmCtrl.searchForm.product);
			searchFarmCtrl.searchAlert = null;
		};

		function search(place, product) {
			searchFarmCtrl.searchAlert = null;
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
							searchFarmCtrl.places = response.result.map(function(place) {
								Object.defineProperty(place, 'formattedAddress', {
									get: function() {
										var add = this.address;
										return [add.addressLine, add.locality, add.adminDistrict, add.countryRegion].filter(Boolean).join(', ');
									}
								});
								return place;
							});
							alert('components/searchFarm/multiAddr.alert.tpl.html');
						} else {
							searchIndex(response.result[0], product);
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
				url: '/searchFarms',
				data: data
			};
			$http(req).then(function(res) {
				var results = res.data;
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
			console.log('show map');
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
