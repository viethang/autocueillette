function newFarmFormController($scope, $http) {
	var self = this;
	self.farm = {};
	self.farm.products = [{}];

	this.submit = function() {
		var farm = self.farm;
		var req = {
			method: 'post',
			url: '/newFarm.html',
			data: farm
		};
		$http(req).then(function() {
			console.log('ok');
			self.farm = {};
			self.farm.products = [{}];
		}, function() {
			console.log('error');
		});
		console.log('submit!');
	};
	$scope.cantons = ['Vaud', 'Valais'];

	this.addProduct = function() {
		self.farm.products.push({});
	};

	this.removeProduct = function(index) {
		self.farm.products.splice(index,1);
	};
}

newFarmFormController.$inject = ['$scope', '$http']; 