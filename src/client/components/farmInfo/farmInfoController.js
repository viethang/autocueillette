(function() {
    'use strict';

    angular.module('app')
    .controller('FarmInfoController', farmInfoController);

    farmInfoController.$inject = ['$state', '$stateParams', '$http', 'OLServices', '$timeout', 'searchService', '$scope', '$anchorScroll', '$location'];

    function farmInfoController($state, $stateParams, $http, OLServices, $timeout, searchService, $scope, $anchorScroll, $location) {
        /* jshint validthis: true*/
        var farmId = $stateParams.farmId;
        var farmInfoCtrl = this;
        var map = new OLServices.OLMap();
        $location.hash('');
        $scope.mode = {};
        $scope.editor = {};
        farmInfoCtrl.farm = {};
        getFarm(farmId, farmInfoCtrl.farm)
        .then(function() {
            var farm = farmInfoCtrl.farm;
            $timeout(function() {
                map.map.setTarget('map1');
                map.resetView([farm.lat, farm.lon]);
            });
            $scope.edit = {
                name: farm.name,
                phone: farm.phone,
                products: farm.products
            };
        });
        farmInfoCtrl.sendComment = sendComment;
        farmInfoCtrl.getSenderInfo = getSenderInfo;
        farmInfoCtrl.getEditorInfo = getEditorInfo;
        farmInfoCtrl.sendUpdate = sendUpdate;
        farmInfoCtrl.cancelEdit = cancelEdit;
        farmInfoCtrl.toEditMode = function() {
            $state.go('farmInfo.edit', {farmId: farmId}, {reload: true});
        };
        farmInfoCtrl.reportBadAddr = reportBadAddr;

        function getFarm(id, target) {
            var req = {
                method: 'post',
                url: '/getFarm',
                data: {id: id}
            };
            return $http(req).then(function(res) {
                if (!res.data.err) {
                    var farmInfo = res.data.farmInfo;
                    for (var key in farmInfo) {
                        target[key] = farmInfo[key];
                    }
                }
            }, function(err) {
                console.log(err);
            });
        }

        function sendComment(comment) {
            if (!farmInfoCtrl.farm.comments) {
                farmInfoCtrl.farm.comments = [];
            }
            farmInfoCtrl.farm.comments.push({
                text: comment.text,
                date: new Date(),
                senderName: comment.senderName
            });
            update(farmInfoCtrl.farm);
            $state.go('farmInfo.view', {farmId: farmInfoCtrl.farm.id}, {reload: true});
        }

        function update(farm) {
            var req = {
                method: 'post',
                url: '/updateFarm',
                data: farm
            };
            $http(req).then(function(res) {
            }, function(err) {
                console.log('update error', err);
            });
        }

        function getSenderInfo() {
            if (!$scope.newComment.text) {
                return;
            }
            $scope.getSenderInfo = true;
            $location.hash('senderInfo');
            $anchorScroll();
        }

        function getEditorInfo() {
            var farm = farmInfoCtrl.farm;
            if (($scope.edit.name === farm.name) &&
                ($scope.edit.phone === farm.phone) &&
                ($scope.edit.products === farm.products) &&
                (!$scope.edit.comment)) {
                return;
            }
            $scope.getEditorInfo = true;
            $location.hash('editorInfo');
            $anchorScroll();
        }

        function sendUpdate() {
            var farm = farmInfoCtrl.farm;
            var farmCopy = angular.copy(farm);
            delete farmCopy.history;
            farm.name = $scope.edit.name;
            farm.phone = $scope.edit.phone;
            farm.products = $scope.edit.products;
            var same = true;
            for (var prop in farm) {
                if (farm[prop] !== farmCopy[prop]) {
                    same = false;
                    break;
                }
            }
            if (!same) {
                if (!farm.history) {
                    farm.history = [];
                }
                var trace = {
                    editor: $scope.editor.name,
                    date: new Date(),
                    oldInfo: farmCopy
                };
                farm.history.push(trace);
            }
            if ($scope.edit.comment) {
                farm.comments.push({
                    text: $scope.edit.comment,
                    date: new Date(),
                    senderName: $scope.editor.name
                });
            }
            update(farm);
            $state.go('farmInfo.view', {farmId: farmInfoCtrl.farm.id}, {reload: true});
        }

        function cancelEdit() {
            $state.go('farmInfo.view', {farmId: farmInfoCtrl.farm.id}, {reload: true});
        }

        function reportBadAddr() {
        }
    }
})();
