angular.module('activity',[]).
config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('activity', {
                url:'/activity',
                views: {
                    'navbar': {
                        templateUrl:'navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'activity/activity.tpl.html',
                        controller:'ActivityController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':true
                }
            });
        }
    ]
).
controller('ActivityController', ['$log',function ($log) {
    $log('ActivityController init');
}]);
