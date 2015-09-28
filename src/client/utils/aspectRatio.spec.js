describe('AspectRatio', function() {
	var $compile, $rootScope, $document;
	beforeEach(module('app'));
	beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$document = _$document_;
	}));
	it('should always conserve the fixed ratio', function() {
		var $scope = $rootScope.$new();
		var element = $compile('<div aspect-ratio = "1:2"></div>')($scope);
		angular.element($document[0].body).append(element);
		element.css('width', '100px');
		$scope.$digest();
		expect(element.css('height')).toEqual('50px');
	});
});