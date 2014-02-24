//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('spot', [
  'spot.comment',
  'spot.topo',
  'spot.data'
])
.config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        /*$urlRouterProvider
          .otherwise('/');*/
        $stateProvider
          .state('spot', {
              url:'/spot/:id',
              views: {
                    'navbar': {
                        templateUrl:'/js/app/navbar/navbar.tpl.html',
                        controller: 'NavbarController'
                    },
                    'main': {
                        templateUrl:'/js/app/spot/spot.tpl.html',
                        controller: 'SpotController'
                    },
                    'spot.topo': {
                        templateUrl:'/js/app/spot/topo/topo.tpl.html',
                        controller: 'TopoController'
                    },
                    'spot.data': {
                        templateUrl:'/js/app/spot/data/data.tpl.html',
                        controller: 'DataController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':true
                }
          })
          .state('spot.comment', {  
              url:'/comment',
              views: {
                'comment.action': {
                  template: ' '
                },
                'comment.form': {
                  templateUrl:'/js/app/spot/comment/comment.edit.tpl.html',
                  controller:'CommentController'
                }
              }
          })
          .state('spot.topo', {  
            url:'/topo',
            views: {
              'topo.action': {
                template: '<a class="btn btn-success" ng-click="save()"><small><i class="fa fa-success"></i></small> Save changes</a>'
              },
              'topo.main': {
                templateUrl:'/js/app/spot/topo/topo.edit.tpl.html',
                controller: 'TopoEditController'
              }
            }
          })
          .state('spot.data', {  
            url:'/data',
            views: {
              'data.action': {
                template: '<a class="btn btn-success" ng-click="save()"><small><i class="fa fa-success"></i></small> Save changes</a>'
              },
              'data.main': {
                templateUrl:'/js/app/spot/data/data.edit.tpl.html',
                controller: 'DataEditController'
              }
            }
          })
      }
    ]
  )
.run(function($templateCache,$http) {
  $http.get('/js/app/spot/comment/comment.tpl.html').success(function(html) {
    $templateCache.put('comment.tpl.html',html);
  });
})
.controller('SpotController', function ($scope, $state, spotsService, utilsService, $stateParams, $sce) {

    $scope.spot = {};
    $scope.comments = [];
    $scope.topo = {};

    init();

    function init() {
        console.log('SpotController - init');
        
        $scope.spot = spotsService.getSpot($stateParams.id).then(function(data){
          $scope.spot = data;
        });

        $scope.comments = spotsService.getComments($stateParams.id).then(function(data){
          $scope.comments = data;
        });

        $scope.topo = spotsService.getTopo($stateParams.id).then(function(data){
          $scope.topo = data;
          // trustAsHtml is necessary to bind the html in a dom element
          $scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);
        });

        $scope.data = spotsService.getData($stateParams.id).then(function(data){
          $scope.data = data;
        });
    }
});
