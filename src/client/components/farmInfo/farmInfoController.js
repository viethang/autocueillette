(function () {
	'use strict';

	angular.module('app')
	.controller('FarmInfoController', farmInfoController);
	function farmInfoController($state, $stateParams, $http) {
		/* jshint validthis: true*/
		var farmId = $stateParams.farmId;
		var farmInfoCtrl = this;
		farmInfoCtrl.farm = {products: [{}]};
		getFarm(farmId, farmInfoCtrl.farm);
		$state.go('farmInfo.view');
		farmInfoCtrl.editAddress = editAddress;
		farmInfoCtrl.editDetails = editDetails;
		farmInfoCtrl.addProduct = addProduct;
		farmInfoCtrl.removeProduct = removeProduct;
		farmInfoCtrl.submitDetails = submitDetails;
		
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
			$http(req).then(function(res) {
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
			farmInfoCtrl.farm.products.splice(index,1);
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
	}
	farmInfoController.$inject = ['$state', '$stateParams', '$http'];
})();