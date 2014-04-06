angular.module('spot.header',[])
//.value('$anchorScroll', angular.noop)
.controller('SpotHeaderController', ['$scope','spotsService','security','$state','$location','localizedMessages',function ($scope,spotsService,security,$state,$location,localizedMessages) {
	function init() {
		console.log('SpotHeaderController - init');
		$scope.url = $location.absUrl();
	}
	init();

	$scope.like = function() {
        $scope.spot.likes.push("Nicolas");
        spotsService.updateSpot($scope.spot);
    };

	$scope.edit = function() {
		if (!$scope.isAuthenticated()) {
			security.showLogin({
					message:localizedMessages.get('login.reason.notAuthenticated')
				},
				function(){
					$state.go('spot.edit');
				}
			);
		} else {
			$state.go('spot.edit');
		}
	};
}])
.controller('SpotHeaderEditController', ['$scope','appSettings',function ($scope,appSettings) {
	function init() {
		console.log('SpotHeaderEditController - init');
	}
	init();

	$scope.updateMarker = function() {
		if (!$scope.spot.address.value) {
			return;
		}
		$.ajax({
			url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?latlng="+$scope.spot.loc[1]+","+$scope.spot.loc[0]+"&sensor=false",
		}).done(function( data ) {
			data = JSON.parse(data);
			var address = data.results[0].formatted_address;
			if (address != $scope.spot.address.value) {
				$.ajax({
	             url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?address="+$scope.spot.address.value+"&sensor=false",
	            }).done(function( data ) {
	                data = JSON.parse(data);
	                $scope.spot.loc[1] = data.results[0].geometry.location.lat;
	                $scope.spot.loc[0] = data.results[0].geometry.location.lng;
	                $scope.$apply();
	            });
			}
		});
	};
}]);

