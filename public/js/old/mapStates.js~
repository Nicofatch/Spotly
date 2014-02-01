// Make sure to include the `ui.router` module as a dependency.
angular.module('app')
  .config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/map');

        $stateProvider
      	  .state('home', {
      	      url:'/',
      	      template:''
      	  })
          .state('map', {
            abstract:true,
            url: '/map',
            templateUrl: 'app/partials/Map.html',
	          controller: 'MapController'
          })
          .state('map.spots', {
            url: '',
            templateUrl: 'app/partials/SpotsList.html'
          })
	        .state('map.spots.new', {
	          url: '/new',
	          templateUrl:'app/partials/SpotNewForm.html',
            controller: 'MapController'
	        })
          .state('maps', {
            url: '/maps',
            templateUrl: 'app/partials/Maps.html',
            controller: 'MapsController'
          })
      }
    ]
  );


