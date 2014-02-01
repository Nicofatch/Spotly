app.service('spotsService', function ($http,appSettings) {

  this.getSpot = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.searchSpots = function(options) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+options.k+'/'+options.lng+'/'+options.lat}).then(function(result) {
      return result.data;
    });
  };

  this.updateSpot = function (spot) {
    var spotCopy = jQuery.extend({}, spot);
    var spot_id = spotCopy._id;
    delete spotCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+spot_id, data:spotCopy}).then(function(result) {
      return result.data;
    });
  };

  this.getComments = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/comments'}).then(function(result) {
      return result.data;
    });
  };

  this.insertComment = function(comment) {
    return $http({method: 'POST', url: appSettings.apiServer + appSettings.apiUri + '/comments', data:comment}).then(function(result) {
      return result.data;
    });     
  };
});