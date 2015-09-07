(function() {
	'strict mode';
	newFarmFormController.$inject = ['$scope', '$http', 'searchService', '$timeout', '$modal', '$state', 'OLServices'];
	angular.module('app')
	.controller('NewFarmFormController', newFarmFormController);

	function newFarmFormController($scope, $http, searchService, $timeout, $modal, $state, OLServices) {
		/* jshint validthis: true*/
		$state.transitionTo('newFarm.fillAddress');
		var newFarmCtrl = this;
		var map = new OLServices.OLMap();
		$scope.search = {};
		newFarmCtrl.farm = {};
		newFarmCtrl.farmSuggestion = [];
		newFarmCtrl.showDetails = showDetails;
		newFarmCtrl.showSuggestions = showSuggestions;
		newFarmCtrl.localize = localize;
		newFarmCtrl.addFarm = submit;
		newFarmCtrl.goHome = goHome;

		function showDetails(suggestion, index) {
			var coordinates = suggestion.geocodePoints[0].coordinates;
			resetFarmAddress(suggestion);
			$timeout(function() {
				map.resetView(coordinates);
				markChosenAddress(index);
			});
		}

		function showSuggestions() {
			$state.go('newFarm.confirmAddress');
			var suggestion = newFarmCtrl.farmSuggestion[0];
			resetFarmAddress(suggestion);
			$timeout(function() {
				map.map.setTarget('map');
				showDetails(suggestion, 0);
			});
		}

		function localize(searchStr) {
			searchService.bingSearch(searchStr, function(response) {
				switch (response.status) {
					case 'NR':
						console.log('No result found');
						break;
					case 'ERR':
						console.log('Error! Try again.');
						break;
					case 'OK':
						newFarmCtrl.farmSuggestion = response.result;
						break;
				}
				showSuggestions();
			});

		}

		function submit(forced) {
			var req = {
				method: 'post',
				url: '/addNewFarm',
				data: {
					farm: newFarmCtrl.farm,
					forced: forced
				}
			};
			$http(req).then(function(res) {
				console.log('ok', res.data);
				switch (res.data.status) {
					case 'exists':
						announceExistence();
						break;
					case 'confirm':
						confirm(res.data.closeFarms);
						break;
					case 'update':
						update();
						break;
				}
			}, function(err) {
				console.log('error:', err);
			});
		}

		function announceExistence() {
			var modalInstance = $modal.open({
				animation: false,
				templateUrl: 'components/newFarm/farmExistsAlert.tpl.html',
				controller: 'ModalController',
				resolve: {
				}
			});

			modalInstance.result.then(function(result) {
				switch (result) {
					case 'other farm':
						$state.go('newFarm.fillAddress');
						$scope.search = {};
						newFarmCtrl.farm = {};
						break;
					case 'go home':
						goHome();
						break;
				}
			}, function(reason) {
				console.log(reason);
			});
		}

		function confirm(closeFarms) {
			newFarmCtrl.closeFarms = closeFarms;
			console.log('need confirm');
		}
		function update() {
			console.log('update');
		}

		function resetFarmAddress(suggestion) {
			var address = suggestion.address;
			var farm = newFarmCtrl.farm;
			farm.city = address.locality;
			farm.canton = address.adminDistrict;
			farm.streetLine = address.addressLine;
			farm.formattedAddress = farm.streetLine + ', ' + farm.city + ', ' + farm.canton;
			farm.coordinates = suggestion.geocodePoints[0].coordinates;
		}

		function markChosenAddress(index) {
			var links = document.getElementsByClassName('farm-suggestion');
			[].forEach.call(links, function(link) {
				angular.element(link).removeClass('chosen');
			});
			angular.element(links[index]).addClass('chosen');
		}

		function goHome() {
			$state.transitionTo('index');
		}

		function handleNoResult() {
			var modalInstance = $modal.open({
				animation: false,
				templateUrl: 'components/newFarm/addressNotExists.alert.tpl.html',
				controller: 'ModalController as modalCtrl',
				resolve: {
				}
			});
		}
	}
})();
