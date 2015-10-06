(function() {
    'use strict';

    searchFarmController.$inject = ['$scope', '$http', '$state', 'searchService', 'OLServices', '$timeout', '$stateParams'];
    angular.module('app')
    .controller('SearchFarmController', searchFarmController);
    function searchFarmController($scope, $http, $state, searchService, OLServices, $timeout, $stateParams) {
            /* jshint validthis: true*/
        var searchFarmCtrl = this;
        var map = new OLServices.OLMap();
        var center;
        searchFarmCtrl.format = function(farm) {
            return [farm.street, farm.city, farm.canton, farm.country].filter(Boolean).join(', ');
        };
        searchFarmCtrl.searchForm = {};
        searchFarmCtrl.searchForm.place = $stateParams.place;
        searchFarmCtrl.searchForm.products = $stateParams.products;
        if (searchFarmCtrl.searchForm.place || searchFarmCtrl.searchForm.products) {
            search(searchFarmCtrl.searchForm.place, searchFarmCtrl.searchForm.products);
        }
        searchFarmCtrl.search = function(place, products) {
            place = place || 'lausanne, suisse';
            $state.go('search', {place: place, products: products});
        };
        $scope.show = {};
        searchFarmCtrl.showFarm = function(farm) {
            $state.go('farmInfo.view', {farmId: farm.id});
        };

        searchFarmCtrl.choose = function(place) {
            searchFarmCtrl.searchForm.place = place.formattedAddress;
            $state.go('search', {place: place.formattedAddress, products: searchFarmCtrl.searchForm.products});
            searchIndex(place, searchFarmCtrl.searchForm.products);
            searchFarmCtrl.searchAlert = null;
        };

        function search(place, products) {
            searchFarmCtrl.searchAlert = null;
            searchService.bingSearch(place, function(response) {
                switch (response.status) {
                    case 'ERR':
                        alert('components/common/alertError.html');
                        $timeout(function() {
                                searchFarmCtrl.searchAlert = null;
                        }, 2000);
                        break;
                    case 'OK':
                        if (response.result.length > 1) {
                            searchFarmCtrl.places = response.result.map(function(place) {
                                Object.defineProperty(place, 'formattedAddress', {
                                    get: function() {
                                        var add = this.address;
                                        return [add.addressLine, add.locality, add.adminDistrict, add.countryRegion].filter(Boolean).join(', ');
                                    }
                                });
                                return place;
                            });
                            alert('components/searchFarm/multiAddr.alert.tpl.html');
                        } else {
                            searchFarms(response.result[0], products);
                        }
                        break;
                }
            });
        }

        function alert(templateUrl) {
            searchFarmCtrl.searchAlert = templateUrl;
        }
        function searchFarms(suggestion, products) {
            center = suggestion.geocodePoints[0].coordinates;
            var data = {
                coordinates: center,
                products: products
            };
            var req = {
                method: 'post',
                url: '/searchFarms',
                data: data
            };
            $http(req).then(function(res) {
                var results = res.data;
                searchFarmCtrl.results = results;
                $scope.show.map = true;
                showMap(results);
            }, function(err) {
                alert('components/common/alertError.html');
                $timeout(function() {
                        searchFarmCtrl.searchAlert = null;
                }, 2000);
            });
        }

        function showMap(results) {
            map.map.setTarget('map_search');
            map.resetView(center);
            results.forEach(function(farm) {
                map.addPoint([farm.lat, farm.lon]);
            });
            map.fit();
        }
    }
})();
