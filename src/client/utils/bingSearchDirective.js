/*usage: 
* <bing-search ng-model = 'searchStr' option = 'options'
* results = 'results' on-complete = 'callback'></bing-search>
*/

function bingSearchDirective(searchService) {
	return {
		restrict: 'EA',
		scope: {
			option: '=',
			result: '=',
			action: '&onComplete',
			searchString: '=ngModel'
		},
		template: '<input type = "text"></input>',
		replace: true,
		link: function(scope, element, attrs, controller) {
			setCheckComplete();
			scope.$on('complete', function() {
				searchService.bingSearch(scope.searchString, function(response) {
					switch (response.status) {
						case 'NR':
							console.log('No result found');
							break;
						case 'ERR':
							console.log('Error! Try again.');
							break;
						case 'OK':
							if (attrs.result) {
								for (var key in response.result) {
									scope.result[key] = response.result[key];
								}
							}
							if (scope.action) {
								scope.action();
							}
							break;
					}
				});
			});
			function setCheckComplete() {
				element.bind('keydown', function(event) {
					if (event.keyCode == 13) {
						scope.$emit('complete');
						console.log('enter');
					}
				});
			}
		}
	};
}
bingSearchDirective.$inject = ['searchService'];
