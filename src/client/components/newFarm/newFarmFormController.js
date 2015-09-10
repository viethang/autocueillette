(function() {
	'strict mode';
	newFarmController.$inject = ['$scope', '$http', 'searchService', '$timeout', '$modal', '$state', 'OLServices'];
	angular.module('app')
	.controller('NewFarmController', newFarmController);

	function newFarmController($scope, $http, searchService, $timeout, $modal, $state, OLServices) {
		/* jshint validthis: true*/
		var ctrl = this;
		var map = new OLServices.OLMap();
		$scope.search = {};
		$scope.show = {};
		ctrl.farm = {};
		ctrl.verifyAddress = verifyAddress;
		ctrl.showDetails = showDetails;
		ctrl.selectAddr = selectAddr;
		ctrl.addrSuggestions = {};
		ctrl.gotoFarm = function(id) {
			$state.go('farmInfo', {farmId: id});
		};
		ctrl.goNext = function() {
			$scope.show.confirm = false;
			$scope.show.moreInfo = true;
		};
		ctrl.submit = submit;
		ctrl.reload = function() {
			$state.go('newFarm', {}, {reload: true});
		};
		
		$scope.alert = {};
		$scope.alert.street = '<span class = "text-danger">No street specified yet</span>';

		function selectAddr(index) {
			var info = ctrl.addrSuggestions[index];
			$scope.show.searchAlert = false;
			$scope.show.parsedAddress = true;
			$scope.show.confirm = true;
			resetFarmAddress(info);
			$scope.search.searchStr = ctrl.farm.formattedAddress;
			showMap();
		}

		function showDetails(index) {
			var suggestion = ctrl.addrSuggestions[index];
			var coordinates = suggestion.geocodePoints[0].coordinates;
			resetFarmAddress(suggestion);
			showMap();
		}

		function verifyAddress(searchStr) {
			if (!searchStr) {
				return;
			}
			searchService.bingSearch(searchStr, function(response) {
				switch (response.status) {
					case 'NR':
						handleNoResult();
						break;
					case 'ERR':
						console.log('Error! Try again.');
						break;
					case 'OK':
						handleSearchResult(response.result);
						break;
					default:
						break;
				}
			});
		}

		function handleSearchResult(result) {
			if (result.length > 1) {
				alertMultiAddr(result);
				return;
			}
			/*only one result*/
			resetFarmAddress(result[0]);
			checkDb(ctrl.farm);
		}

		function checkDb(farm) {
			var req = {
				method: 'post',
				url: '/newFarm/checkDb',
				data: farm
			};
			$http(req).then(function(res) {
				if (res.data.err) {
					console.log(err);
					return;
				}
				if (!res.data.exists) {
					if (res.data.closeFarms) {
						alertCloseFarms(res.data.closeFarms);
						return;
					}
					showMap();
					$scope.show.submit = true;
					return;
				}
				alertExistence(res.data.id);
			}, function(err){console.log('err', err);});
		}

		function alertCloseFarms(closeFarms) {
			ctrl.closeFarms = closeFarms;
			alert('components/newFarm/closeFarms.alert.tpl.html');
			showMap();
			closeFarms.forEach(function(closeFarm) {
				map.addPoint(closeFarm.coordinates);
			});
		}

		function alertMultiAddr(result) {
			alert('components/newFarm/multiAddr.alert.tpl.html');
			ctrl.searchAlert = true;
			ctrl.addrSuggestions = result;
			ctrl.places = result.map(function(res) {
				var address = res.address;
				var str = address.addressLine? (address.addressLine + ', ') : '';
				str += address.locality + ', '+ address.adminDistrict + ', ' + address.countryRegion;
				return str;
			});
		}

		function alertExistence(id) {
			alert('components/newFarm/farmExists.alert.tpl.html');
			$scope.id = id;
		}

		function resetFarmAddress(suggestion) {
			var address = suggestion.address;
			var farm = ctrl.farm;
			farm.city = address.locality;
			farm.canton = address.adminDistrict;
			farm.country = address.countryRegion;
			farm.streetLine = address.addressLine;
			farm.formattedAddress = farm.streetLine? (farm.streetLine + ', ') : '' + farm.city + ', ' + farm.canton + ', '+ farm.country;
			farm.coordinates = suggestion.geocodePoints[0].coordinates;
		}

		function handleNoResult() {
			alert('components/newFarm/addressNotExists.alert.tpl.html');
		}

		function showMap() {
			$scope.show.map = true;
			$timeout(function() {
				map.map.setTarget('map');
				map.resetView(ctrl.farm.coordinates);
			});
		}

		function alert(templateUrl) {
			$scope.alertTpl = templateUrl;
			$scope.show.searchAlert = true;
		}

		function submit() {
			var req = {
				method: 'post',
				url: '/addNewFarm',
				data: ctrl.farm
			};
			$http(req).then(function(res) {
				$scope.show.finished = true;
			}, function(err) {
			});
		}
	}
})();
