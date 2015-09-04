angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/index.html');
	$stateProvider
	.state('index', {
		url: ''
	})
	.state('newFarm', {
		url: '/newFarm',
		templateUrl: 'components/newFarm/newFarmForm.tpl.html',
		controller: function($state) {
			$state.transitionTo('newFarm.fillAddress');
		}
	})
	.state('newFarm.fillAddress', {
		views: {
			'simpleForm': {
				templateUrl: 'components/newFarm/simpleForm.tpl.html'
			}
		}
	})
	.state('newFarm.confirmAddress', {
		views: {
			'simpleForm': {
				templateUrl: 'components/newFarm/simpleForm.tpl.html'
			},
			'parsedAddress': {
				templateUrl: 'components/newFarm/parsedAddress.tpl.html'
			},
			'map': {
				templateUrl: 'components/newFarm/map.tpl.html'
			},
			'addFarmButton': {
				template: "<div class = 'text-right'><button ng-click = 'newFarmCtrl.addFarm()'>Add this farm</button>"
			},
			'closeFarms': {
				templateUrl: 'components/newFarm/closeFarms.tpl.html'
			}
		}
	})
	.state('searchFarm', {
		url: '/searchFarm',
		templateUrl: 'components/searchFarm/searchFarmForm.tpl.html'
	})
	.state('searchFarm.showFarms', {
		templateUrl:'components/searchFarm/showFarms.tpl.html'
	});
}]);