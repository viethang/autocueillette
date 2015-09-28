(function() {
	angular.module('app')
	.factory('OLServices', OLServices);
	OLServices.$inject = [];
	function OLServices() {
		var service = {
			OLMap: OLMap
		};

		function OLMap() {
			this.coordinates = [];
			var image = new ol.style.Circle({
				radius: 5,
				fill: null,
				stroke: new ol.style.Stroke({
					color: 'red',
					width: 2
				})
			});
			var style = new ol.style.Style({
				image: image
			});

			this.image2 = new ol.style.Circle({
				radius: 5,
				fill: null,
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 2
				})
			});
			var style2 = new ol.style.Style({
				image: this.image2
			});

			this.centerFeature = new ol.Feature(
				new ol.geom.Point(
					ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]])
				)
			);

			this.interestPointSource = new ol.source.Vector({
				features: []
			});

			var scaleLineControl = new ol.control.ScaleLine();
			this.map = new ol.Map({
				renderer: 'canvas',
				controls: ol.control.defaults({
					}).extend([
						scaleLineControl
				]),
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					}),
					new ol.layer.Vector({
						source: new ol.source.Vector({
							features: [this.centerFeature]
						}),
						style: style
					}),
					new ol.layer.Vector({
						source: this.interestPointSource,
						style: style2
					})
				],
				view: new ol.View({
					maxZoom: 18,
					zoom: 15
				})
			});
		}

		OLMap.prototype.resetView = function(coordinates) {
			this.coordinates = coordinates;
			this.map.getView().setCenter(ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]]));
			this.centerFeature.getGeometry().setCoordinates(
				ol.proj.fromLonLat([this.coordinates[1], this.coordinates[0]])
			);
		};


		OLMap.prototype.addPoint = function(coordinates, label) {
			var f = new ol.Feature(new ol.geom.Point(
				ol.proj.fromLonLat([coordinates[1], coordinates[0]])
			));
			this.interestPointSource.addFeature(f);
		};


		OLMap.prototype.fit = function() {
			var extent1 = this.interestPointSource.getExtent();
			var extent2 = ol.extent.boundingExtent([this.centerFeature.getGeometry().getCoordinates()]);
			ol.extent.extend(extent1, extent2);
			//ol.extent.buffer(extent1, 10050);
			this.map.getView().fit(extent1, this.map.getSize());
		};


		return service;
	}
})();