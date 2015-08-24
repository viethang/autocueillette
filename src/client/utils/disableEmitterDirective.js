function disableEmitterDirective() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('keydown', function(event) {
				if (event.keyCode == 13) {
					event.preventDefault();
				}
			});
		}
	};
}