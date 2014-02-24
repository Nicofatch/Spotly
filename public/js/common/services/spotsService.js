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

  this.getTopo = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/topo'}).then(function(result) {
      return result.data;
    });
  };

  this.getData = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/data'}).then(function(result) {
      return result.data;
    });
  };

  this.updateData = function (data) {
    var dataCopy = jQuery.extend({}, data);
    var data_id = dataCopy._id;
    delete dataCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/datas/'+data_id, data:dataCopy}).then(function(result) {
      //Todo : message d'erreur quand un XHR passe mal. Comment ?
      // return result.data;
    });
  };

  this.updateTopo = function (topo) {
    var topoCopy = jQuery.extend({}, topo);
    var topo_id = topoCopy._id;
    delete topoCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/topos/'+topo_id, data:topoCopy}).then(function(result) {
      //Todo : message d'erreur quand un XHR passe mal. Comment ?
      // return result.data;
    });
  };

  this.insertComment = function(comment) {
    return $http({method: 'POST', url: appSettings.apiServer + appSettings.apiUri + '/comments', data:comment}).then(function(result) {
      return result.data;
    });     
  };
});