//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('spot', [
	'spot.comment',
	'spot.topo',
	'spot.data',
	'spot.header'
	])
.config(
	[ '$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {   
				/*$urlRouterProvider
				.otherwise('/');*/
				$stateProvider
				.state('spot', {
					url:'/spot/:id',
					views: {
						'navbar': {
							templateUrl:'navbar/navbar.tpl.html',
							controller: 'NavbarController'
						},
						'main': {
							templateUrl:'spot/spot.tpl.html',
							controller: 'SpotController'
						}
					},
					data: {
						'fixed':false,
						'search':true
					}
				})
				.state('spot.edit', {  
					url:'/edit',
					views: {
						'spot.header': {
							templateUrl:'spot/header/header.edit.tpl.html',
							controller: 'SpotHeaderEditController'
						},
						'spot.edit.toolbar': {
							templateUrl:'spot/spot.edit.tpl.html',
							controller: 'SpotEditController' 
						},
						'spot.topo': {
							templateUrl:'spot/topo/topo.edit.tpl.html'
						},
						'spot.data': {
							templateUrl:'spot/data/data.edit.tpl.html'
						}
					}
				})
				.state('spot.comment', {  
					url:'/comment',
					views: {
						'comment.action': {
							template: ' '
						},
						'comment.form': {
							templateUrl:'spot/comment/comment.edit.tpl.html',
							controller:'CommentController'
						}
					}
				});
			}
			]
			)
// .run(function($templateCache,$http) {
//   $http.get('spot/comment/comment.tpl.html').success(function(html) {
//     $templateCache.put('comment.tpl.html',html);
//   });
// })
.controller('SpotController', 
	[ '$scope', 
	'spotsService',
	'$stateParams',
	'$location',
	'$anchorScroll',
	'$state',
	'appSettings',
	function ($scope, spotsService, $stateParams, $location, $anchorScroll, $state,appSettings) {

		$scope.id = $stateParams.id;

		$scope.spot = {};
		$scope.comments = [];
		$scope.topo = {};

		// Used for page layout modification depending on current page mode (edit or not)
		$scope.editMode = false;

		$scope.rate = 5;
		$scope.max = 5;
		$scope.isReadonly = false;

		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		$scope.ratingStates = [
		{stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
		{stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
		{stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
		{stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'},
		{stateOn: 'fa fa-star', stateOff: 'fa fa-star-o'}
		];

		function init() {
			console.log('SpotController - init');

			$scope.spot = spotsService.getSpot($scope.id).then(function(data){
				$scope.spot = data;
			});

			$scope.comments = spotsService.getComments($scope.id).then(function(data){
				$scope.comments = data;
			});
		}

		init();

		$scope.scrollToStories = function(){
			$location.hash('stories');
			$anchorScroll();
		};

		$scope.$on('$stateChangeSuccess', function() {
			if ($state.current.name === "spot.edit") {
				$scope.editMode = true;
			} else {
				$scope.editMode = false;
			}
		});

		$scope.mapMode = function() {
			return $scope.editMode ? 'edit' : 'view';
		};

		$scope.updateAddress = function(loc) {
			//TODO: would have been better using ngModel in the directive, but doesn't seem possible due to the existence of an existing controller SpotListController
			$scope.spot.loc = loc;
			
			if ($scope.spot.loc) {
				$.ajax({
					url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?latlng="+$scope.spot.loc[1]+","+$scope.spot.loc[0]+"&sensor=false",
				}).done(function( data ) {
					data = JSON.parse(data);
					$scope.spot.address = {
						value:data.results[0].formatted_address,
						type:'address'
					};
					$scope.$apply();
				});
			}
		};		
	}])
.controller('SpotEditController', 
	[ '$scope', 
	'spotsService',
	'$stateParams',
	'$sce',
	'$location',
	'$anchorScroll',
	'$state',
	'security',
	'$rootScope',
	function ($scope, spotsService, $stateParams, $sce, $location, $anchorScroll, $state, security,$rootScope) {
		function init() {
			if (!$scope.isAuthenticated()) {
				$state.go('spot');
				security.showLogin({
						message:'petit chat'
					},
					function(){
						$state.go('spot.edit');
					}
				);
			}
		}

		init();

		$scope.save = function() {
			
			$rootScope.$broadcast('save');

			spotsService.updateSpot($scope.spot).then(function(data) {
				// Nothing
			});

			$state.go('spot');
		};
	}
]);
