/*usage: 
* <bingSearch ng-model = 'searchStr' option = 'options'
* results = 'results' on-complete = 'callback'></bingSearch>
*/

function bingSearchDirective(BingKey, $http) {
	return {
		restrict: 'EA',
		scope: {
			option: '=',
			results: '=',
			action: '&onComplete',
			searchString: '@ngModel'
		},
		template: '<input type = "text"></input>',
		replace: true,
		link: function(scope, element, attrs, controller) {
			setCheckComplete();
			scope.$on('complete', function() {
				console.log('complete!');
				var request = "http://dev.virtualearth.net/REST/v1/Locations?query=" +
					encodeURIComponent(scope.searchString) +
					"&jsonp=JSON_CALLBACK&key=" + BingKey;
				$http.jsonp(request)
				.success(function(result) {
					if (!result.resourceSets.length) {
						console.log('No result found');
						return;
					}
					if (scope.results) {
						for (var key in result) {
							scope.results[key] = result[key];
						}
					}
					if (scope.action) {
						scope.action();
					}
					console.log(result);
				})
				.error(function() {
					console.log('error');
				});
			});
			function setCheckComplete() {
				element.bind('keydown', function(event) {
					if (event.keyCode == 13) {
						scope.$emit('complete');
					}
				});
			}
		}
	};
}
bingSearchDirective.$inject = ['BingKey', '$http'];
