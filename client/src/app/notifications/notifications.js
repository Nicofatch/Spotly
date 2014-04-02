//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('notifications',[])

.controller('NotificationsController', ['$scope','i18nNotifications',function ($scope, i18nNotifications) {
	function init(){
		console.log('NotificationsController - init');
		$scope.notifications = i18nNotifications;

		$scope.removeNotification = function (notification) {
			i18nNotifications.remove(notification);
		};

		$scope.$on('$locationChangeError', function(event, current, previous, rejection){
			i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, {rejection: rejection});
		});
	}
	init();
}]);
