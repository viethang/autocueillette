(function() {
	'use strict';

	angular.module('app')
	.controller('FarmInfoController', farmInfoController);
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
			var coordinates = farm.coordinates;
			$timeout(function() {
				map.map.setTarget('map1');
				map.resetView(coordinates);
			});
			$scope.edit = {
				tel: farm.tel,
				name: farm.name,
				product: farm.product
			};
		});
		farmInfoCtrl.sendComment = sendComment;
		farmInfoCtrl.getSenderInfo = getSenderInfo;
		farmInfoCtrl.getEditorInfo = getEditorInfo;
		farmInfoCtrl.edit = edit;
		farmInfoCtrl.cancelEdit = cancelEdit;

		function getFarm(id, target) {
			var req = {
				method: 'post',
				url: '/getFarm',
				data: {id: id}
			};
			return $http(req).then(function(res) {
				for (var key in res.data) {
					target[key] = res.data[key];
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
			$state.go('farmInfo', {farmId: farmInfoCtrl.farm._id}, {reload: true});
		}

		function update(farm) {
			var req = {
				method: 'post',
				url: '/updateFarm',
				data: farm
			};
			$http(req).then(function(res) {
			}, function(err) {
				console.log('update error');
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
				($scope.edit.tel === farm.tel) &&
				($scope.edit.product === farm.product) &&
				(!$scope.edit.comment)) {
				return;
			}
			$scope.getEditorInfo = true;
			$location.hash('editorInfo');
			$anchorScroll();
		}

		function edit() {
			var farm = farmInfoCtrl.farm;
			var farmCopy = angular.copy(farm);
			farm.name = $scope.edit.name;
			farm.tel = $scope.edit.tel;
			farm.product = $scope.edit.product;
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
					oldInfo: farmCopy,
					newInfo: farm
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
			$state.go('farmInfo', {farmId: farmInfoCtrl.farm._id}, {reload: true});
		}

		function cancelEdit() {
			$state.go('farmInfo', {farmId: farmInfoCtrl.farm._id}, {reload: true});
		}
	}
	farmInfoController.$inject = ['$state', '$stateParams', '$http', 'OLServices', '$timeout', 'searchService', '$scope', '$anchorScroll', '$location'];
})();
