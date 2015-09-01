(function () {
	'use strict';

	searchFarmController.$inject = ['$scope', '$http', '$state'];
	angular.module('app')
	.controller('SearchFarmController', searchFarmController);
	function searchFarmController($scope, $http, $state) {
		/* jshint validthis: true*/
		var searchFarmCtrl = this;
		searchFarmCtrl.searchForm = {};
		$scope.cantons = ['Vaud', 'Valais'];
		searchFarmCtrl.search = function() {
			console.log('search');
			var req = {
				method: 'post',
				url: '/showFarms.html',
				data: searchFarmCtrl.searchForm
			};
			$http(req).then(function(res) {
				console.log(res.data);
				console.log(searchFarmCtrl.searchForm);
				searchFarmCtrl.results = res.data;
				$state.transitionTo('searchFarm.showFarms');
			}, function() {});
		};
	}
})();