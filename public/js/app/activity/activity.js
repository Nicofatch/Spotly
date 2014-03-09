angular.module('activity',[])
.config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('activity', {
                url:'/activity',
                views: {
                    'navbar': {
                        templateUrl:'/js/app/navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'/js/app/activity/activity.tpl.html',
                        controller:'ActivityController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':true
                }
            })
        }
    ]
  )
.controller('ActivityController', function ($scope, appSettings, $log) {
    $log('ActivityController init');
    
});
