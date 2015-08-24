function newFarmFormController($scope, $http) {
	var self = this;
	var map = new OSMMap();
	var resource;
	window.map = map;
	self.farm = {};
	self.farm.products = [{}];
	this.farmSuggestion = {};

	this.showDetails = function(suggestion) {
		var coordinates = suggestion.resources[0].geocodePoints[0].coordinates;
		map.resetView(coordinates);
		$scope.showMap = true;
	};


	this.submit = function() {
		var farm = self.farm;
		var req = {
			method: 'post',
			url: '/newFarm.html',
			data: farm
		};
		$http(req).then(function() {
			console.log('ok');
			self.farm = {};
			self.farm.products = [{}];
		}, function() {
			console.log('error');
		});
		console.log('submit!');
	};
	$scope.cantons = ['Vaud', 'Valais'];

	this.addProduct = function() {
		self.farm.products.push({});
	};

	this.removeProduct = function(index) {
		self.farm.products.splice(index,1);
	};
	
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
			target: "map",
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
}

newFarmFormController.$inject = ['$scope', '$http']; 