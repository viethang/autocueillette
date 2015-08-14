var app = angular.module('app',['ui.router', 'templates-app']);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/index.html');
	$stateProvider
	.state('index', {
		url: ''
	})
	.state('newFarm', {
		url: '/newFarm',
		templateUrl: 'newFarm/newFarmForm.tpl.html'
	})
	.state('searchFarm', {
		url: '/searchFarm',
		templateUrl: 'searchFarm/searchFarmForm.tpl.html'
	})
	.state('searchFarm.showFarms', {
		templateUrl:'searchFarm/showFarms.tpl.html'
	});
}]);