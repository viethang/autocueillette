(function() {
	'use strict';
	
	angular.module('app')
	.controller('ModalController', modalCtrl);
	modalCtrl.$inject = ['$scope', '$modalInstance'];

	function modalCtrl($scope, $modalInstance) {
		$scope.addNewFarm = function() {
			$modalInstance.close('other farm');
		};
		$scope.goHome = function() {
			$modalInstance.close('go home');
		};
	}
})();