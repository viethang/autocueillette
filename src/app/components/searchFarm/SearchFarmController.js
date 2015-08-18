app.controller('SearchFarmController', ['$scope', '$http', '$state',
					function($scope, $http, $state) {
	this.searchForm = {};
	$scope.cantons = ['Vaud', 'Valais'];
	this.search = function() {
		console.log('search');
		var req = {
			method: 'post',
			url: '/showFarms.html',
			data: this.searchForm
		};
		$http(req).then(function(res) {
			console.log(res.data);
			console.log(this.searchForm);
			this.results = res.data;
			$state.transitionTo('searchFarm.showFarms');
		}.bind(this), function() {});
	};
}]);