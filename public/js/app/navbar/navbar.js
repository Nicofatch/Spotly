//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('navbar',[])

.controller('NavbarController', function ($scope, appSettings, $rootScope, $state, $stateParams, $location) {

    
    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    }

    function init() {
        console.log('NavbarController - init');
        //console.log($state);
        $scope.search = $state.current.data.search;
        $scope.fixed = $state.current.data.fixed;
        $scope.isAuthenticated = false;

        $rootScope.k = $state.params.k;
        $rootScope.l = {};
        $rootScope.l.address = $state.params.address;
        $rootScope.l.lat = $state.params.lat;
        $rootScope.l.lng = $state.params.lng;
    }


    $scope.$watch('$state.params',function(){
        init();
    })

})
.controller('ExploreFormController', function ($scope, $rootScope, $state) {

    $scope.$watch('$state.params',function(){

    })

    $scope.explore = function(){
        console.log($scope.k);
        console.log($scope.l);
        $state.go('explore.query',{
            k:$scope.k,
            address:$scope.l.address,
            lat:$scope.l.lat,
            lng:$scope.l.lng
        });
    }
});
