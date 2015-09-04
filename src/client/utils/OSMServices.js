(function() {
	angular.module('app')
	.factory('OSMServices', OSMServices);
	OSMServices.$inject = [];
	function OSMServices() {
		var service = {
			OSMMap: OSMMap
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

		OSMMap.prototype.resetView = function(coordinates) {
			this.coordinates = coordinates;
			this.map.getView().setCenter(ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]]));
			this.centerFeature.getGeometry().setCoordinates(
				ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]])
			);
		};
		return service;
	}
})();