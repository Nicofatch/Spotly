angular.module('directives.spotList',[])

.constant('spotListConfig', {

})

.controller('SpotListController', ['$scope', '$attrs', 'spotListConfig', function ($scope, $attrs, spotListConfig) {

  console.log('SpotListController - init');
  
  // This array keeps track of the spots
  this.spots = [];
  this.map = {};

  // Keep reference to user's scope to properly assign `is-selected`
  this.scope = $scope;

  // Ensure that all the spots in this list are unselected
  this.unselectOthers = function(selectedSpot) {
    angular.forEach(this.spots, function (spot) {
      if ( spot !== selectedSpot ) {
        spot.isSelected = false;
      }
    });
  };
  
  // This is called from the spot directive to add itself to the spot list
  this.addSpot = function(spotScope) {
    var that = this;
    this.spots.push(spotScope);

    spotScope.$on('$destroy', function (event) {
      that.removeSpot(spotScope);
    });
  };

  // This is called from the spot directive when to remove itself
  this.removeSpot = function(spot) {
    var index = this.spots.indexOf(spot);
    if ( index !== -1 ) {
      this.spots.splice(this.spots.indexOf(spot), 1);
    }
  };

  // This is called from the map directive to register itself to the spot list controller
  this.addMap = function(mapScope) {
    var that = this;
    this.mapScope = mapScope;
    mapScope.$on('$destroy', function (event) {
      that.removeMap();
    });
  };

  // This is called from the map directive when to remove itself
  this.removeMap = function() {
      this.map = {};
  };

}])

// The spotList directive simply sets up the directive controller
// and adds a CSS class to itself element.
.directive('spotList', function () {
  return {
    restrict:'EA',
    controller:'SpotListController',
    transclude: true,
    replace: false,
    template: '<div class="spots-list-container" ng-transclude></div>'
  };
})

// The spot directive indicates a block of html that will compose a spotList
.directive('spotItem', ['$parse','Marker', function($parse,Marker) {
  return {
    require:'^spotList',         // We need this directive to be inside a spotList
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'/js/common/directives/spotList/spot.tpl.html',
    scope:{ spot:'@', index:'@', last:'@', onLike:'&', isSelected:'@' },        // Create an isolated scope and interpolate the spot attribute onto this scope
    link: function(scope, element, attrs, spotListCtrl) {
      var getIsSelected, setIsSelected;
      
      spotListCtrl.addSpot(scope);
      scope.isSelected = false;
      
      var spotObj;

      if ( attrs.isSelected ) {
        getIsSelected = $parse(attrs.isSelected);
        setIsSelected = getIsSelected.assign;

        spotListCtrl.scope.$watch(getIsSelected, function(value) {
          scope.isSelected = !!value;
        });
      }

      scope.$watch('index', function(value) {
        scope.displayIndex = parseInt(value) + 1;
      });

      scope.$watch('spot', function(value) {
        spotObj = JSON.parse(value);
        scope._id = spotObj._id;
        scope.title = spotObj.title;
        scope.likes = spotObj.likes;
        scope.tags = spotObj.tags;
        scope.description = spotObj.description;
        scope.loc = spotObj.loc;

        // Create a marker
        var marker = new Marker({
          id: scope._id,
          latitude: scope.loc[1],
          longitude: scope.loc[0],
          title: scope.title,
          draggable: false,
          numberedIcon: true,
          index:scope.displayIndex,
          likes: scope.likes.length
        });
        
        // Add the marker to the map
        spotListCtrl.mapScope.spotMap.addMarker(marker);
        if (scope.last === 'true') {
          spotListCtrl.mapScope.spotMap.fitOnBounds();
        }
      });

      scope.$watch('isSelected', function(value) {
        if ( value ) {
          spotListCtrl.unselectOthers(scope);
          spotListCtrl.mapScope.spotMap.focusOnMarker(spotObj._id,{zoom:false});
        }
        if ( setIsSelected ) {
          setIsSelected(spotListCtrl.scope, value);
        }
      });

      scope.$on('$destroy', function (event) {
        spotListCtrl.mapScope.spotMap.removeMarker(scope._id);
      });

      scope.like = function(index) {
        //scope.isSelected=true;
        scope.onLike(index);
      }
    }
  };
}])

.directive('map', ['mapFactory','Marker','utilsService', function(mapFactory,Marker,utilsService){
  return {
      require: '?^spotList',
      restrict: 'E',
      template: '<div id="spotMap"></div>',
      transclude: true,
      replace: true,
      scope: {
        spot: '@',
        mode: '@'
      },
      link: function(scope, element, attrs, spotListCtrl) {
        
        if (typeof spotListCtrl !== "undefined")
          spotListCtrl.addMap(scope);

        scope.$watch('spot',function(value){
          if (!value || (value == "{}"))
            return;
          spot = JSON.parse(value);
          // if a "scope" attr is filled, display a single spot at the center of the map
          scope.spotMap = new mapFactory('spotMap',{
            onLocationFound:onLocationFound,
            onLocationError:onLocationError,
            onPopupOpen:onPopupOpen,
            padding:[0,0,0,0]
          });
          // Add spot marker
          var marker = new Marker({
            id: spot._id,
            latitude: spot.loc[1],
            longitude: spot.loc[0],
            //title: spot.title,
            draggable: false
          });

          // Add the marker to the map
          scope.spotMap.addMarker(marker);
          scope.spotMap.map.setView([spot.loc[1],spot.loc[0]], 13);
        });

        scope.$watch('mode',function(mode){
          if (mode === "explore") {
            scope.spotMap = new mapFactory('spotMap',{
                  onLocationFound:onLocationFound,
                  onLocationError:onLocationError,
                  onPopupOpen:onPopupOpen,
                  padding:[480,150,150,150]
            });
            scope.spotMap.map.setView([48.51, 2.21], 3);
            /*console.log('try to locate...');
            scope.spotMap.map.locate({
                setView: true,
                maxZoom: 18
            });*/
          }
        });

        function onLocationFound(e) {
          var radius = e.accuracy / 2;
          var message = "You are within " + radius + " meters from this point";

          // Create a new marker
          var marker = new Marker({
              id: 'geoPosition',
              latitude: e.latlng.lat,
              longitude: e.latlng.lng,
              title: message,
              draggable: true,
              awesomeIcon: 'icon-screenshot icon-large',
              color: 'red',
              index: '0'
          });

          // Display the marker
          scope.spotMap.map.addLayer(marker.LMarker);

          // store the marker
          scope.spotMap.geoPosition.marker = marker;
        }

        function onLocationError(e) {
            //TODO
        }


        // Triggered when a spot has been selected, by clicking on left bar or directly on marker
        function onPopupOpen(e) {
          var spotId = e.popup._source.options.id;

          // Select associated spot
          for(var i=0,l=spotListCtrl.spots.length; i<l;i++) {
            if ( spotListCtrl.spots[i]._id === spotId ) {
              if (!spotListCtrl.spots[i].isSelected) {
                spotListCtrl.spots[i].isSelected = true;
                // Apply modification to all spots scopes
                spotListCtrl.scope.$digest();
              }
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
        }

        
      }
  }
}])

.factory('mapFactory',['Marker','utilsService',function(Marker,utilsService) {

  return function (map_id,options) {

    this.map_id = map_id;
      // Create the map
      this.map = L.map(this.map_id, {scrollWheelZoom : false, zoomControl : false});
      
      var zoomControl = new L.Control.Zoom({position:'topright'});
      zoomControl.addTo(this.map);
      
      this.markers = new utilsService.HashTable();
      this.bounds = [];
      this.geoPosition = {};

      // Set the legend
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {
              maxZoom: 18,
              attribution: osmAttrib,
              timeout: 3000000
          });
      osm.addTo(this.map);

      if (options.onLocationError) {
          this.map.on('locationerror', options.onLocationError);        
      }
      if (options.onLocationFound) {
          this.map.on('locationfound', options.onLocationFound);        
      }
      if (options.onPopupOpen) {
          this.map.on('popupopen', options.onPopupOpen);        
      }
      if (options.padding) {
        this.padding = options.padding;
      } else {
        this.padding = [480,150,150,150];
      }

      // this.map.setView([48.51, 2.21], 3);
      // Get geolocation and center the map
      // this.geoLocate();

      this.geoLocate = function () {
          //TODO: cache the location
          this.map.locate({
              setView: true,
              maxZoom: 18
          });
      };

      this.centerOnGeoPosition = function () {
          /*this.map.fitBounds([this.geoPosition.marker.LMarker._latlng], {
              paddingTopLeft: [($(window).width()/4), 90],
              paddingBottomRight: [50,50],
              zoom:true
          });*/
          
          this.map.panTo([this.geoPosition.marker.LMarker._latlng.lat, this.geoPosition.marker.LMarker._latlng.lng]);
      };

      this.moveGeoMarker = function (latlng) {
          this.geoPosition.marker.LMarker._latlng.lat = latlng.lat;
          this.geoPosition.marker.LMarker._latlng.lng = latlng.lng;
          this.geoPosition.marker.LMarker.update();
          this.centerOnGeoPosition();
      }

      this.removeGeoMarker = function () {
          // Remove the marker
          this.map.removeLayer(this.geoPosition.marker.LMarker);
          // Clean the object
          this.geoPosition = {};
      };

      this.fitOnBounds = function (mode) {
          // Center the map on the displayed markers
          if (this.bounds.length)
              this.map.fitBounds(this.bounds, {
                  paddingTopLeft: [this.padding[0], this.padding[1]],
                  paddingBottomRight: [this.padding[2],this.padding[3]]
              });
      };

      this.focusOnMarker = function (id) {
                      
          var LMarker = this.markers.getItem(id).LMarker;
          // Pan the map to the marker (smooth move)
          // this.map.setView(LMarker._latlng, 13);
          // if (this.bounds.length)
          //   this.map.fitBounds(this.bounds, {
          //     paddingTopLeft: [this.padding[0], this.padding[1]],
          //     paddingBottomRight: [this.padding[2],this.padding[3]]
          // });
          // Open the popup
          LMarker.openPopup();
      };

      this.closePopup = function (id) {
          if (id) {
              var LMarker = this.markers.getItem(id).LMarker;
              LMarker.closePopup();
          }   
      }

      this.displayMap = function (position) {
          if (typeof position === "undefined") {
              //If no position is specified, load geoCoords
              this.map.setView([this.geoPosition.coords.latitude, this.geoPosition.coords.longitude], 10);
          } else {
              this.map.setView([position.coords.latitude, position.coords.longitude], 10);
          }
      };

      this.addMarker = function (marker) {
          var oldMarker = this.markers.getItem(marker.id);
          if (typeof oldMarker === "undefined") {

              // Display the marker
              //marker.LMarker.addTo(this.map);
              this.map.addLayer(marker.LMarker);

              // if specified, display the label in a popup
              //if (typeof marker.label != "undefined") {
              //  marker.LMarker.bindPopup(marker.label);
              //}

              // Update markers hashtable
              this.markers.setItem(marker.id, marker);

              // update the map bounds
              this.bounds.push(marker.LMarker._latlng);
          }
          /*else {
        // Marker already exists
        if ((oldMarker.longitude != marker.longitude) || (oldMarker.latitude != marker.latitude)) {
      console.log('existe deja');
      // Move the existing marker
      var lat = (marker.latitude);
      var lng = (marker.longitude);
      var newLatLng = new L.LatLng(lat, lng);
      oldMarker.LMarker.setLatLng(newLatLng); 

      // Store the new marker
      this.markers.setItem(_marker.id, marker);
        }
    }*/
      };

      this.clear = function (options) {
          //console.log(this.map);
          // Loop on all markers
          for (var k in this.markers.items) {
              if (this.markers.hasItem(k)) {
                  this.map.removeLayer(this.markers.items[k].LMarker);
                  this.markers.removeItem(k);
              }
          }
          // Reset the map bounds, used to adjust the view
          this.bounds = [];
      };

      this.removeMarker = function (id) {
          var marker = this.markers.getItem(id);
          var boundsIndex = this.bounds.indexOf(marker.LMarker._latlng);
          this.map.removeLayer(marker.LMarker);
          this.markers.removeItem(id);
          this.bounds.splice(boundsIndex,1);
          //TODO : 
      }

  }
    
}])

.factory('Marker',function() {

  return function(options) {
      var LMarkerOptions = {};
      this.id = options.id;
      // if marker is draggable
      if (options.draggable)
          LMarkerOptions.draggable = true;

      if (options.id)
          LMarkerOptions.id = options.id;

      // if a special icon has been specified
      if (options.awesomeIcon && options.color) {
          var awesomeIcon = L.AwesomeMarkers.icon({
              icon: options.awesomeIcon,
              color: options.color
          })
          LMarkerOptions.icon = awesomeIcon;
      }
      // if a special icon has been specified
      if (options.numberedIcon) {
          numberedIcon = new L.NumberedDivIcon({number: options.index})
          LMarkerOptions.icon = numberedIcon;
      }
      this.latitude = options.latitude;
      this.longitude = options.longitude;

      // Create Leaflet marker
      this.LMarker = L.marker([this.latitude, this.longitude], LMarkerOptions);

      if (options.title) {
        var html= '<div class="row" style="width:400px"> <div class="spot-infos col-lg-12" > <span class="spot-icon-container"> <button class="btn btn-default btn-select" ng-click="selectSpot('+
          options.id+')"><span style="font-size:1.2em;"><b>'+(options.index)+'</b></span></button> </span> <div class="spot-info-container"> <h4 class="list-group-item-heading"> <div class="pull-right"> <div class="btn-group"> <button class="btn btn-default"><span style="font-size:1em;"><i class="icon-comments"></i></span></button> <button class="btn btn-default" disabled style="padding-left:3px;padding-right:3px;"><span style="font-size:1em;"><b>12</b></span></button> </div> <div class="btn-group"> <button class="btn btn-default" ng-click="like('+
          (options.index)+');$event.stopPropagation()"><span style="font-size:1em;"><i class="icon-heart"></i></span></button> <button class="btn btn-default" disabled style="padding-left:3px;padding-right:3px;"><span style="font-size:1em;"><b>'+
        options.likes+'</b></span></button> </div> </div> <a href="#/spot/'+options.id+'" role="spot-title"><b>'+options.title+'</b></a></br> <div id="map-tags-container"> <span id="map-tags"> <span style="display:inline-block"><small>Randonnée</small> </span> </span> </div> </h4> </div></div></div><div class="panel-default" style="margin-bottom:-14px;margin-left:-20px;margin-right:-20px;"> <div class="panel-heading" style="border:0">'+
        '<button class="btn btn-default" ng-click=""><i class="icon-edit icon-large"></i></button>'+
        '<button class="btn btn-default" ng-click=""><i class="icon-info icon-large"></i></button>'+
        '<button class="btn btn-default" ng-click=""><i class="icon-camera icon-large"></i></button>'+
        '<button class="btn btn-default" ng-click=""><i class="icon-link icon-large"></i></button>'
        '</div>';
        this.LMarker.bindPopup(html,{'minWidth':'400px'});
      }
  }
});

L.NumberedDivIcon = L.Icon.extend({
    options: {
      // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
      iconUrl: 'img/leaflet/marker-icon.png',
      number: '',
      shadowUrl: null,
      iconSize: new L.Point(25, 41),
      iconAnchor: new L.Point(13, 41),
      popupAnchor: new L.Point(0, -33),
      /*
      iconAnchor: (Point)
      popupAnchor: (Point)
      */
      className: 'leaflet-div-numbered-icon'
    },
   
    createIcon: function () {
      var div = document.createElement('div');
      var img = this._createImg(this.options['iconUrl']);
      var numdiv = document.createElement('div');
      numdiv.setAttribute ( "class", "number" );
      numdiv.innerHTML = this.options['number'] || '';
      div.appendChild ( img );
      div.appendChild ( numdiv );
      this._setIconStyles(div, 'icon');
      return div;
    },
   
    //you could change this to add a shadow like in the normal marker if you really wanted
    createShadow: function () {
      return null;
    }
  });