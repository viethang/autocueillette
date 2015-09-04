(function() {
	'strict mode';
	newFarmFormController.$inject = [
		'$scope', '$http', 'searchService', '$timeout', '$modal', '$state'
	];
	angular.module('app')
	.controller('NewFarmFormController', newFarmFormController);

	function newFarmFormController($scope, $http, searchService, $timeout, $modal, $state) {
		/* jshint validthis: true*/
		var newFarmCtrl = this;
		var map = new OSMMap();
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

		function submit() {
			var req = {
				method: 'post',
				url: '/addNewFarm',
				data: newFarmCtrl.farm
			};
			$http(req).then(function(res) {
				console.log('ok', res.data);
				switch (res.data.status) {
					case 'exists':
						announceExistence();
						break;
					case 'confirm':
						confirm();
						break;
					case 'update':
						update();
						break;
				}
			}, function() {
				console.log('error');
			});
			function announceExistence() {
				var modalInstance = $modal.open({
					animation: false,
					templateUrl: 'components/newFarm/farmExistsAlert.tpl.html',
					controller: 'ModalController',
					resolve: {
					}
				});

				modalInstance.result.then(function (result) {
					switch (result) {
						case 'other farm':
							$state.go('newFarm.fillAddress');
							$scope.search = {};
							newFarmCtrl.farm = {};
							break;
						case 'go home':
							$state.transitionTo('index');
							break;
					}
				}, function (reason) {
					console.log(reason);
				});
			}
				
			function confirm() {
				console.log('need confirm');
			}
			function update() {
				console.log('update');
			}
			console.log('submit!');
		}

		function OSMMap() {
			var image, style;
			this.coordinates = [];
			image = new ol.style.Circle({
						radius: 5,
				fill: null,
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 2
				})
			});

			style = new ol.style.Style({
				image: image
			});

			this.centerFeature = new ol.Feature(
				new ol.geom.Point(
					ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]])
				)
			);
			this.map = new ol.Map({
				renderer: 'canvas',
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					}),
					new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [this.centerFeature]
						}),
						style: style
					})
				],
				view: new ol.View({
					maxZoom: 18,
					zoom: 15
				})
			});
		}
		OSMMap.prototype.resetView = function(coordinates){
			this.coordinates = coordinates;
			this.map.getView().setCenter(ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]]));
			this.centerFeature.getGeometry().setCoordinates(
				ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]])
			);
		};
		
		function resetFarmAddress(suggestion) {
			var address = suggestion.address;
			var farm = newFarmCtrl.farm;
			farm.city = address.locality;
			farm.canton = address.adminDistrict;
			farm.streetLine = address.addressLine;
			farm.formattedAddress = address.formattedAddress;
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
	}
})();
