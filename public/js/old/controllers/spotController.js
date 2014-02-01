//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('SpotController', function ($rootScope, $scope, $state, spotsService, $stateParams, utilsService) {
    init();
    // TOdo: burk
    $rootScope.currentSpotId = $stateParams.spotId;

    function init() {
        console.log('SpotController - init');
        spotsService.getSpot($stateParams.spotId).then(function(data) {
            $rootScope.spot = data;
        });
        // The "minimized" mode means the spot title and descriptions are not shown, and the spot left bar is narrowed
        $rootScope.mode = "minimized";
    }


     $scope.tagClass = function(id) {
        switch(id % 5) {
            case 0:
                return "label label-primary";
            case 3:
                return "label label-info";
            case 1:
                return "label label-success";
            case 2:
                return "label label-warning";
            case 4:
                return "label label-danger";
        }
    }

    $scope.deleteTag = function(tag) {
        // Remove tag from tag array
        /*var index = $rootScope.map.tags.indexOf(tag);
        $rootScope.map.tags.splice(index, 1);
        // Update map
        mapService.updateMap($rootScope.map).then(function(data) {
            $rootScope.map = data;
        });*/
    }

    $scope.tags = function() {
    	$state.go('explore.spot.tags',{spotId:$rootScope.currentSpotId});
    }

});
