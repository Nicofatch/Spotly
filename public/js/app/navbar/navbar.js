//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('navbar',['security','services.httpRequestTracker'])

.controller('NavbarController', function ($scope, appSettings, $rootScope, $state, $stateParams, $location, security, httpRequestTracker) {
   
    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    }

    function init() {
        console.log('NavbarController - init');
                
        $scope.search = $state.current.data.search;
        $scope.fixed = $state.current.data.fixed;

        // Get and store in scope authentication parameters
        $rootScope.isAuthenticated = security.isAuthenticated;
        $rootScope.isAdmin = security.isAdmin;

        // Init search parameters
        $rootScope.k = {
                type:'all',
                value:''
            }
        $rootScope.l ={
                type:'around',
                value:''
            }
         // Get search parameters and store them in rootscope so that the navbar can access them    
        if ($state.params.k == 'all') {
            $rootScope.k.value = 'All Sports';
            $rootScope.k.type = 'all';    
        } else {
            $rootScope.k.value = $state.params.k;
            $rootScope.l.type = 'tag';    
        }
        if ($state.params.l == 'around') {
            $rootScope.l.value = 'My Location';
            $rootScope.l.type = 'around';    
        } else {
            $rootScope.l.value = $state.params.l;
            $rootScope.l.type = 'address';    
        }
    }

    $scope.$watch('$state.params',function(){
        init();
    });

    $scope.hasPendingRequests = function () {
        return httpRequestTracker.hasPendingRequests();
    };
})

.controller('ExploreFormController', function ($scope, $rootScope, $state) {

    $scope.explore = function(){
        //complete search params if need
        if (!$scope.k.type) {
            var k = $scope.k;
            if (!k.length) {
                $scope.k = {
                    value:'All Sports',
                    type:'all'
                }
            } else {
                $scope.k = {
                    value:k,
                    type:'freetext'
                }
            }
        }

        if (!$scope.l.type) {
            var l = $scope.l;
            if (!l.length) {
                $scope.l = {
                    value:'My Location',
                    type:'around'
                }
            } else {
                $scope.l = {
                    value:l,
                    type:'freetext'
                }
            }
        }

        $state.go('explore.query',{
            k: $scope.k.type == 'all' ? 'all' : $scope.k.value,
            l: $scope.l.type == 'around' ? 'around' : $scope.l.value,
        });
    }
});
