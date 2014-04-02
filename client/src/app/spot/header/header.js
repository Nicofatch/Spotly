angular.module('spot.header',[])
//.value('$anchorScroll', angular.noop)
.controller('SpotHeaderController', function () {
	function init() {
		console.log('SpotHeaderController - init');
	}
	init();

})
.controller('SpotHeaderEditController', ['$scope','appSettings',function ($scope,appSettings) {
	function init() {
		console.log('SpotHeaderEditController - init');
	}
	init();

	$scope.updateMarker = function() {
		if ($scope.spot.address.value) {
			$.ajax({
             url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?address="+$scope.spot.address.value+"&sensor=false",
            }).done(function( data ) {
                data = JSON.parse(data);
                $scope.spot.loc[1] = data.results[0].geometry.location.lat;
                $scope.spot.loc[0] = data.results[0].geometry.location.lng;
                $scope.$apply();
            });
		}
	};

}]);

