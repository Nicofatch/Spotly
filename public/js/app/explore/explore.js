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
                    templateUrl:'/js/app/navbar/navbar.tpl.html',
                    controller: 'NavbarController',
                },
                'main': {
                    templateUrl:'/js/app/explore/explore.tpl.html',
                    controller: 'ExploreController'
                }
            },
            data: {
                'fixed':true,
                'search':true
            }
        })
        .state('explore.query', {
            url:'/:k/:address/:lat/:lng',
        })
    }
    ]
    )
.controller('ExploreController', function ($scope, $rootScope, $state, spotsService, utilsService, $location, $modal) {

    //$scope.spotMap = {};
    
    function init() {
        console.log('ExploreController - init');

        $scope.spots = {};

        //Complete search query
        if (!$scope.k) {
            // No keyword filter
            $scope.k = 'All Sports';
        }
        if (!$scope.l.lng || !$scope.l.lat) {
            /*if ($scope.l) {
                // Get lng & lat using google location

            } else {*/
                // Use geolocation
            $scope.l = "My Location";
            getCurrentLocation(function(location){
                spotsService.searchSpots({k:$scope.k,lat:location.coords.latitude,lng:location.coords.longitude}).then(function(data){
                    $scope.spots = data;
                });
            });
            $scope.location = true;
        } else {
            spotsService.searchSpots({k:$scope.k,lat:$scope.l.lat,lng:$scope.l.lng}).then(function(data){
                $scope.spots = data;
            });
        }
        $("#k-xs").val($scope.k);
        $("#l-xs").val($scope.l);
    }

    $scope.$watch('$state.params',function(){
        init();
    });

    function getCurrentLocation(onLocationFound) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onLocationFound);
        }
    }

    $scope.like = function(index) {
        $scope.spots[index].likes.push("Nicolas");
        spotsService.updateSpot($scope.spots[index]);
    }

    // $scope.openModal = function () {
    //     var modalInstance = $modal.open({
    //         templateUrl: 'myModalContent.html',
    //         controller: ModalInstanceCtrl,
    //         resolve: {
    //             items: function () {
    //                 return $scope.items;
    //             }
    //         }
    //     });

    //     modalInstance.result.then(function (selectedItem) {
    //         $scope.selected = selectedItem;
    //     }, function () {
    //         $log.info('Modal dismissed at: ' + new Date());
    //     });
    // };

    // var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    //     $scope.items = items;

    //     $scope.ok = function () {
    //         $modalInstance.close();
    //     };

    //     $scope.cancel = function () {
    //         $modalInstance.dismiss('cancel');
    //     };
    // };

});
