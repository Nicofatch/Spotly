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
    
    // Default search parameters
    $scope.search = {
        k:{
            type:'all',
            value:''
        },
        l:{
            type:'around',
            value:''
        }
    }

    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    }

    $scope.explore = function(){

        //complete search params if needed
        if (!$scope.search.k.type) {
            var k = $scope.search.k;
            if (!k.length) {
                $scope.search.k = {
                    value:'All Sports',
                    type:'all'
                }
            } else {
                $scope.search.k = {
                    value:k,
                    type:'freetext'
                }
            }
        }
        if (!$scope.search.l.type) {
            var l = $scope.search.l;
            if (!l.length) {
                $scope.search.l = {
                    value:'My Location',
                    type:'around'
                }
            } else {
                $scope.search.l = {
                    value:l,
                    type:'freetext'
                }
            }
        }

        $state.go('explore.query',{
            k: $scope.search.k.type == 'all' ? 'all' : $scope.search.k.value,
            l: $scope.search.l.type == 'around' ? 'around' : $scope.search.l.value,
        });
    }
});
