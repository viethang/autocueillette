(function() {
    'use strict';

    angular.module('app')
    .controller('FarmInfoController', FarmInfoController);

    FarmInfoController.$inject = ['$state', '$stateParams', '$http', 'OLServices', '$timeout', '$scope', '$anchorScroll', '$location'];

    function FarmInfoController($state, $stateParams, $http, OLServices, $timeout, $scope, $anchorScroll, $location) {
        /* jshint validthis: true*/
        var farmId = $stateParams.farmId;
        this.map = new OLServices.OLMap();
        $location.hash('');
        this._location = $location;
        this._anchorScroll = $anchorScroll;
        this._timeout = $timeout;
        this._http = $http;
        this._state = $state;
        this.mode = {};
        this.newComment = {};
        this.editor = {};
        this.farm = {};
        this.getFarm(farmId)
        .then(this.setup.bind(this))
        .then(this.getComments.bind(this, farmId));
        this.toEditMode = function() {
            $state.go('farmInfo.edit', {farmId: farmId}, {reload: true});
        };
        this.format = function(farm) {
            return [farm.street, farm.city, farm.canton, farm.country].filter(Boolean).join(', ');
        };
    }

    FarmInfoController.prototype.getFarm = function(id) {
        var req = {
            method: 'post',
            url: '/getFarm',
            data: {id: id}
        };
        return this._http(req).then(function(res) {
            if (!res.data.err) {
                this.farm = res.data.farmInfo;
            }
        }.bind(this), function(err) {
            console.log(err);
        });
    };

    FarmInfoController.prototype.setup = function() {
        var farm = this.farm;
        this._timeout(function() {
            this.map.map.setTarget('map1');
            this.map.resetView([farm.lat, farm.lon]);
        }.bind(this));
        this.edit = {
            name: farm.name,
            phone: farm.phone,
            products: farm.products
        };
    };

    FarmInfoController.prototype.sendComment = function(comment) {
        var req = {
            method: 'post',
            url: '/postComment',
            data: {
                id: this.farm.id,
                message: comment.text,
                author: comment.senderName,
                email: comment.senderEmail
            }
        };
        this._http(req).then(function(res) {
        }, function(err) {
            console.log('send comment error', err);
        });

        this._state.go('farmInfo.view', {farmId: this.farm.id}, {reload: true});
    };

    FarmInfoController.prototype.update = function(farm) {
        var req = {
            method: 'post',
            url: '/updateFarm',
            data: farm
        };
        this._http(req).then(function(res) {
        }, function(err) {
            console.log('update error', err);
        });
    };

    FarmInfoController.prototype.getSenderInfoFn = function() {
        if (!this.newComment.text) {
            return;
        }
        this.getSenderInfo = true;
        this._location.hash('senderInfo');
        this._anchorScroll();
    };

    FarmInfoController.prototype.getEditorInfoFn = function() {
        var farm = this.farm;
	var edit = this.edit;
        if ((edit.name === farm.name) &&
            (edit.phone === farm.phone) &&
            (edit.products === farm.products) &&
            (!edit.comment)) {
            return;
        }
        this.getEditorInfo = true;
        this._location.hash('editorInfo');
        this._anchorScroll();
    };

    FarmInfoController.prototype.sendUpdate = function() {
        var farm = this.farm;
	var edit = this.edit;
        var author = edit.author;
        var email = edit.email;
        farm.name = edit.name;
        farm.phone = edit.phone;
        farm.products = edit.products;
        farm.author = edit.author;
        this.checkContributor(author, email)
        .then(function(res) {
            if (res.data.err) {
                console.log('error', res.data.err);
                return;
            }
            if (res.data.status === 'invalid') {
                /*TODO: alert invalid identity*/
                this.invalidIdentity = true;
                console.log('invalid identity');
                return;
            }
            if (res.data.status === 'available') {
                this.addContributor(author, email);
            }
            this.update(farm);

            this._state.go('farmInfo.view', {farmId: this.farm.id}, {reload: true});
        }.bind(this), function(err) {
            console.log('error', err);
        });
    };

    FarmInfoController.prototype.checkContributor = function(name, email) {
        var req = {
            method: 'post',
            url: '/checkContributor',
            data: {name: name, email: email}
        };
        return this._http(req);
    };

    FarmInfoController.prototype.addContributor = function(name, email) {
        var req = {
            method: 'post',
            url: '/addContributor?',
            data: {name: name, email: email}
        };
        this._http(req).then(function(res) {
        }, function(err) {
            console.log('error', err);
        });
    };

    FarmInfoController.prototype.cancelEdit = function() {
        this._state.go('farmInfo.view', {farmId: this.farm.id}, {reload: true});
    };

    FarmInfoController.prototype.reportBadAddr = function() {
    };

    FarmInfoController.prototype.showHistoryFn = function() {
        var req = {
            method: 'get',
            url: '/getFarmHistory?id=' + this.farm.id
        };
        return this._http(req).then(function(res) {
            if (res.data.err) {
                return;
            }
            this.farmHistory = res.data;
            this.showHistory = true;
        }.bind(this), function(err) {
            console.log(err);
        });
    };

    FarmInfoController.prototype.getComments = function(farmId) {
        var req = {
            method: 'get',
            url: '/getComments?id=' + farmId
        };
        return this._http(req).then(function(res) {
            if (res.data.err) {
                return;
            }
            this.comments = res.data;
        }.bind(this), function(err) {
            console.log('get comments error', err);
        });
    };

})();
