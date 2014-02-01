//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('NewMapController', function ($scope, $state, mapService) {
    init();

    function init() {
        console.log('NewMapController - init');
        $scope.public = 'public';
        $scope.private = 'private';
        $scope.visibility = $scope.public;        
        /*$scope.publicClass = 'btn btn-primary';
        $scope.privateClass = 'btn btn-default';*/
    };

    $scope.insertMap = function () {
       var map = {
            'title': $scope.newMap.title,
            'description': $scope.newMap.description,
            //'tags':$scope.newMap.tags,
            'tags':$('#inputTags').val().split(','),
            'private':($scope.visibility==='private'),
            'spots': []
       };

        mapService.insertMap(map).then(function(data) {
            $scope.maps.push(data);
        });
        
	     // Redirect to parent (map)
	     $state.go('maps');
    };
});
