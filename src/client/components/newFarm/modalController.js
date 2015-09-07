(function() {
	'use strict';

	angular.module('app')
	.controller('ModalController', modalController);
	modalController.$inject = ['$scope', '$modalInstance'];

	function modalController($scope, $modalInstance) {
		/*jshint validthis: true*/
		var modalCtrl = this;
		modalCtrl.close = function(msg) {
			$modalInstance.close(msg);
		};
	}
})();
