var app = angular.module('app', [
  "ui.router",
  "ui.utils",
  "explore",
  "spot",
  "directives.spotList",
  "directives.displaySlider",
  "directives.tagAutocomplete",
  "directives.locAutocomplete",
  "home",
  "navbar"
  ]).run(
    [ '$rootScope', '$state', '$stateParams',
      function ($rootScope, $state, $stateParams) {
          // It's very handy to add references to $state and $stateParams to the $rootScope
          // so that you can access them from any scope within your applications.For example,
          // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
          // to active whenever 'contacts.list' or one of its decendents is active.
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }])
  .config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .value('$anchorScroll', angular.noop)
  .constant('appSettings',{
    apiUri:'/api',
    apiServer: 'http://192.168.137.10:5000'
  }); 

angular.module('app').controller('HeaderCtrl',['$scope','$location', '$state',function($scope,$location,$state){
  $scope.location = $location;
  $scope.isAuthenticated = false;
  $scope.isAdmin = false;
  //$scope.isAuthenticated = security.isAuthenticated;
  //$scope.isAdmin = security.isAdmin;
}]);