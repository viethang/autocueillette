(function() {
	'use strict';

	angular.module('app')
	.directive('disableEmitter', disableEmitterDirective);

	function disableEmitterDirective() {
		var directive = {
			restrict: 'A',
			link: linkFn
		};
		return directive;

		function linkFn(scope, element, attrs) {
			element.bind('keydown', function(event) {
				if (event.keyCode == 13) {
					event.preventDefault();
				}
			});
			element.bind('click', function(event) {
				event.preventDefault();
			});
		}
	}
})();
