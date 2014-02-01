//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('home',[])
.config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('home', {
                url:'/',
                views: {
                    'navbar': {
                        templateUrl:'/js/app/navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'/js/app/home/home.tpl.html',
                        controller:'HomeController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':false
                }
            })
        }
    ]
  )
.controller('HomeController', function ($scope, $state, $location, appSettings,$timeout) {
    console.log('HomeController init');
    
    $scope.search = {
        k:'',
        l:''
    }

    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    }

    $scope.explore = function(){
        $state.go('explore.query',{
            k:$scope.search.k,
            address:$scope.search.l.address,
            lat:$scope.search.l.lat,
            lng:$scope.search.l.lng
        });
    }
});
