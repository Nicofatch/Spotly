//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
app.controller('ExploreController', function ($rootScope, $scope, $state, spotsService, utilsService, $stateParams, $location) {

    $rootScope.spots = {};
    $scope.selectedSpot = {};
    // The "normal" mode means the spot title and descriptions are shown, and the spot left bar is wider
    $rootScope.mode = "normal";

    init();

    function init() {
        console.log('ExploreController - init');
        
        $scope.spotMap = new SpotMap('map',{
            onLocationFound:onLocationFound,
            onPopupOpen:onPopupOpen
        });

        // Get explore params: keywords & location
        var exploreParams = utilsService.getQueryStringParams($location.absUrl());
        if (exploreParams['k'])
            $scope.k = decodeURIComponent(exploreParams['k'][0]).replace('+',' ');
        if (exploreParams['l'])
            $scope.l = decodeURIComponent(exploreParams['l'][0]).replace('+',' ');
        if (exploreParams['lat']) {
            $scope.lat = exploreParams['lat'][0];
            $('#lat-xs').val($scope.lat);
            $('#lat').val($scope.lat);
        }
            
        if (exploreParams['lng']) {
            $scope.lng = exploreParams['lng'][0];
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

    $scope.$watch('lng',function() {
        if ($scope.lng && $scope.lat && $scope.k) {
             //Perform search query
            
        }
    });

    $scope.toggleSpotMenu = function(id) {
        if ($rootScope.mode == "minimized")
            $('#spotMenu-mini-'+id).toggle();
        else
            $('#spotMenu-normal-'+id).toggle();
    }

    $scope.onSelectClick = function (id, options) {
        if ($rootScope.mode == "minimized")
            $scope.spotInfo(id);
        else
            $scope.selectSpot(id,options);
    }

    $scope.selectSpot = function (id, options) {
        $scope.spotMap.focusOnMarker(id,{zoom:options.zoom ? true : false,mode:$rootScope.mode});
    }

    $scope.like = function(index) {
        $scope.spots[index].likes.push("Nicolas");
        spotsService.updateSpot($scope.spots[index]).then(function(data){
            $scope.spots[index] = data;
        });
    }

    $scope.spotInfo = function(id) {
        // Remove selection
        $scope.unselectSpot();
        
        //switch to "minimized" mode : reduce info
        $rootScope.mode = "minimized";

        $('[data-toggle-display=true]').hide();
        $('[data-toggle-display=false]').show();
            $('#spots-left-bar').animate({
                width:'115px'
            },400,"linear",function(){
            }
        );

        // State change
        $state.go('explore.spot',{spotId:id});

        // Set selection
        $scope.selectSpot(id, {zoom:true});
    }

    $scope.explore = function() {
        // Remove selection
        var id = $scope.selectedSpot._id;
        $scope.unselectSpot();
        
        //switch to "normal" mode : display all spots info
        $rootScope.mode = "normal";

        // Page design transition
        $('#spots-left-bar').removeAttr('style');
        $('[data-toggle-display=false]').hide();
        $('[data-toggle-display=true]').show();

        // State change
        $state.go('explore');       

        // Set selection
        $scope.selectSpot(id, {zoom:false}); 
    }

    $scope.$watch('spotMap.geoPositon',function() {
        if ($scope.geoPosition) {
            $scope.lat = $scope.geoPosition.marker.LMarker._latlng.lat;
            $scope.lng = $scope.geoPosition.marker.LMarker._latlng.lng;
        }
    });
    
    $scope.unselectSpot = function () {
        
        $scope.spotMap.closePopup($scope.selectedSpot._id);

        $("#spot-"+$scope.selectedSpot._id).removeClass('spot-selected');
        $scope.toggleSpotMenu($scope.selectedSpot._id);
    	//$scope.selectedSpot.class = '';
    	$scope.selectedSpot = {};
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
       
        $scope.toggleSpotMenu(spotId); 
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
