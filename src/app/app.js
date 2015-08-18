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
		templateUrl: 'components/newFarm/newFarmForm.tpl.html'
	})
	.state('searchFarm', {
		url: '/searchFarm',
		templateUrl: 'components/searchFarm/searchFarmForm.tpl.html'
	})
	.state('searchFarm.showFarms', {
		templateUrl:'components/searchFarm/showFarms.tpl.html'
	});
}]);