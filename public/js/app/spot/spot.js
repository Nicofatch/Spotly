//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('spot', ['angularFileUpload'])
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
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'/js/app/spot/spot.tpl.html',
                        controller: 'SpotController',
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
                'newCommentButton': {
                  template: ''
                },
                'newCommentForm': {
                  templateUrl:'/js/app/spot/comment/newCommentForm.tpl.html',
                  controller: 'CommentController'
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
.controller('SpotController', function ($scope, $state, spotsService, utilsService, $stateParams) {

    $scope.spot = {};
    $scope.comments = [];

    init();

    function init() {
        console.log('SpotController - init');
        
        $scope.spot = spotsService.getSpot($stateParams.id).then(function(data){
          $scope.spot = data;
        });

        $scope.comments = spotsService.getComments($stateParams.id).then(function(data){
          $scope.comments = data;
        });
    }
});
