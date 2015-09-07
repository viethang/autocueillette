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
		controller: 'NewFarmFormController as newFarmCtrl'
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
		templateUrl: 'components/searchFarm/searchFarmForm.tpl.html',
		controller: 'SearchFarmController as searchFarmCtrl'
	})
	.state('searchFarm.search', {
		views: {
			'searchForm': {
				templateUrl: 'components/searchFarm/searchForm.tpl.html'
			}
		}
	})
	.state('searchFarm.showResult', {
		views: {
			'searchForm': {
				templateUrl: 'components/searchFarm/searchForm.tpl.html'
			},
			'searchResult': {
				templateUrl: 'components/searchFarm/showFarms.tpl.html'
			},
			'map': {
				templateUrl: 'components/searchFarm/map.tpl.html'
			}
		}
	})
	.state('farmInfo', {
		url: '/farmInfo/:farmId/:update',
		templateUrl: 'components/farmInfo/farmInfo.tpl.html',
		controller: 'FarmInfoController as farmInfoCtrl'
	})
	.state('farmInfo.view', {
		views: {
			'general': {
				templateUrl: 'components/farmInfo/generalInfo.tpl.html'
			},
			'detailed': {
				templateUrl: 'components/farmInfo/detailedInfo.tpl.html'
			}
		}
	})
	.state('farmInfo.editAddress', {
		views: {
			'editAddress': {
				templateUrl: 'components/farmInfo/editAddress.tpl.html'
			}
		}
	})
	.state('farmInfo.editDetails', {
		url:'/editDetails',
		views: {
			'editDetails': {
				templateUrl: 'components/farmInfo/editDetails.tpl.html'
			},
			'general': {
				templateUrl: 'components/farmInfo/generalInfo.tpl.html'
			}
		}
	});
}]);
