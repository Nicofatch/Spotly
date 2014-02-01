//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('MapsController', function ($scope, $state, mapService, filterFilter) {
    $scope.maps = [];
    $scope.visibility = 'all';
    $scope.visibilityFilter={};

    $scope.tagClass = function(parent_id, id) {
    	//console.log(parent_id + ' ' +id);
    	switch((parent_id + 4*id) % 5) {
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

    $scope.$watch('visibility',function(){
        switch($scope.visibility) {
            case 'all':
                $scope.visibilityFilter={};                
                break;
            case 'private':
                $scope.visibilityFilter={private:true};
                break;
            case 'public':
                $scope.visibilityFilter={private:false};
                break;
        }
    });

    

    init();

    function init() {
        console.log('MapsController - init');
        mapService.getMaps().then(function(data){
            $scope.maps = data;
        });
    }
});
