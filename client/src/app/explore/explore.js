//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('explore',['ui.bootstrap'])
.config(
    [ '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {   
            $stateProvider
            .state('explore', {
                url:'/explore',
                views: {
                    'navbar': {
                        templateUrl:'navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'explore/explore.tpl.html',
                        controller: 'ExploreController'
                    }
                },
                data: {
                    'fixed':true,
                    'search':true
                }
            })
            .state('explore.query', {
                url:'/:k/:l',
            });
        }
    ]
).controller('ExploreController', ['$scope', '$rootScope', 'spotsService', 'appSettings', function ($scope, $rootScope, spotsService, appSettings) {

    function init() {
        console.log('ExploreController - init');

        $scope.spots = {};
        
        // Run search query
        if ($scope.l.type === 'around') {
            getCurrentLocation(function(location){
                spotsService.searchSpots({k:$scope.k.value,lat:location.coords.latitude,lng:location.coords.longitude}).then(function(data){
                    $scope.spots = data;
                });
            });
        } else {
            $.ajax({
             url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?address="+$scope.l.value+"&sensor=false",
            }).done(function( data ) {
                data = JSON.parse(data);
                $rootScope.l.value = data.results[0].formatted_address;
                spotsService.searchSpots({k:$scope.k.value,lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng}).then(function(data){
                    $scope.spots = data;
                });
            });
        }
    }

    $scope.$watch('$state.params',function(){
        init();
    });

    function getCurrentLocation(onLocationFound) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onLocationFound);
        }
    }

}]);
