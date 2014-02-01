app.service('mapService', function ($http) {

  this.getMaps = function() {
    return $http({method: 'GET', url: 'http://192.168.137.10:5000/API/maps'}).then(function(result) {
      return result.data;
    });
  };

  this.getMap = function (id) {
    return $http({method: 'GET', url: 'http://192.168.137.10:5000/API/maps/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.deleteMap = function (id) {
    return $http({method: 'DELETE', url: 'http://192.168.137.10:5000/API/maps/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.updateMap = function (map) {
    var map_id = map._id;
    delete map._id;
    return $http({method: 'PUT', url: 'http://192.168.137.10:5000/API/maps/'+map_id, data:map}).then(function(result) {
           return result.data;
    });
  };

  this.insertMap = function (options) {
    var map = {
      title: options.title ,
      description: options.description ,
      tags: options.tags || [],
      spots: options.spots || [],
      contributors_count: options.contributors_count || '1',
      markers_count: options.markers_count || '0',
      private:options.private || false
    };
    return $http({method: 'POST', url: 'http://192.168.137.10:5000/API/maps', data:map}).then(function(result) {
           return result.data;
    });
  };

});