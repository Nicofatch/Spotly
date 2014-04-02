angular.module('user',[])
.config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('user', {
                url:'/user',
                views: {
                    'navbar': {
                        templateUrl:'/js/app/navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'/js/app/user/user.tpl.html',
                        controller:'UserController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':true
                }
            });
        }
    ]
  )
.controller('UserController', function () {
    console.log('UserController init');
});
