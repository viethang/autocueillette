app.controller('newFarmFormController', ['$scope', function($scope) {
	this.submit = function() {
		console.log('submit!');
	};
	$scope.cantons = ['Vaud', 'Valais'];
}]);