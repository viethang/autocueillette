(function() {
	'use strict';

	searchFarmController.$inject = ['$scope', '$http', '$state', 'searchService'];
	angular.module('app')
	.controller('SearchFarmController', searchFarmController);
	function searchFarmController($scope, $http, $state, searchService) {
		/* jshint validthis: true*/
		var searchFarmCtrl = this;
		searchFarmCtrl.searchForm = {};
		searchFarmCtrl.search = search;
		searchFarmCtrl.showFarm = showFarm;

		function search() {
			searchService.bingSearch(searchFarmCtrl.searchForm.place, function(response) {
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
			var coordinates = suggestion.geocodePoints[0].coordinates;
			var data = {
				coordinates: coordinates,
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
				$state.go('searchFarm.showFarms');
			}, function(err) {
				console.log(err);
			});
		}
		
		function showFarm(farm) {
			$state.go('farmInfo', {farmId: farm.id});
		}
	}
})();
