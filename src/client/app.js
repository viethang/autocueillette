(function startAngular() {
	var app = angular.module('app',['ui.router', 'templates-app', 'ui.bootstrap']);
	
	app.run(function($rootScope) {
		angular.element(window).on("resize", function() {
			$rootScope.$apply();
		});
	});
	app.constant('BingKey', 'Au8OlA-KP8dCeyVh4LZ5wUrx9gwnckxhiwdMR0Lrb11XpjovcBCAM_3uurH8r2XT');
})();
