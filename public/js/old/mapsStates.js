// Make sure to include the `ui.router` module as a dependency.
angular.module('app')
  .config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');

        $stateProvider
          .state('maps', {
              url:'/',
              templateUrl:'/js/partials/maps.html',
              controller: 'MapsController'
          })
          .state('maps.new', {  
              url: 'new',
              views: {
                // So this one is targeting the unnamed view within the parent state's template.
                'newMapButton': {
                  template: ''
                },
                'newMapForm': {
                  templateUrl:'/js/partials/newMapForm.html',
                  controller: 'NewMapController'
                }
              }
          })
          .state('map', {
              url:'/:mapId',
              templateUrl:'/js/partials/fullMap.html',
              controller: 'MapController'
          })
          .state('map.info', {
              url: '/info',
              views: {
                'main': {
                  templateUrl: '/js/partials/mapInfo.html'
                }
              }              
          })
          .state('map.new', {
              url: '/new',
              views: {
                'newSpot': {
                  templateUrl: '/js/partials/newSpotForm.html',
                  controller: 'NewSpotController'
                }
              }              
          })
          .state('map.tags', {
              url: '/tags',
              views: {
                // So this one is targeting the unnamed view within the parent state's template.
                'newTags': {
                  templateUrl: '/js/partials/newTagsForm.html',
                  controller: 'NewTagsController'
                }
              }
          });

      }
    ]
  );


