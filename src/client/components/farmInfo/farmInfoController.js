(function() {
	'use strict';

	angular.module('app')
	.controller('FarmInfoController', farmInfoController);
	function farmInfoController($state, $stateParams, $http, OLServices, $timeout, searchService) {
		/* jshint validthis: true*/
		var farmId = $stateParams.farmId;
		var farmInfoCtrl = this;
		var map = new OLServices.OLMap();
		var formattedAddress;
		farmInfoCtrl.farm = {products: [{}]};
		getFarm(farmId, farmInfoCtrl.farm)
		.then(function() {
			$state.go('farmInfo.view');
			var coordinates = farmInfoCtrl.farm.coordinates;
			var formattedAddress = farmInfoCtrl.farm.formattedAddress;
			$timeout(function() {
				map.map.setTarget('map1');
				map.resetView(coordinates);
			});
		});
		farmInfoCtrl.editAddress = editAddress;
		farmInfoCtrl.editDetails = editDetails;
		farmInfoCtrl.addProduct = addProduct;
		farmInfoCtrl.removeProduct = removeProduct;
		farmInfoCtrl.submitDetails = submitDetails;
		farmInfoCtrl.save = save;

		function editAddress() {
			$state.go('farmInfo.editAddress');
		}

		function editDetails() {
			$state.go('farmInfo.editDetails');
		}
		function getFarm(id, target) {
			var req = {
				method: 'post',
				url: '/getFarm',
				data: {id: id}
			};
			return $http(req).then(function(res) {
				for (var key in res.data) {
					target[key] = res.data[key];
				}
			}, function(err) {
				console.log(err);
			});
		}
		function addProduct() {
			farmInfoCtrl.farm.products.push({});
		}
		function removeProduct(index) {
			farmInfoCtrl.farm.products.splice(index, 1);
		}
		function submitDetails() {
			var req = {
				method: 'post',
				url: '/updateFarm',
				data: farmInfoCtrl.farm
			};
			$http(req).then(function(res) {
				if (res.data.err) {
					console.log('err', err.message);
					return;
				}
				console.log('update success');
			}, function(err) {
				console.log(err);
			});
		}

		function save() {
			console.log('saving');
			if (formattedAddress === farmInfoCtrl.farm.formattedAddress) {
				update(farmInfoCtrl.farm);
			} else {
				var searchStr = farmInfoCtrl.farm.formattedAddress;
				searchService.bingSearch(searchStr, function(response) {
					switch (response.status) {
						case 'NR':
							console.log('No result found');
							break;
						case 'ERR':
							console.log('Error! Try again.');
							break;
						case 'OK':
							if (response.result.length > 1) {
								alertMultipleResults(response.result);
							} else {
								confirmAddress(response.result[0]);
							}
							break;
					}
				});
			}
		}

		function alertMultipleResults(result) {
			console.log('Multiple results', result);
		}

		function confirmAddress(result) {
			var address = result.address;
			var farm = farmInfoCtrl.farm;
			farm.city = address.locality;
			farm.canton = address.adminDistrict;
			farm.streetLine = address.addressLine;
			farm.formattedAddress = address.formattedAddress;
			farm.coordinates = result.geocodePoints[0].coordinates;
			map.resetView(farm.coordinates);
			update(farm);
		}

		function update(farm) {
			console.log('updating');
			var req = {
				method: 'post',
				url: '/updateFarm',
				data: farm
			};
			$http(req).then(function(res) {
				console.log('Farm updated');
			}, function(err) {
				console.log('update error');
			});
			$state.go('farmInfo.view');
		}
	}
	farmInfoController.$inject = ['$state', '$stateParams', '$http', 'OLServices', '$timeout', 'searchService'];
})();
