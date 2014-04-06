angular.module('spot.topo',[])
//.value('$anchorScroll', angular.noop)
.controller('TopoController', ['spotsService','$scope','$sce',function (spotsService,$scope,$sce) {
	function init() {
		console.log('TopoController - init');
		$scope.topo = spotsService.getTopo($scope.id).then(function(data){
			$scope.topo = data;
			// trustAsHtml is necessary to bind the html in a dom element
			$scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);
		});
	}
	init();

	$scope.$on('save',function(){
		// trustAsHtml is necessary to bind the html in a dom element      
		$scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);

		spotsService.updateTopo($scope.topo).then(function(data) {
			// Nothing
		});
	});
}]);

