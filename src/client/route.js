angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.when('/newFarm', function($state) {
		$state.go('newFarm');
	});
	$urlRouterProvider.when('/farmInfo', function($state) {
		$state.go('farmInfo');
	});
	$urlRouterProvider.otherwise('/');
	$stateProvider
	.state('index', {
		url: '/',
		views: {
			'search': {
				templateUrl: 'components/searchFarm/searchFarm.tpl.html',
				controller: 'SearchFarmController as searchFarmCtrl'
			}
		}
	})
	.state('newFarm', {
		url: '/newFarm',
		templateUrl: 'components/newFarm/newFarmForm.tpl.html',
		controller: 'NewFarmController as newFarmCtrl'
	})
	.state('farmInfo', {
		url: '/farmInfo/:farmId',
		templateUrl: 'components/farmInfo/farmInfo.tpl.html',
		controller: 'FarmInfoController as farmInfoCtrl'
	});
}]);
