app.controller('SearchFarmController', ['$scope', '$http',
					function($scope, $http) {
	this.search = function() {
		console.log('search');
		var req = {
			method: 'post',
			url: '/searchFarm.html'
		};
		$http(req).then(function(res) {
			console.log(res.data);

		}, function() {});
	};
}]);