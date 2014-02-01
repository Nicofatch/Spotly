//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('NewSpotController', function ($rootScope, $scope, $state, mapService, $stateParams, utilsService) {
    init();

    function init() {
        console.log('NewSpotController - init');
        $scope.locationGeo = 'geo';
        $scope.locationAddress = 'address';
        $scope.locationType = $scope.locationGeo;
    }
    
    $scope.insertSpot = function () {
        var spot = {
            _id: utilsService.guid(),
            title: $scope.newSpot.title,
            description: $scope.newSpot.description,
            longitude: spotMap.geoPosition.marker.LMarker._latlng.lng,
            latitude: spotMap.geoPosition.marker.LMarker._latlng.lat
        };

        $rootScope.map.spots.splice(0,0,spot);
        mapService.updateMap($rootScope.map).then(function(data) {
            $rootScope.map = data;
        });
	    // Remove the geo marker
        spotMap.removeGeoMarker();
        
        // Adjust the map
        spotMap.fitOnBounds();
	    
        // Redirect to parent (map)
	    $state.go('map');
    };

    $scope.switchLocationType = function(type) {
        $scope.locationType = type;
        if ($scope.locationType == $scope.locationGeo) {
            $('#newSpotLocationAddressContainer').hide();
            $('#newSpotTitle').focus();
        } else {
            $('#newSpotLocationAddressContainer').show();            
            $('#newSpotLocationAddress').focus();
            $('#newSpotLocationAddress').autocomplete({
                paramName: 'input',
                serviceUrl: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw',
                onSelect: function (suggestion) {
                    $.ajax({
                        url: "https://maps.googleapis.com/maps/api/place/details/json?reference="+suggestion.data+"&sensor=true&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw",
                    }).done(function( data ) {
                        spotMap.moveGeoMarker({lat:data.result.geometry.location.lat, lng:data.result.geometry.location.lng});
                    });
                },
                transformResult: function(response) {
                  return {
                    suggestions: $.map($.parseJSON(response).predictions, function(dataItem) {
                      /*var a = '';
                      if (dataItem.address.hasOwnProperty('road'))
                        a += dataItem.address.road + ', ';
                      if (dataItem.address.hasOwnProperty('city'))
                        a += dataItem.address.city + ', ';
                      if (dataItem.address.hasOwnProperty('country'))
                        a += dataItem.address.country;*/
                      return { value: dataItem.description , data: dataItem.reference };
                    })
                  };
                }
            });
        }
    }
});
