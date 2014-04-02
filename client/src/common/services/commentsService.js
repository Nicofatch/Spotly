app.service('commentsService', ['$http','appSettings',function ($http,appSettings) {

  this.getComment = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comment/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.getComments = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comments/'+id}).then(function(result) {
      return result.data;
    });
  };

  
}]);