angular.module('spot.topo',[])
//.value('$anchorScroll', angular.noop)
.controller('TopoController', ['$scope','$state','$sce', 'spotsService', function ($scope, $state, $sce, spotsService) {
  init();
  function init() {
  	console.log('TopoController - init');
  }
  $scope.save = function() {
    // trustAsHtml is necessary to bind the html in a dom element      
    $scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);

    spotsService.updateTopo($scope.topo).then(function(data) {
      // Nothing
    });

    $state.go('spot');
  }

}])
.controller('TopoEditController', function ($scope, $state, $stateParams) {
  init();
  function init() {
  	console.log('TopoEditController - init');
  }
});

