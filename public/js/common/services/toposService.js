app.service('commentsService', function ($http,appSettings) {

  this.getTopo = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comment/'+id}).then(function(result) {
      return result.data;
    });
  };

  /*this.getComments = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comments/'+id}).then(function(result) {
      return result.data;
    });
  };*/

  
});