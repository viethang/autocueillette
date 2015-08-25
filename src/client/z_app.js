(function startAngular() {
	var app = angular.module('app',['ui.router', 'templates-app', 'ui.bootstrap']);
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
	app.run(function($rootScope) {
		angular.element(window).on("resize", function() {
			$rootScope.$apply();
		});
	});
	app.constant('BingKey', 'Au8OlA-KP8dCeyVh4LZ5wUrx9gwnckxhiwdMR0Lrb11XpjovcBCAM_3uurH8r2XT');
	app.service('searchService', searchService);
	app.directive('bingSearch', bingSearchDirective);
	app.directive('disableEmitter', disableEmitterDirective);
	app.directive('aspectRatio', aspectRatioDirective);
	app.controller('ModalController', modalCtrl);
	app.controller('NewFarmFormController', newFarmFormController);
	app.controller('SearchFarmController', searchFarmController);
})();
