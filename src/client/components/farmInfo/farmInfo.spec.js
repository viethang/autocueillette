describe('FarmInfoController', function() {
    var controller;
    var scope = {};
    beforeEach(module('app'));
    beforeEach(angular.mock.inject(function($controller) {
            controller = $controller('FarmInfoController', {$scope: scope});
    }));

//     describe('sendComment', function() {
//             beforeEach(function() {
//                     controller.farm = {};
//             });
//             it('must attach comment to farm', function() {
//                     controller.sendComment({text: 'A comment from Hang'});
//                     controller.sendComment({text: 'another'});
//                     expect(controller.farm.comments[0].text).toEqual('A comment from Hang');
//                     expect(controller.farm.comments[1].text).toEqual('another');
//             });
//     });
});
