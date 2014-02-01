//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('ExploreController', function ($scope, $state, spotsService, utilsService, $stateParams, $location) {

    $scope.spots = {};
    $scope.spotMap = {};
    $scope.selectedSpot = {};

    init();

    function init() {
        console.log('ExploreController - init');
        
        $scope.spotMap = new SpotMap('map',{
            onLocationFound:onLocationFound,
            onPopupOpen:onPopupOpen
        });

        // Get explore params: keywords & location
        var exploreParams = utilsService.getQueryStringParams($location.absUrl());
        // Get keywords
        if (exploreParams['k'])
            $scope.k = decodeURIComponent(exploreParams['k'][0]).replace('+',' ');
        // Get location name
        if (exploreParams['l'])
            $scope.l = decodeURIComponent(exploreParams['l'][0]).replace('+',' ');
        // Get latitude of location
        if (exploreParams['lat']) {
            $scope.lat = exploreParams['lat'][0];
            // To be replaced after reading of chapter 9
            $('#lat-xs').val($scope.lat);
            $('#lat').val($scope.lat);
        }    
        // Get longitude of location
        if (exploreParams['lng']) {
            $scope.lng = exploreParams['lng'][0];
            // To be replaced after reading of chapter 9
            $('#lng-xs').val($scope.lng);
            $('#lng').val($scope.lng);
        }
            

        //Complete search query
        if (!$scope.k) {
            // No keyword filter
            $scope.k = 'All Sports';
        }
        if (!$scope.lng || !$scope.lat) {
            /*if ($scope.l) {
                // Get lng & lat using google location

            } else {*/
                // Use geolocation
            $scope.l = "My Location"
            $scope.spotMap.geoLocate();
            /*}*/
        } else {
            spotsService.searchSpots({k:$scope.k,lat:$scope.lat,lng:$scope.lng}).then(function(data){
                $scope.spots = data;
            });
        }
        $("#k-xs").val($scope.k);
        $("#l-xs").val($scope.l);

        $("#k").val($scope.k);
        $("#l").val($scope.l);
    }

    $scope.selectSpot = function (id) {
        $scope.spotMap.focusOnMarker(id,{zoom:false});
    }

    $scope.like = function(index) {
        $scope.spots[index].likes.push("Nicolas");
        spotsService.updateSpot($scope.spots[index]).then(function(data){
            $scope.spots[index] = data;
        });
    }

    /*$scope.$watch('spotMap.geoPositon',function() {
        if ($scope.geoPosition) {
            $scope.lat = $scope.geoPosition.marker.LMarker._latlng.lat;
            $scope.lng = $scope.geoPosition.marker.LMarker._latlng.lng;
        }
    });*/
    
    $scope.unselectSpot = function () {
        $scope.spotMap.closePopup($scope.selectedSpot._id);
        $("#spot-"+$scope.selectedSpot._id).removeClass('spot-selected');
        $scope.selectedSpot = {};
    }

    $scope.isSelected = function (spot) {
        return $scope.selectedSpot === spot;
    }

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        var message = "You are within " + radius + " meters from this point";

        // Update geoposition coords
        //this.geoPosition.coords.latitude = e.latlng.lat;
        //this.geoPosition.coords.longitude = e.latlng.lng;

        // Create a new marker
        var marker = new Marker({
            id: 'geoPosition',
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            title: message,
            draggable: true,
            awesomeIcon: 'icon-screenshot icon-large',
            color: 'red'
        });
        
        // Display the marker
        $scope.spotMap.map.addLayer(marker.LMarker);

        // store the marker
        $scope.spotMap.geoPosition.marker = marker;

        $scope.lat = $scope.spotMap.geoPosition.marker.LMarker._latlng.lat;
        $scope.lng = $scope.spotMap.geoPosition.marker.LMarker._latlng.lng;
        
        spotsService.searchSpots({k:$scope.k,lat:$scope.lat,lng:$scope.lng}).then(function(data){
            $scope.spots = data;
        });
    };

    // Triggered when a spot has been selected, by clicking on left bar or directly on marker
    function onPopupOpen(e) {
        var spotId = e.popup._source.options.id;
        // Unselect current spot
        $scope.unselectSpot();
       
        // Select new spot
        for (var i=0,l=$scope.spots.length;i<l;i++) {
            if ($scope.spots[i]._id == spotId) {
                $scope.selectedSpot = $scope.spots[i];
                break;
            }
        }
        // If the spot item does not appear in the spot list, display it (with an animation)
        if (!utilsService.isElementInViewport($("#spot-"+spotId).get(0),{top:70})) {
            var offset = $("#spot-"+spotId).offset().top - 70;
            $('html, body').animate({   
                scrollTop: offset
            }, 500, function(){
                $("#spots-main").offset({ top:$('body').scrollTop() +70 });
            });
        } else {
            $("#spots-main").offset({ top:$('body').scrollTop() +70 });
        }
        $("#spot-"+spotId).addClass('spot-selected');
    };
});
