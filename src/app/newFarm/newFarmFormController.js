app.controller('NewFarmFormController', ['$scope', '$http',
					function($scope, $http) {
	$scope.products = [{}];

	this.submit = function() {
		var farm = {
			name: this.name,
			address: {
				canton: this.canton,
				city: this.city,
				postalCode: this.postalCode,
				street: this.street
			},
			tel: this.tel,
			products: this.products,
			openHours: this.openHours
		};
		var req = {
			method: 'post',
			url: '/newFarm.html',
			data: farm
		};
		$http(req).then(function() {
			console.log('ok');
			this.name = 'tata';
			this.city = undefined;
		}.bind(this), function() {
			console.log('error');
		});
		console.log('submit!');
	};
	$scope.cantons = ['Vaud', 'Valais'];
}]);