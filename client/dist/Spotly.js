/*! Spotly - v0.0.1 - 2014-08-16
 * Copyright (c) 2014 Nicolas Sorre;
 */
angular.module('activity',[]).
config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('activity', {
                url:'/activity',
                views: {
                    'navbar': {
                        templateUrl:'navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'activity/activity.tpl.html',
                        controller:'ActivityController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':true
                }
            });
        }
    ]
).
controller('ActivityController', ['$log',function ($log) {
    $log('ActivityController init');
}]);

// TODO: reorganize modules
var app = angular.module('app', [
  'ui.router',
  'ui.utils',
  'explore',
  'spot',
  'directives.spotList',
  'directives.displaySlider',
  'directives.input',
  'home',
  'navbar',
  'services.httpRequestTracker',
  'security',
  'activity',
  'user',
  'services.i18nNotifications',
  'notifications',
  'I18N',
  'templates.app',
  'templates.common'
  ]).run(
    [ '$rootScope', '$state', '$stateParams','security',
      function ($rootScope, $state, $stateParams, security) {
          // It's very handy to add references to $state and $stateParams to the $rootScope
          // so that you can access them from any scope within your applications.For example,
          // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
          // to active whenever 'contacts.list' or one of its decendents is active.
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          
          //Get and store current user info
          security.requestCurrentUser();
          $rootScope.$watch(function() {
            return security.currentUser;
          }, function(currentUser) {
            $rootScope.currentUser = currentUser;
          });
          
      }])
  .config(['$httpProvider',function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }])
  //.value('$anchorScroll', angular.noop)
  .constant('appSettings',{
    apiUri:'/api',
    apiServer: 'http://192.168.1.15:8080'
  });

angular.module('app').controller('HeaderCtrl',['$scope','$location',function($scope,$location){
  $scope.location = $location;
  $scope.isAuthenticated = false;
  $scope.isAdmin = false;
  //$scope.isAuthenticated = security.isAuthenticated;
  //$scope.isAdmin = security.isAdmin;
}]);

//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('explore',['ui.bootstrap'])
.config(
    [ '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {   
            $stateProvider
            .state('explore', {
                url:'/explore',
                views: {
                    'navbar': {
                        templateUrl:'navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'explore/explore.tpl.html',
                        controller: 'ExploreController'
                    }
                },
                data: {
                    'fixed':true,
                    'search':true
                }
            })
            .state('explore.query', {
                url:'/:k/:l',
            });
        }
    ]
).controller('ExploreController', ['$scope', '$rootScope', 'spotsService', 'appSettings', function ($scope, $rootScope, spotsService, appSettings) {

    function init() {
        console.log('ExploreController - init');

        $scope.spots = {};
        
        // Run search query
        if ($scope.l.type === 'around') {
            getCurrentLocation(function(location){
                spotsService.searchSpots({k:$scope.k.value,lat:location.coords.latitude,lng:location.coords.longitude}).then(function(data){
                    $scope.spots = data;
                });
            });
        } else {
            $.ajax({
             url: appSettings.apiServer + appSettings.apiUri + "/geocode/json?address="+$scope.l.value+"&sensor=false",
            }).done(function( data ) {
                data = JSON.parse(data);
                $rootScope.l.value = data.results[0].formatted_address;
                spotsService.searchSpots({k:$scope.k.value,lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng}).then(function(data){
                    $scope.spots = data;
                });
            });
        }
    }

    $scope.$watch('$state.params',function(){
        init();
    });

    function getCurrentLocation(onLocationFound) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onLocationFound);
        }
    }

}]);

//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('home',[])
.config(
    [ '$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {   
        $urlRouterProvider
          .otherwise('/');
        $stateProvider
            .state('home', {
                url:'/',
                views: {
                    'navbar': {
                        templateUrl:'navbar/navbar.tpl.html',
                        controller: 'NavbarController',
                    },
                    'main': {
                        templateUrl:'home/home.tpl.html',
                        controller:'HomeController'
                    }
                },
                data: {
                    'fixed':false,
                    'search':false
                }
            });
        }
    ]
  )
.controller('HomeController', ['$scope','$state','appSettings', function ($scope, $state, appSettings) {
    console.log('HomeController init');
    
    // Default search parameters
    $scope.search = {
        k:{
            type:'all',
            value:''
        },
        l:{
            type:'around',
            value:''
        }
    };

    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    };

    $scope.explore = function(){

        //complete search params if needed
        if (!$scope.search.k.type) {
            var k = $scope.search.k;
            if (!k.length) {
                $scope.search.k = {
                    value:'All Sports',
                    type:'all'
                };
            } else {
                $scope.search.k = {
                    value:k,
                    type:'freetext'
                };
            }
        }
        if (!$scope.search.l.type) {
            var l = $scope.search.l;
            if (!l.length) {
                $scope.search.l = {
                    value:'My Location',
                    type:'around'
                };
            } else {
                $scope.search.l = {
                    value:l,
                    type:'freetext'
                };
            }
        }

        $state.go('explore.query',{
            k: $scope.search.k.type === 'all' ? 'all' : $scope.search.k.value,
            l: $scope.search.l.type === 'around' ? 'around' : $scope.search.l.value,
        });
    };
}]);

//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('navbar',['security','services.httpRequestTracker'])

.controller('NavbarController', ['$scope', 'appSettings', '$rootScope', '$state', 'security', 'httpRequestTracker',function ($scope, appSettings, $rootScope, $state, security, httpRequestTracker) {
   
    $scope.tagsAutocompleteOptions = {
        serviceUrl: appSettings.apiServer + appSettings.apiUri + '/tags/search/',
    };

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
        };
        $rootScope.l ={
            type:'around',
            value:''
        };
         // Get search parameters and store them in rootscope so that the navbar can access them    
        if (!$state.params.k || $state.params.k === 'all') {
            $rootScope.k.value = 'All Sports';
            $rootScope.k.type = 'all';    
        } else {
            $rootScope.k.value = $state.params.k;
            $rootScope.l.type = 'tag';    
        }
        if (!$state.params.l || $state.params.l === 'around') {
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
}])
.controller('ExploreFormController', ['$scope','$state', function ($scope, $state) {

    $scope.explore = function(){
        //complete search params if need
        if (!$scope.k.type) {
            var k = $scope.k;
            if (!k.length) {
                $scope.k = {
                    value:'All Sports',
                    type:'all'
                };
            } else {
                $scope.k = {
                    value:k,
                    type:'freetext'
                };
            }
        }
        
        if (!$scope.l.type) {
            var l = $scope.l;
            if (!l.length) {
                $scope.l = {
                    value:'My Location',
                    type:'around'
                };
            } else {
                $scope.l = {
                    value:l,
                    type:'freetext'
                };
            }
        }

        $state.go('explore.query',{
            k: $scope.k.type === 'all' ? 'all' : $scope.k.value,
            l: $scope.l.type === 'around' ? 'around' : $scope.l.value,
        });
    };
}]);

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

//This controller retrieves data from the mapService and associates it with the $scope
//The $scope is ultimately bound to the map view
angular.module('spot.comment',[
	'angularFileUpload'])
.controller('CommentController', ['$scope', '$state', 'spotsService', '$upload', 'appSettings',function ($scope, $state, spotsService, $upload, appSettings) {

	$scope.uploads=[];
	/*$scope.comment={
		pictures:[]
	};*/
	
	function init() {
		console.log('CommentController - init');
	}

	init();

	$scope.insertComment = function () {

		var newComment = {
			'title': $scope.comment.title,
			'body': $scope.comment.body,
			'pictures':$scope.comment.pictures || [],
			'spot_id':$scope.spot._id,  
			'author_id':$scope.currentUser._id
		};
		
		spotsService.insertComment(newComment).then(function(data) {
				// Nothing
		});

		$scope.comments.push(newComment);

			// Redirect to parent (map)
			$state.go('spot');
		};

		$scope.atLeastOnePicture = function() {
			if ($scope.comment.title) {
				return ($scope.comment.pictures.length > 0);
			}
			else {
				return false;
			}
		};

		$scope.onFileSelect = function($files) {
			//$files: an array of files selected, each file has name, size, and type.
			$scope.selectedFiles=$files;
			var startingIndex = $scope.uploads.length;
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				$scope.start(i + startingIndex, file);
				//.error(...)
				//.then(success, error, progress); 
			}
		};

		$scope.start = function(index, file) {
			//console.log(index);
			//console.log($scope.progress);
			$scope.uploads[index] = $upload.upload({
				url: appSettings.apiServer + appSettings.apiUri + "/pictures",
				method: 'POST',
					// headers: {'headerKey': 'headerValue'}, withCredential: true,
					data: {},
					file: file,
					//file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
					/* set file formData name for 'Content-Desposition' header. Default: 'file' */
					//fileFormDataName: myFile,
					/* customize how data is added to formData. See #40#issuecomment-28612000 for example */
					//formDataAppender: function(formData, key, val){} 
				}).progress(function(evt) {
					$scope.uploads[index].progress = parseInt(100.0 * evt.loaded / evt.total);
					$scope.$digest();
				}).success(function(data, status, headers, config) {
					//file is uploaded successfully
					if (!$scope.comment.pictures) {
						$scope.comment.pictures = [];
					}
					$scope.comment.pictures.push({url:data});
				});
				$scope.uploads[index].name = file.name;
			};

			$scope.enableAddStory = function() {
				if (!$scope.comment) {
					return false;
				}
				if (!$scope.comment.body || !$scope.comment.title) {
					return false;
				}
				for (var i = 0; i < $scope.uploads.length; i++) {
					console.log($scope.uploads[i].progress);
					if ($scope.uploads[i].progress < 100) {
						return false;
					}
				}
				return true;  
			};
		}
		]
		);

angular.module('spot.data',['ui.bootstrap.rating'])
//.value('$anchorScroll', angular.noop)
.controller('DataController', ['$scope', '$state', 'spotsService','i18nNotifications',function ($scope, $state, spotsService,i18nNotifications) {

	$scope.rate = 5;
	$scope.max = 5;
	$scope.isReadonly = false;

	$scope.data = spotsService.getData($scope.id).then(function(data){
		$scope.data = data;
	});

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

	$scope.addData = function() {
		var newData = {
			key: '',
			value: '',
			type: 'km'
		};
		$scope.data.table.push(newData);
	};

	$scope.changeType = function(index,type) {
		$scope.data.table[index].type = type;
	};

	$scope.removeData = function(index) {
		$scope.data.table.splice(index,1);
	};

	$scope.$on('save',function(){
		spotsService.updateData($scope.data).then(function(data) {
			//i18nNotifications.pushForCurrentRoute('spot.data.update.success', 'success');
		});
	});
}]);


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

angular.module('directives.displaySlider',[])
.directive('displaySlider', [ '$timeout', function($timeout) {
    var def = {
        transclude : true,
        scope:{ sliderId:'@' },
        link : function(scope, element, attrs) {
            $timeout(function() {
                $("#"+scope.sliderId).each(function(){
                    $(this).amazingslider({
                        lightboxmode:true,
                        lightboxid:$(this).attr('id'),
                        jsfolder:'/static/img/',
                        width:690,
                        height:0,
                        skinsfoldername:"",
                        loadimageondemand:false,
                        isresponsive:true,
                        autoplayvideo:false,
                        pauseonmouseover:false,
                        addmargin:true,
                        randomplay:false,
                        playvideoonclickthumb:true,
                        slideinterval:5000,
                        enabletouchswipe:true,
                        transitiononfirstslide:false,
                        loop:0,
                        autoplay:false,
                        navplayvideoimage:"play-32-32-0.png",
                        navpreviewheight:60,
                        timerheight:2,
                        shownumbering:false,
                        skin:"Gallery",
                        textautohide:false,
                        addgooglefonts:true,
                        navshowplaypause:true,
                        navshowplayvideo:true,
                        navshowplaypausestandalonemarginx:8,
                        navshowplaypausestandalonemarginy:8,
                        navbuttonradius:0,
                        navthumbnavigationarrowimageheight:32,
                        navpreviewarrowheight:8,
                        showshadow:false,
                        navfeaturedarrowimagewidth:16,
                        navpreviewwidth:120,
                        googlefonts:"Inder",
                        textpositionmarginright:24,
                        bordercolor:"#ffffff",
                        navthumbnavigationarrowimagewidth:32,
                        navthumbtitlehovercss:"text-decoration:underline;",
                        arrowwidth:32,
                        texteffecteasing:"easeOutCubic",
                        texteffect:"",
                        navspacing:8,
                        navarrowimage:"navarrows-28-28-0.png",
                        ribbonimage:"ribbon_topleft-0.png",
                        navwidth:52,
                        showribbon:false,
                        arrowtop:50,
                        timeropacity:0.6,
                        navthumbnavigationarrowimage:"carouselarrows-32-32-0.png",
                        navshowplaypausestandalone:false,
                        navpreviewbordercolor:"#ffffff",
                        ribbonposition:"topleft",
                        navthumbdescriptioncss:"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;",
                        navborder:0,
                        navthumbtitleheight:20,
                        textpositionmargintop:24,
                        navswitchonmouseover:false,
                        playvideoimage:"playvideo-64-64-0.png",
                        arrowimage:"arrows-32-32-0.png",
                        textstyle:"static",
                        playvideoimageheight:64,
                        navfonthighlightcolor:"#666666",
                        showbackgroundimage:false,
                        navpreviewborder:4,
                        navopacity:0.8,
                        shadowcolor:"#aaaaaa",
                        navbuttonshowbgimage:false,
                        navbuttonbgimage:"navbuttonbgimage-28-28-0.png",
                        textbgcss:"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);",
                        playvideoimagewidth:64,
                        bottomshadowimagewidth:110,
                        showtimer:false,
                        navradius:0,
                        navshowpreview:false,
                        navmarginy:8,
                        navmarginx:8,
                        navfeaturedarrowimage:"featuredarrow-16-8-0.png",
                        navfeaturedarrowimageheight:8,
                        navstyle:"thumbnails",
                        textpositionmarginleft:24,
                        descriptioncss:"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;",
                        navplaypauseimage:"navplaypause-48-48-0.png",
                        backgroundimagetop:-10,
                        arrowstyle:"mouseover",
                        timercolor:"#ffffff",
                        numberingformat:"%NUM/%TOTAL ",
                        navfontsize:12,
                        navhighlightcolor:"#333333",
                        navimage:"bullet-24-24-5.png",
                        navheight:52,
                        navshowplaypausestandaloneautohide:true,
                        navbuttoncolor:"",
                        navshowarrow:false,
                        navshowfeaturedarrow:false,
                        titlecss:"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;",
                        ribbonimagey:0,
                        ribbonimagex:0,
                        navshowplaypausestandaloneposition:"bottomright",
                        shadowsize:0,
                        arrowhideonmouseleave:1000,
                        navshowplaypausestandalonewidth:48,
                        navshowplaypausestandaloneheight:48,
                        backgroundimagewidth:120,
                        navcolor:"#999999",
                        navthumbtitlewidth:120,
                        navpreviewposition:"top",
                        arrowheight:32,
                        arrowmargin:8,
                        texteffectduration:1000,
                        bottomshadowimage:"bottomshadow-110-95-4.png",
                        border:6,
                        timerposition:"bottom",
                        navfontcolor:"#333333",
                        navthumbnavigationstyle:"arrow",
                        borderradius:0,
                        navbuttonhighlightcolor:"",
                        textpositionstatic:"bottom",
                        navthumbstyle:"imageonly",
                        textcss:"display:block; padding:8px 16px; text-align:left; ",
                        navbordercolor:"#ffffff",
                        navpreviewarrowimage:"previewarrow-16-8-0.png",
                        showbottomshadow:false,
                        navdirection:"horizontal",
                        textpositionmarginstatic:0,
                        backgroundimage:"",
                        navposition:"bottom",
                        navpreviewarrowwidth:16,
                        bottomshadowimagetop:95,
                        textpositiondynamic:"bottomleft",
                        navshowbuttons:false,
                        navthumbtitlecss:"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;",
                        textpositionmarginbottom:24,
                        transition:""
                    });
                    //TODO: replace with stg better !
                    $('[class^=amazingslider-slider-]').hide();
                    $('[class^=amazingslider-nav-]').css('background-color','#f5f5f5');
                    $('.amazingslider-slider-0').show();
                });    
            }, 0);  
        }
    };
return def;
}]);
angular.module('directives.input', []);
angular.module('directives.input')
.directive('locAutocomplete', ['appSettings',function(appSettings) {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			
			ngModelCtrl.$formatters.push(function(val) {
				if (val) {
					return val.value;
				}
			});

			var updateModel = function (suggestion) {
				ngModelCtrl.$setViewValue({
					value:suggestion.value,
					type:suggestion.data.type
				});
			};
			
			var setup = function () {
				var options = scope.$eval(attrs.autocomplete) || {};
				options.paramName =  'input';
				options.minChars = 1;
				//options.serviceUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw';
				//todo : put this as an option of the directive
				options.serviceUrl = appSettings.apiServer + appSettings.apiUri + '/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw';
				options.onSelect = updateModel;
				options.noCache = true;
				options.formatResult = function (suggestion, currentValue) {

					//Add <strong> tags around current value. Method taken from vendor autocomplete script
					// var pattern = '(' + currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')';
					// suggestion.value = suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');

					var icon;
					switch (suggestion.data.type) {
						case 'administrative_area_level_1':
						case 'country':
						icon='fa-flag';
						break;
						case 'route':
						icon='fa-road';
						break;
						case 'locality':
						icon='fa-building-o';
						break;
						case 'around':
						icon='fa-bullseye';
						break;
						default:
						icon='fa-map-marker';
					}
					return '<i class="fa '+ icon + '"></i> ' + suggestion.value;
				};
				options.transformResult = function(response) {
					var suggestions = $.map($.parseJSON(response).predictions, function(dataItem) {
						return { 
							value: dataItem.description,
							data: {
								reference:dataItem.reference,
								type:dataItem.types[0]
							}
						};
					});
					suggestions.push( {value: 'My Location', data: {type:'around'} });
					return {
						suggestions: suggestions   
					};
				};
				//options.onSelect = onSelectHandler(options.onSelect);
				//element.bind('change', updateModel);
				//element.datepicker('destroy');
				element.autocomplete(options);
				//ngModelCtrl.$render();
			};
			/*ngModelCtrl.$render = function () {
				element.val(ngModelCtrl.$viewValue);
			};*/
			scope.$watch(attrs.locAutocomplete, setup, true);
		}
	};
}]);
angular.module('directives.input')
.directive('richTextEditor', function() {
  return {
    restrict : "A",
    require : 'ngModel',
        //replace : true,
        transclude : true,
        //template : '<div><textarea></textarea></div>',
        link : function(scope, element, attrs, ctrl) {

          var textarea = element.wysihtml5({
            "html": false,
            "stylesheets": ["static/Spotly.css"]
          });
          // $('iframe.wysihtml5-sandbox').wysihtml5_size_matters();
          //element.focus();

          var editor = textarea.data('wysihtml5').editor;

          // view -> model
          editor.on('change', function() {
            if(editor.getValue()) {
              scope.$apply(function() {
                ctrl.$setViewValue(editor.getValue());
              });
            }
          });

          // model -> view
          ctrl.$render = function() {
            textarea.html(ctrl.$viewValue);
            editor.setValue(ctrl.$viewValue);
          };

          ctrl.$render();
        }
      };
    });
angular.module('directives.input')
.directive('tagAutocomplete', function() {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			// To do delete ?
			ngModelCtrl.$formatters.push(function(val) { 
				if (val) {
					return val.value;
				}
			});
			var updateModel = function (suggestion) {
				scope.$apply(function () {	
					ngModelCtrl.$setViewValue({
						value:suggestion.value,
						type:suggestion.data
					});
				});
			};
			
			var setup = function () {
				var options = scope.$eval(attrs.tagAutocomplete) || {};
				options.paramName =  'input';
				options.onSelect = updateModel;
				options.transformResult = function(response) {
					// first line of the JSON is sliced (see server/config/protectJSON.js)
					var suggestions = $.map($.parseJSON(response.split("\n").slice(1).join("\n")), function(dataItem) {
						return { value: dataItem.value , data: 'tag' };
					});
					suggestions.push({value: 'All Sports', data: 'all'});
					return {
						suggestions:suggestions    
					};
				};
				element.autocomplete(options);
			};
			scope.$watch(attrs.tagAutocomplete, setup, true);
		}
	};
});
angular.module('directives.spotList',[])

.constant('spotListConfig', {

})

.controller('SpotListController', ['$scope', '$attrs', 'spotListConfig', function ($scope, $attrs, spotListConfig) {

	console.log('SpotListController - init');
	
	// This array keeps track of the spots
	this.spots = [];
	this.map = {};

	// Keep reference to user's scope to properly assign `is-selected`
	this.scope = $scope;

	// Ensure that all the spots in this list are unselected
	this.unselectOthers = function(selectedSpot) {
		angular.forEach(this.spots, function (spot) {
			if ( spot !== selectedSpot ) {
				spot.isSelected = false;
			}
		});
	};
	
	// This is called from the spot directive to add itself to the spot list
	this.addSpot = function(spotScope) {
		var that = this;
		this.spots.push(spotScope);

		spotScope.$on('$destroy', function (event) {
			that.removeSpot(spotScope);
		});
	};

	// This is called from the spot directive when to remove itself
	this.removeSpot = function(spot) {
		var index = this.spots.indexOf(spot);
		if ( index !== -1 ) {
			this.spots.splice(this.spots.indexOf(spot), 1);
		}
	};

	// This is called from the map directive to register itself to the spot list controller
	this.addMap = function(mapScope) {
		var that = this;
		this.mapScope = mapScope;
		mapScope.$on('$destroy', function (event) {
			that.removeMap();
		});
	};

	// This is called from the map directive when to remove itself
	this.removeMap = function() {
		this.map = {};
	};

}])

// The spotList directive simply sets up the directive controller
// and adds a CSS class to itself element.
.directive('spotList', function () {
	return {
		restrict:'EA',
		controller:'SpotListController',
		transclude: true,
		replace: false,
		template: '<div class="spots-list-container" ng-transclude></div>'
	};
})

// The spot directive indicates a block of html that will compose a spotList
.directive('spotItem', ['$parse','Marker', function($parse,Marker) {
	return {
		require:'^spotList',         // We need this directive to be inside a spotList
		restrict:'EA',
		transclude:true,              // It transcludes the contents of the directive into the template
		replace: true,                // The element containing the directive will be replaced with the template
		templateUrl:'directives/spotList/spot.tpl.html',
		scope:{ spot:'@', index:'@', last:'@', onLike:'&', isSelected:'@' },        // Create an isolated scope and interpolate the spot attribute onto this scope
		link: function(scope, element, attrs, spotListCtrl) {
			var getIsSelected, setIsSelected;
			
			spotListCtrl.addSpot(scope);
			scope.isSelected = false;
			
			var spotObj;

			if ( attrs.isSelected ) {
				getIsSelected = $parse(attrs.isSelected);
				setIsSelected = getIsSelected.assign;

				spotListCtrl.scope.$watch(getIsSelected, function(value) {
					scope.isSelected = !!value;
				});
			}

			scope.$watch('index', function(value) {
				scope.displayIndex = parseInt(value) + 1;
			});

			scope.$watch('spot', function(value) {
				spotObj = JSON.parse(value);
				scope._id = spotObj._id;
				scope.title = spotObj.title;
				scope.likes = spotObj.likes;
				scope.tags = spotObj.tags;
				scope.description = spotObj.description;
				scope.loc = spotObj.loc;
				scope.address = spotObj.address;

				// Create a marker
				var marker = new Marker({
					id: scope._id,
					latitude: scope.loc[1],
					longitude: scope.loc[0],
					title: scope.title,
					draggable: false,
					numberedIcon: true,
					index:scope.displayIndex,
					likes: scope.likes.length
				});
				
				// Add the marker to the map
				spotListCtrl.mapScope.spotMap.addMarker(marker);
				if (scope.last === 'true') {
					spotListCtrl.mapScope.spotMap.fitOnBounds();
				}
			});

			scope.$watch('isSelected', function(value) {
				if ( value ) {
					spotListCtrl.unselectOthers(scope);
					spotListCtrl.mapScope.spotMap.focusOnMarker(spotObj._id,{zoom:false});
				}
				if ( setIsSelected ) {
					setIsSelected(spotListCtrl.scope, value);
				}
			});

			scope.$on('$destroy', function (event) {
				spotListCtrl.mapScope.spotMap.removeMarker(scope._id);
			});

			scope.like = function(index) {
				//scope.isSelected=true;
				scope.onLike(index);
			};
		}
	};
}])

.directive('map', ['MapFactory','Marker','utilsService', function(MapFactory,Marker,utilsService){
	return {
		require: '?^spotList',
		restrict: 'E',
		template: '<div id="spotMap"></div>',
		transclude: true,
		replace: true,
		scope: {
			loc: '@',
			mode: '@',
			onMove: '&'
		},
		link: function(scope, element, attrs, spotListCtrl) {

			
			if (typeof spotListCtrl !== "undefined") {
				spotListCtrl.addMap(scope);
			}

			scope.$watch('loc',function(value){
				scope.loc = value;
				if (!value || (value === "{}")) {
					return;
				}
				var coords = JSON.parse(value);
				var zoom;
					// if a "scope" attr is filled, display a single spot at the center of the map
					if (!scope.spotMap) {
						scope.spotMap = new MapFactory('spotMap',{
							onLocationFound:onLocationFound,
							onLocationError:onLocationError,
							onPopupOpen:onPopupOpen,
							padding:[0,0,0,0]
						});
						zoom = 13;

					} else {
						zoom = scope.spotMap.map.getZoom();
						scope.spotMap.clear();
					}
					
					var options = {
						id: 0,
						latitude: coords[1],
						longitude: coords[0],
						//title: spot.title,
						// todo change
						numberedIcon: scope.mode === 'edit' ? false : true,
						color : 'blue',
						awesomeIcon : scope.mode === 'edit' ? 'arrows' : ' ',
						draggable: scope.mode === 'edit' ? true : false
					};

					// Add spot marker
					var marker = new Marker(options);

					//register to the drag event
					marker.LMarker.on('dragend', function (e) {
						var coords = e.target.getLatLng();
						
						var lat = coords.lat;
						var lng = coords.lng;

						scope.onMove({loc:[lng,lat]});
					});


					// Add the marker to the map
					scope.spotMap.addMarker(marker);

					scope.spotMap.map.setView([coords[1],coords[0]], zoom);
				});

scope.$watch('mode',function(mode){
	if (mode === "explore") {
		scope.spotMap = new MapFactory('spotMap',{
			onLocationFound:onLocationFound,
			onLocationError:onLocationError,
			onPopupOpen:onPopupOpen,
			padding:[480,150,150,150]
		});
		scope.spotMap.map.setView([48.51, 2.21], 3);
										/*console.log('try to locate...');
										scope.spotMap.map.locate({
												setView: true,
												maxZoom: 18
											});*/
}
});

function onLocationFound(e) {
	var radius = e.accuracy / 2;
	var message = "You are within " + radius + " meters from this point";

					// Create a new marker
					var marker = new Marker({
						id: 'geoPosition',
						latitude: e.latlng.lat,
						longitude: e.latlng.lng,
						title: message,
						draggable: true,
						awesomeIcon: 'icon-screenshot icon-large',
						color: 'red',
						index: '0'
					});

					// Display the marker
					scope.spotMap.map.addLayer(marker.LMarker);

					// store the marker
					scope.spotMap.geoPosition.marker = marker;
				}

				function onLocationError(e) {
						//TODO
					}


				// Triggered when a spot has been selected, by clicking on left bar or directly on marker
				function onPopupOpen(e) {
					var spotId = e.popup._source.options.id;

					// Select associated spot
					for(var i=0,l=spotListCtrl.spots.length; i<l;i++) {
						if ( spotListCtrl.spots[i]._id === spotId ) {
							if (!spotListCtrl.spots[i].isSelected) {
								spotListCtrl.spots[i].isSelected = true;
								// Apply modification to all spots scopes
								spotListCtrl.scope.$digest();
							}
							break;
						}
					}
					// If the spot item does not appear in the spot list, display it (with an animation)
					if (!utilsService.isElementInViewport($("#spot-"+spotId).get(0),{top:70})) {
						var offset = $("#spot-"+spotId).offset().top - 70;
						$('html, body').animate({   
							scrollTop: offset
						}, 500, function(){
							$("#spots-main").offset({ top:$('body').scrollTop() +70 });
						});
					} else {
						$("#spots-main").offset({ top:$('body').scrollTop() +70 });
					}
				}
			}
		};
	}])

.factory('MapFactory',['Marker','utilsService',function(Marker,utilsService) {

	return function (map_id,options) {

		this.map_id = map_id;
			// Create the map
			this.map = L.map(this.map_id, {scrollWheelZoom : false, zoomControl : false});
			
			var zoomControl = new L.Control.Zoom({position:'topright'});
			zoomControl.addTo(this.map);
			
			this.markers = new utilsService.HashTable();
			this.bounds = [];
			this.geoPosition = {};

			// Set the legend
			var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			osm = L.tileLayer(osmUrl, {
				maxZoom: 18,
				attribution: osmAttrib,
				timeout: 3000000
			});
			osm.addTo(this.map);

			if (options.onLocationError) {
				this.map.on('locationerror', options.onLocationError);        
			}
			if (options.onLocationFound) {
				this.map.on('locationfound', options.onLocationFound);        
			}
			if (options.onPopupOpen) {
				this.map.on('popupopen', options.onPopupOpen);        
			}
			if (options.padding) {
				this.padding = options.padding;
			} else {
				this.padding = [480,150,150,150];
			}

			// this.map.setView([48.51, 2.21], 3);
			// Get geolocation and center the map
			// this.geoLocate();

			this.geoLocate = function () {
					//TODO: cache the location
					this.map.locate({
						setView: true,
						maxZoom: 18
					});
				};

				this.centerOnGeoPosition = function () {
					/*this.map.fitBounds([this.geoPosition.marker.LMarker._latlng], {
							paddingTopLeft: [($(window).width()/4), 90],
							paddingBottomRight: [50,50],
							zoom:true
						});*/

this.map.panTo([this.geoPosition.marker.LMarker._latlng.lat, this.geoPosition.marker.LMarker._latlng.lng]);
};

this.moveGeoMarker = function (latlng) {
	this.geoPosition.marker.LMarker._latlng.lat = latlng.lat;
	this.geoPosition.marker.LMarker._latlng.lng = latlng.lng;
	this.geoPosition.marker.LMarker.update();
	this.centerOnGeoPosition();
};

this.removeGeoMarker = function () {
					// Remove the marker
					this.map.removeLayer(this.geoPosition.marker.LMarker);
					// Clean the object
					this.geoPosition = {};
				};

				this.fitOnBounds = function (mode) {
					// Center the map on the displayed markers
					if (this.bounds.length) {
						this.map.fitBounds(this.bounds, {
							paddingTopLeft: [this.padding[0], this.padding[1]],
							paddingBottomRight: [this.padding[2],this.padding[3]]
						});
					}
				};

				this.focusOnMarker = function (id) {

					var LMarker = this.markers.getItem(id).LMarker;
					// Pan the map to the marker (smooth move)
					// this.map.setView(LMarker._latlng, 13);
					// if (this.bounds.length)
					//   this.map.fitBounds(this.bounds, {
					//     paddingTopLeft: [this.padding[0], this.padding[1]],
					//     paddingBottomRight: [this.padding[2],this.padding[3]]
					// });
					// Open the popup
					LMarker.openPopup();
				};

				this.closePopup = function (id) {
					if (id) {
						var LMarker = this.markers.getItem(id).LMarker;
						LMarker.closePopup();
					}   
				};

				this.displayMap = function (position) {
					if (typeof position === "undefined") {
							//If no position is specified, load geoCoords
							this.map.setView([this.geoPosition.coords.latitude, this.geoPosition.coords.longitude], 10);
						} else {
							this.map.setView([position.coords.latitude, position.coords.longitude], 10);
						}
					};

					this.addMarker = function (marker) {
						var oldMarker = this.markers.getItem(marker.id);
						if (typeof oldMarker === "undefined") {

							// Display the marker
							//marker.LMarker.addTo(this.map);
							this.map.addLayer(marker.LMarker);

							// if specified, display the label in a popup
							//if (typeof marker.label != "undefined") {
							//  marker.LMarker.bindPopup(marker.label);
							//}

							// Update markers hashtable
							this.markers.setItem(marker.id, marker);

							// update the map bounds
							this.bounds.push(marker.LMarker._latlng);
						}
					/*else {
				// Marker already exists
				if ((oldMarker.longitude != marker.longitude) || (oldMarker.latitude != marker.latitude)) {
			console.log('existe deja');
			// Move the existing marker
			var lat = (marker.latitude);
			var lng = (marker.longitude);
			var newLatLng = new L.LatLng(lat, lng);
			oldMarker.LMarker.setLatLng(newLatLng); 

			// Store the new marker
			this.markers.setItem(_marker.id, marker);
				}
			}*/
		};

		this.clear = function (options) {
					//console.log(this.map);
					// Loop on all markers
					for (var k in this.markers.items) {
						if (this.markers.hasItem(k)) {
							this.map.removeLayer(this.markers.items[k].LMarker);
							this.markers.removeItem(k);
						}
					}
					// Reset the map bounds, used to adjust the view
					this.bounds = [];
				};

				this.removeMarker = function (id) {
					var marker = this.markers.getItem(id);
					var boundsIndex = this.bounds.indexOf(marker.LMarker._latlng);
					this.map.removeLayer(marker.LMarker);
					this.markers.removeItem(id);
					this.bounds.splice(boundsIndex,1);
					//TODO : 
				};

			};

		}])

.factory('Marker',['$templateCache',function($templateCache) {

	return function(options) {
		var LMarkerOptions = {};
		this.id = options.id;
			// if marker is draggable
			if (options.draggable) {
				LMarkerOptions.draggable = true;
			}

			if (options.id) {
				LMarkerOptions.id = options.id;
			}

			// if a special icon has been specified
			if (options.awesomeIcon && options.color) {
				var awesomeIcon = L.AwesomeMarkers.icon({
					prefix: 'fa',
					icon: options.awesomeIcon,
					markerColor: options.color
				});
				LMarkerOptions.icon = awesomeIcon;
			}
			// if a special icon has been specified
			if (options.numberedIcon) {
				numberedIcon = new L.NumberedDivIcon({number: options.index});
				LMarkerOptions.icon = numberedIcon;
			}
			this.latitude = options.latitude;
			this.longitude = options.longitude;

			// Create Leaflet marker
			this.LMarker = L.marker([this.latitude, this.longitude], LMarkerOptions);

			if (options.title) {
				var html = $templateCache.get('directives/spotList/spot.popup.tpl.html')
				.replace('{{spot.title}}',options.title)
				.replace('{{spot._id}}',options.id)
				.replace('{{spot.index}}',options.index);
				//var html = '<div ng-include="directives/spotList/spot.popup.tpl.html"></div>';
				// var html= '<div class="row" style="width:400px"> <div class="spot-infos col-lg-12" > <span class="spot-icon-container"> <button class="btn btn-default btn-select" ng-click="selectSpot('+
				//   options.id+')"><span style="font-size:1.2em;"><b>'+(options.index)+'</b></span></button> </span> <div class="spot-info-container"> <h4 class="list-group-item-heading"> <div class="pull-right"> <div class="btn-group"> <button class="btn btn-default"><span style="font-size:1em;"><i class="icon-comments"></i></span></button> <button class="btn btn-default" disabled style="padding-left:3px;padding-right:3px;"><span style="font-size:1em;"><b>12</b></span></button> </div> <div class="btn-group"> <button class="btn btn-default" ng-click="like('+
				//   (options.index)+');$event.stopPropagation()"><span style="font-size:1em;"><i class="icon-heart"></i></span></button> <button class="btn btn-default" disabled style="padding-left:3px;padding-right:3px;"><span style="font-size:1em;"><b>'+
				// options.likes+'</b></span></button> </div> </div> <a href="#/spot/'+options.id+'" role="spot-title"><b>'+options.title+'</b></a></br> <div id="map-tags-container"> <span id="map-tags"> <span style="display:inline-block"><small>Randonnée</small> </span> </span> </div> </h4> </div></div></div><div class="panel-default" style="margin-bottom:-14px;margin-left:-20px;margin-right:-20px;"> <div class="panel-heading" style="border:0">'+
				// '<button class="btn btn-default" ng-click=""><i class="icon-edit icon-large"></i></button>'+
				// '<button class="btn btn-default" ng-click=""><i class="icon-info icon-large"></i></button>'+
				// '<button class="btn btn-default" ng-click=""><i class="icon-camera icon-large"></i></button>'+
				// '<button class="btn btn-default" ng-click=""><i class="icon-link icon-large"></i></button>' +
				// '</div>';
				this.LMarker.bindPopup(html,{'minWidth':'400px'});
			}
		};
	}]);

L.NumberedDivIcon = L.Icon.extend({
	options: {
			// EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
			iconUrl: 'static/img/marker-icon.png',
			number: '',
			shadowUrl: null,
			iconSize: new L.Point(25, 41),
			iconAnchor: new L.Point(13, 41),
			popupAnchor: new L.Point(0, -33),
			/*
			iconAnchor: (Point)
			popupAnchor: (Point)
			*/
			className: 'leaflet-div-numbered-icon'
		},

		createIcon: function () {
			var div = document.createElement('div');
			var img = this._createImg(this.options['iconUrl']);
			var numdiv = document.createElement('div');
			numdiv.setAttribute ( "class", "number" );
			numdiv.innerHTML = this.options['number'] || '';
			div.appendChild ( img );
			div.appendChild ( numdiv );
			this._setIconStyles(div, 'icon');
			return div;
		},

		//you could change this to add a shadow like in the normal marker if you really wanted
		createShadow: function () {
			return null;
		}
	});
angular.module('I18N',[])
  .constant('I18N.MESSAGES', {
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}.",
  'spot.data.update.success': "Spot data successfully updated",
  'errors.route.changeError': "Route change error",
  'login.reason.notAuthorized':"You are not authorized to perform this action.",
  'login.reason.notAuthenticated':"You must be authenticated to perform this action."
 });
angular.module('security.authorization', ['security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
.provider('securityAuthorization', {

  requireAdminUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAdminUser();
  }],

  requireAuthenticatedUser: ['securityAuthorization', function(securityAuthorization) {
    return securityAuthorization.requireAuthenticatedUser();
  }],

  $get: ['security', 'securityRetryQueue', function(security, queue) {
    var service = {

      // Require that there is an authenticated user
      // (use this in a route resolve to prevent non-authenticated users from entering that route)
      requireAuthenticatedUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAuthenticated() ) {
            return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
          }
        });
        return promise;
      },

      // Require that there is an administrator logged in
      // (use this in a route resolve to prevent non-administrators from entering that route)
      requireAdminUser: function() {
        var promise = security.requestCurrentUser().then(function(userInfo) {
          if ( !security.isAdmin() ) {
            return queue.pushRetryFn('unauthorized-client', service.requireAdminUser);
          }
        });
        return promise;
      }

    };

    return service;
  }]
});
// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security', [
  'security.service',
  'security.interceptor',
  'security.login',
  'security.authorization']);

angular.module('security.interceptor', ['security.retryQueue'])

// This http interceptor listens for authentication failures
.factory('securityInterceptor', ['$injector', 'securityRetryQueue', function($injector, queue) {
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry queue
        promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return promise;
    });
  };
}])

// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('securityInterceptor');
}]);
angular.module('security.login.form', [])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', ['$scope', '$modal','security', 'localizedMessages','message', function($scope, $modalInstance, security, localizedMessages,message) {

  // The model for this form 
  // $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  $scope.message = message;
  if ($scope.message) {
    $scope.authReason = $scope.message;
  }
  else if ( security.getLoginReason() ) {
    $scope.authReason = ( security.isAuthenticated() ) ?
      localizedMessages.get('login.reason.notAuthorized') :
      localizedMessages.get('login.reason.notAuthenticated');
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    //console.log($scope.user.form.username);
    //console.log($scope.user.username);
    // Clear any previous security errors
    $scope.authError = null;
    // Try to login
    security.login($('[name="username"]').val(), $('[name="password"]').val()).then(function(loggedIn) {
      if ( !loggedIn ) {
        // If we get here then the login failed due to bad credentials
        $scope.authError = localizedMessages.get('login.error.invalidCredentials');
        //$scope.authError = 'login.error.invalidCredentials';
      } else {
        //$modalInstance.dismiss(true);
      }
    }, function(x) {
      // If we get here then there was a problem with the login request to the server
      $scope.authError = 'login.error.serverError: ' + x;
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    security.cancelLogin();
  };
}]);

angular.module('security.login', ['security.login.form', 'security.login.toolbar']);
angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['security', function(security) {
  var directive = {
    templateUrl: 'security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = security.isAuthenticated;
      $scope.login = security.showLogin;
      $scope.logout = security.logout;
    }
  };
  return directive;
}]);
angular.module('security.retryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
.factory('securityRetryQueue', ['$q', '$log', function($q, $log) {
  var retryQueue = [];
  var service = {
    // The security service puts its own handler in here!
    onItemAddedCallbacks: [],
    
    hasMore: function() {
      return retryQueue.length > 0;
    },
    push: function(retryItem) {
      retryQueue.push(retryItem);
      // Call all the onItemAdded callbacks
      angular.forEach(service.onItemAddedCallbacks, function(cb) {
        try {
          cb(retryItem);
        } catch(e) {
          $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
        }
      });
    },
    pushRetryFn: function(reason, retryFn) {
      // The reason parameter is optional
      if ( arguments.length === 1) {
        retryFn = reason;
        reason = undefined;
      }

      // The deferred object that will be resolved or rejected by calling retry or cancel
      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
        retry: function() {
          // Wrap the result of the retryFn into a promise if it is not already
          $q.when(retryFn()).then(function(value) {
            // If it was successful then resolve our deferred
            deferred.resolve(value);
          }, function(value) {
            // Othewise reject it
            deferred.reject(value);
          });
        },
        cancel: function() {
          // Give up on retrying and reject our deferred
          deferred.reject();
        }
      };
      service.push(retryItem);
      return deferred.promise;
    },
    retryReason: function() {
      return service.hasMore() && retryQueue[0].reason;
    },
    cancelAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().cancel();
      }
    },
    retryAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().retry();
      }
    }
  };
  return service;
}]);

// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
  'security.retryQueue',    // Keeps track of failed requests that need to be retried once the user logs in
  'security.login',         // Contains the login form template and controller
  'ui.bootstrap.modal'     // Used to display the login form as a modal dialog.
])
.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$modal', function($http, $q, $location, queue, $modal) {

  var user = {
    username: 'name',
    password: null
  };


  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog(options,next) {
    console.log(options);
    if (typeof options === 'undefined' || options === null) {
      options = {};
    }
    if ( loginDialog ) {
      throw new Error('Trying to open a dialog that is already open!');
    }
    loginDialog = $modal.open({
      templateUrl: 'security/login/form.tpl.html',
      controller: 'LoginFormController',
      resolve: {
        user: function () {
          return user;
        },
        message: function() {
          return options.message;
        }
      }
    });
    loginDialog.result.then(function(success) {
      loginDialog = null;
      if ( success ) {
        queue.retryAll();
        if (typeof next === 'function') {
          console.log('oki');
          next();
        }
      } else {
        queue.cancelAll();
        //redirect();
      }
    }, function() {
      loginDialog = null;
      console.log('Dialog dismissed');
      queue.cancelAll();
      //redirect();
    });
    //loginDialog.open('security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
  }
  function closeLoginDialog(success) {
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  /*function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      queue.retryAll();
    } else {
      queue.cancelAll();
      redirect();
    }
  }*/

  // Register a handler for when an item is added to the retry queue
  queue.onItemAddedCallbacks.push(function(retryItem) {
    if ( queue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {

    // Get the first reason for needing a login
    getLoginReason: function() {
      return queue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function(options,next) {
      openLoginDialog(options,next);
    },

    // Attempt to authenticate a user by the given email and password
    login: function(email, password) {
      var request = $http.post('/login', {username: email, password: password});
      return request.then(function(response) {
        service.currentUser = response.data.user;
        if ( service.isAuthenticated() ) {
          closeLoginDialog(true);
        }
        return service.isAuthenticated();
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      closeLoginDialog(false);
      redirect();
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.post('/logout').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/current-user').then(function(response) {
          service.currentUser = response.data.user;
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },
    
    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]);


/**!
 * AngularJS file upload/drop directive with http post and progress
 * @author  Danial  <danial.farid@gmail.com>
 * @version 1.2.4
 */
(function() {
	
var angularFileUpload = angular.module('angularFileUpload', []);

angularFileUpload.service('$upload', ['$http', '$rootScope', '$timeout', function($http, $rootScope, $timeout) {
	function sendHttp(config) {
		config.method = config.method || 'POST';
		config.headers = config.headers || {};
		config.transformRequest = config.transformRequest || function(data) {
			if (window.ArrayBuffer && data instanceof ArrayBuffer) {
				return data;
			}
			return $http.defaults.transformRequest[0](data);
		};
		
		if (window.XMLHttpRequest.__isShim) {
			config.headers['__setXHR_'] = function() {
				return function(xhr) {
					config.__XHR = xhr;
					xhr.upload.addEventListener('progress', function(e) {
						if (config.progress) {
							$timeout(function() {
								config.progress(e);
							});
						}
					}, false);
					//fix for firefox not firing upload progress end, also IE8-9
					xhr.upload.addEventListener('load', function(e) {
						if (e.lengthComputable) {
							$timeout(function() {
								config.progress(e);
							});
						}
					}, false);
				};
			};
		}
			
		var promise = $http(config);
		
		promise.progress = function(fn) {
			config.progress = fn;
			return promise;
		};		
		promise.abort = function() {
			if (config.__XHR) {
				$timeout(function() {
					config.__XHR.abort();
				});
			}
			return promise;
		};		
		promise.then = (function(promise, origThen) {
			return function(s, e, p) {
				config.progress = p || config.progress;
				origThen.apply(promise, [s, e, p]);
				return promise;
			};
		})(promise, promise.then);
		
		return promise;
	}
	this.upload = function(config) {
		config.headers = config.headers || {};
		config.headers['Content-Type'] = undefined;
		config.transformRequest = config.transformRequest || $http.defaults.transformRequest;
		var formData = new FormData();
		if (config.data) {
			for (var key in config.data) {
				var val = config.data[key];
				if (!config.formDataAppender) {
					if (typeof config.transformRequest === 'function') {
						val = config.transformRequest(val);
					} else {
						for (var i = 0; i < config.transformRequest.length; i++) {
							var fn = config.transformRequest[i];
							if (typeof fn === 'function') {
								val = fn(val);
							}
						}
					}
					formData.append(key, val);
				} else {
					config.formDataAppender(formData, key, val);
				}
			}
		}
		config.transformRequest =  angular.identity;
		
		var fileFormName = config.fileFormDataName || 'file';
		
		if (Object.prototype.toString.call(config.file) === '[object Array]') {
			var isFileFormNameString = Object.prototype.toString.call(fileFormName) === '[object String]'; 
			for (var j = 0; j < config.file.length; j++) {
				formData.append(isFileFormNameString ? fileFormName + j : fileFormName[j], config.file[j], config.file[j].name);
			}
		} else {
			formData.append(fileFormName, config.file, config.file.name);
		}
		
		config.data = formData;
		
		return sendHttp(config);
	};
	this.http = function(config) {
		return sendHttp(config);
	};
}]);

angularFileUpload.directive('ngFileSelect', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
	return function(scope, elem, attr) {
		var fn = $parse(attr['ngFileSelect']);
		elem.bind('change', function(evt) {
			var files = [], fileList, i;
			fileList = evt.target.files;
			if (fileList != null) {
				for (i = 0; i < fileList.length; i++) {
					files.push(fileList.item(i));
				}
			}
			$timeout(function() {
				fn(scope, {
					$files : files,
					$event : evt
				});
			});
		});
		elem.bind('click', function(){
			this.value = null;
		});
	};
} ]);

angularFileUpload.directive('ngFileDropAvailable', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDropAvailable']);
			$timeout(function() {
				fn(scope);
			});
		}
	};
} ]);

angularFileUpload.directive('ngFileDrop', [ '$parse', '$http', '$timeout', function($parse, $http, $timeout) {
	return function(scope, elem, attr) {
		if ('draggable' in document.createElement('span')) {
			var fn = $parse(attr['ngFileDrop']);
			elem[0].addEventListener("dragover", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				elem.addClass(attr['ngFileDragOverClass'] || "dragover");
			}, false);
			elem[0].addEventListener("dragleave", function(evt) {
				elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
			}, false);
			elem[0].addEventListener("drop", function(evt) {
				evt.stopPropagation();
				evt.preventDefault();
				elem.removeClass(attr['ngFileDragOverClass'] || "dragover");
				var files = [], fileList = evt.dataTransfer.files, i;
				if (fileList != null) {
					for (i = 0; i < fileList.length; i++) {
						files.push(fileList.item(i));
					}
				}
				$timeout(function() {
					fn(scope, {
						$files : files,
						$event : evt
					});
				});
			}, false);
		}
	};
} ]);

})();

app.service('commentsService', ['$http','appSettings',function ($http,appSettings) {

  this.getComment = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comment/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.getComments = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comments/'+id}).then(function(result) {
      return result.data;
    });
  };

  
}]);
angular.module('services.httpRequestTracker', []);
angular.module('services.httpRequestTracker').factory('httpRequestTracker', ['$http', function($http){

  var httpRequestTracker = {};
  httpRequestTracker.hasPendingRequests = function() {
    return $http.pendingRequests.length > 0;
  };

  return httpRequestTracker;
}]);
angular.module('services.i18nNotifications', ['services.notifications', 'services.localizedMessages']);
angular.module('services.i18nNotifications').factory('i18nNotifications', ['localizedMessages', 'notifications', function (localizedMessages, notifications) {

  var prepareNotification = function(msgKey, type, interpolateParams, otherProperties) {
     return angular.extend({
       message: localizedMessages.get(msgKey, interpolateParams),
       type: type
     }, otherProperties);
  };

  var I18nNotifications = {
    pushSticky:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushSticky(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForCurrentRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForCurrentRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    pushForNextRoute:function (msgKey, type, interpolateParams, otherProperties) {
      return notifications.pushForNextRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
    },
    getCurrent:function () {
      return notifications.getCurrent();
    },
    remove:function (notification) {
      return notifications.remove(notification);
    }
  };

  return I18nNotifications;
}]);
angular.module('services.localizedMessages', []).factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', function ($interpolate, i18nmessages) {

  var handleNotFound = function (msg, msgKey) {
    return msg || '?' + msgKey + '?';
  };

  return {
    get : function (msgKey, interpolateParams) {
      var msg =  i18nmessages[msgKey];
      if (msg) {
        return $interpolate(msg)(interpolateParams);
      } else {
        return handleNotFound(msg, msgKey);
      }
    }
  };
}]);
angular.module('services.notifications', []).factory('notifications', ['$rootScope', function ($rootScope) {

  var notifications = {
    'STICKY' : [],
    'ROUTE_CURRENT' : [],
    'ROUTE_NEXT' : []
  };
  var notificationsService = {};

  var addNotification = function (notificationsArray, notificationObj) {
    if (!angular.isObject(notificationObj)) {
      throw new Error("Only object can be added to the notification service");
    }
    notificationsArray.push(notificationObj);
    return notificationObj;
  };

  $rootScope.$on('$locationChangeSuccess', function () {
    notifications.ROUTE_CURRENT.length = 0;

    notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
    notifications.ROUTE_NEXT.length = 0;
  });

  notificationsService.getCurrent = function(){
    return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
  };

  notificationsService.pushSticky = function(notification) {
    return addNotification(notifications.STICKY, notification);
  };

  notificationsService.pushForCurrentRoute = function(notification) {
    return addNotification(notifications.ROUTE_CURRENT, notification);
  };

  notificationsService.pushForNextRoute = function(notification) {
    return addNotification(notifications.ROUTE_NEXT, notification);
  };

  notificationsService.remove = function(notification){
    angular.forEach(notifications, function (notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx>-1){
        notificationsByType.splice(idx,1);
      }
    });
  };

  notificationsService.removeAll = function(){
    angular.forEach(notifications, function (notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  return notificationsService;
}]);
app.service('spotsService', ['$http','appSettings',function ($http,appSettings) {

  this.getSpot = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id}).then(function(result) {
      return result.data;
    });
  };

  this.searchSpots = function(options) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+options.k+'/'+options.lng+'/'+options.lat}).then(function(result) {
      return result.data;
    });
  };

  this.updateSpot = function (spot) {
    var spotCopy = jQuery.extend({}, spot);
    var spot_id = spotCopy._id;
    delete spotCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+spot_id, data:spotCopy}).then(function(result) {
      return result.data;
    });
  };

  this.getComments = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/comments'}).then(function(result) {
      return result.data;
    });
  };

  this.getTopo = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/topo'}).then(function(result) {
      return result.data;
    });
  };

  this.getData = function(id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/spots/'+id+'/data'}).then(function(result) {
      return result.data;
    });
  };

  this.updateData = function (data) {
    var dataCopy = jQuery.extend({}, data);
    var data_id = dataCopy._id;
    delete dataCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/datas/'+data_id, data:dataCopy}).then(function(result) {
      //Todo : message d'erreur quand un XHR passe mal. Comment ?
      // return result.data;
    });
  };

  this.updateTopo = function (topo) {
    var topoCopy = jQuery.extend({}, topo);
    var topo_id = topoCopy._id;
    delete topoCopy._id;
    return $http({method: 'PUT', url: appSettings.apiServer + appSettings.apiUri + '/topos/'+topo_id, data:topoCopy}).then(function(result) {
      //Todo : message d'erreur quand un XHR passe mal. Comment ?
      // return result.data;
    });
  };

  this.insertComment = function(comment) {
    return $http({method: 'POST', url: appSettings.apiServer + appSettings.apiUri + '/comments', data:comment}).then(function(result) {
      return result.data;
    });     
  };
}]);
app.service('commentsService', ['$http','appSettings',function ($http,appSettings) {

  this.getTopo = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comment/'+id}).then(function(result) {
      return result.data;
    });
  };

  /*this.getComments = function (id) {
    return $http({method: 'GET', url: appSettings.apiServer + appSettings.apiUri + '/comments/'+id}).then(function(result) {
      return result.data;
    });
  };*/

  
}]);
app.service('utilsService', function () {
   this.guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };
    this.getQueryStringParams = function(str) {
        var queryString = str || window.location.search || '';
        var keyValPairs = [];
        var params      = {};
        queryString     = queryString.replace(/.*?\?/,"").split('#/')[0];

        if (queryString.length) {
            keyValPairs = queryString.split('&');
            for (var pairNum in keyValPairs) {
                var key = keyValPairs[pairNum].split('=')[0];
                if (!key.length) {
                    continue;
                }
                if (typeof params[key] === 'undefined') {
                    params[key] = [];
                }
                params[key].push(keyValPairs[pairNum].split('=')[1]);
            }
        }
        return params;
    };
    this.isElementInViewport = function (el, offset) {
        var rect = el.getBoundingClientRect();
        if (!(rect.top >= offset.top || 0)) {
            return false;
        }
        if (rect.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
            return false;
        }
        return true;
    };
    this.HashTable = function(obj) {
        this.length = 0;
        this.items = {};
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                this.items[p] = obj[p];
                this.length++;
            }
        }

        this.setItem = function (key, value) {
            var previous;
            if (this.hasItem(key)) {
                previous = this.items[key];
            } else {
                this.length++;
            }
            this.items[key] = value;
            return previous;
        };

        this.getItem = function (key) {
            return this.hasItem(key) ? this.items[key] : undefined;
        };

        this.hasItem = function (key) {
            return this.items.hasOwnProperty(key);
        };

        this.removeItem = function (key) {
            if (this.hasItem(key)) {
                previous = this.items[key];
                this.length--;
                delete this.items[key];
                return previous;
            } else {
                return undefined;
            }
        };

        this.keys = function () {
            var keys = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    keys.push(k);
                }
            }
            return keys;
        };

        this.values = function () {
            var values = [];
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    values.push(this.items[k]);
                }
            }
            return values;
        };

        this.each = function (fn) {
            for (var k in this.items) {
                if (this.hasItem(k)) {
                    fn(k, this.items[k]);
                }
            }
        };

        this.clear = function () {
            this.items = {};
            this.length = 0;
        };
    };
});

angular.module('templates.app', ['activity/activity.tpl.html', 'explore/explore.tpl.html', 'home/home.tpl.html', 'navbar/navbar.tpl.html', 'notifications/notifications.tpl.html', 'spot/comment/comment.edit.tpl.html', 'spot/comment/comment.tpl.html', 'spot/data/data.edit.tpl.html', 'spot/data/data.tpl.html', 'spot/header/header.edit.tpl.html', 'spot/header/header.tpl.html', 'spot/spot.edit.tpl.html', 'spot/spot.new.tpl.html', 'spot/spot.tpl.html', 'spot/topo/topo.edit.tpl.html', 'spot/topo/topo.tpl.html', 'user/user.tpl.html']);

angular.module("activity/activity.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("activity/activity.tpl.html",
    "<div class=\"container\">\n" +
    "	<div class=\"panel panel-default\">\n" +
    "		<!-- PANEL HEADING -->\n" +
    "		<div class=\"panel-heading\">\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<!-- PANEL BODY -->\n" +
    "		<div class=\"panel-body\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("explore/explore.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("explore/explore.tpl.html",
    "<div style=\"margin-bottom:70px\">\n" +
    "  <div id=\"spots-left-bar\">\n" +
    "\n" +
    "    <div class=\"panel panel-default\" style=\"margin-bottom:0px\">\n" +
    "      <div class=\"panel-body\">\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "          <a style=\"width:45px;\" ng-click=\"openModal()\" class=\"btn btn-default btn-lg\"><i class=\"fa fa-link\"></i></a>\n" +
    "          <a style=\"display:none\"  class=\"btn btn-default btn-lg\" ng-click=\"explore()\"><i style=\"font-size:1em;\" class=\"fa fa-arrow-right\"></i></a>\n" +
    "        </div>\n" +
    "        <span >\n" +
    "          <h1 id=\"map-title\" class=\"\">Explore</h1>\n" +
    "          <p>Results for <b>{{k.value}}</b> around <b>{{l.value}}</b> </p>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div spot-list>\n" +
    "      <map style=\"position:fixed;right:0;left:0;top:51px;bottom:0;z-index:-1\" mode=\"explore\" location=\"{{location}}\" onPopupOpen=\"onPopupOpen\"></map> \n" +
    "      <div data-ng-repeat=\"spot in spots\" spot-item spot=\"{{spot}}\" index=\"{{$index}}\" last=\"{{$last}}\" on-like=\"like($index)\" is-selected=\"{{spot.isSelected}}\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <script type=\"text/ng-template\" id=\"myModalContent.html\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>I'm a modal!</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <ul>\n" +
    "           CHAT\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    </div>\n" +
    "</script> -->");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div style=\"background:white\">\n" +
    "	<section class=\"home-slider-top\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-lg-12\">\n" +
    "					<div class=\"home-slider-top-text\">\n" +
    "						<h1><i class=\"fa fa-map-marker\"></i> Spotly</h1>\n" +
    "						<h3 style=\"font-family: 'Norican', cursive;font-size:3em\">Find places to enjoy your favorite sports</h3>\n" +
    "					</div>\n" +
    "\n" +
    "					<form role=\"explore\" class=\"\" id=\"home-explore-form\" novalidate>\n" +
    "						<div class=\"form-group pull-left\" style=\"width:303px;margin-left:15px;\">\n" +
    "							<div class=\"input-group\">\n" +
    "								<span class=\"input-group-addon input-lg\"><i class=\"fa fa-map-marker\"></i></span>\n" +
    "								<input tag-autocomplete=\"{{tagsAutocompleteOptions}}\" id=\"k\" type=\"text\" name=\"k\" ng-model=\"search.k\" class=\"form-control input-lg\" placeholder=\"Search\" autofocus>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div class=\"search-location form-group pull-left\" style=\"width:303px;margin-left:15px;\">\n" +
    "							<div class=\"input-group\">\n" +
    "								<span class=\"input-group-addon input-lg\"><i class=\"fa fa-location-arrow\"></i></span>\n" +
    "								<input loc-autocomplete type=\"text\" name=\"l\" id=\"l\" ng-model=\"search.l\" class=\"form-control input-lg\"  placeholder=\"Around\">\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<button id=\"search-button\" ng-click=\"explore()\" class=\"btn btn-success btn-lg\" style=\"margin-left:15px;\"> <i class=\"fa fa-search fa fa-white\"></i> <b>FIND SPOTS</b></button>\n" +
    "					</form>\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		\n" +
    "		</div>\n" +
    "	</section><!-- \n" +
    "	<section id=\"explore\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>What can I do ?</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/980-riding.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1010-surf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1013-rock-climbing.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1019-bmx.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1025-runner.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1038-diving.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "\n" +
    "			<br/>\n" +
    "\n" +
    "			<div class=\"row\">\n" +
    "\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1812-snowboard.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2540-windsurf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2554-race-car.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/3656-canoe-kayak.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2554-race-car.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/3656-canoe-kayak.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "			</div>\n" +
    "\n" +
    "			<br/>\n" +
    "\n" +
    "			<div class=\"row\">\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5339-yoga.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5400-backpacker.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5421-rafting.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/980-riding.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1010-surf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1013-rock-climbing.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section> -->\n" +
    "	<section id=\"services\">\n" +
    "			\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>What can I do ?</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-map-marker\"></i>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Spot places</h4>\n" +
    "						<p>Share sport-related points of interest.</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-search\"></i>\n" +
    "						</span>	\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Find any spots around</h4>\n" +
    "						<p>Find sporting activities around you.</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-comments\"></i>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Grow a community</h4>\n" +
    "						<p>Meet and exchange with people that share your passion</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section>\n" +
    "\n" +
    "	<section id=\"get-started\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>Let's get started</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-4 col-lg-offset-4\">\n" +
    "					<a href=\"#\" class=\"btn btn-success btn-lg\" style=\"width:100%\">Find sports spots around my location</a>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section>\n" +
    "</div>\n" +
    "\n" +
    "<footer>\n" +
    "	<div class=\"footer\">\n" +
    "		<p>© 2013. <a href=\"#\">Spotly.</a> All rights reserved.</p>\n" +
    "	</div>\n" +
    "</footer>\n" +
    "\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "	/*$('#main-slider').flexslider({\n" +
    "		animation: \"fade\",\n" +
    "		slideshowSpeed: 7000\n" +
    "	});*/\n" +
    "\n" +
    "	//locationAutocomplete($('#l'));\n" +
    "	//tagAutocomplete($('#k'));\n" +
    "	var hp = ['hp1.jpg','hp2.jpg'];\n" +
    "	$('.home-slider-top').css('background-image','url(../static/img/'+hp[Math.floor(Math.random() * hp.length)]+')');\n" +
    "	$('.home-slider-top').css('background-position','center');\n" +
    "	$('.home-slider-top').css('background-repeat','no-repeat');\n" +
    "\n" +
    "});\n" +
    "</script>");
}]);

angular.module("navbar/navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("navbar/navbar.tpl.html",
    "<nav class=\"navbar navbar-default\" ng-class=\"{'navbar-fixed-top':fixed, 'navbar-unfixed-top':!fixed}\" role=\"navigation\" style=\"min-width:970px\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "       <!-- APP TITLE -->\n" +
    "       \n" +
    "        <a class=\"navbar-brand\" ui-sref=\"home\" style=\"font-family: 'Grand Hotel', cursive;font-size:2em;padding:13px 15px\">\n" +
    "            <i ng-show=\"hasPendingRequests()\" class=\"fa fa-spinner fa-spin fa-fw\"></i>\n" +
    "            <i ng-show=\"!hasPendingRequests()\" class=\"fa fa-map-marker fa-fw\"></i> Spotly</a>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n" +
    "        <div ng-if=\"search\">\n" +
    "            <form class=\"navbar-form navbar-left\" style=\"float:left;margin-bottom:0px;margin-top:10px;\" role=\"explore\" ng-controller=\"ExploreFormController\">\n" +
    "                <div id=\"nav-search-spot\" class=\"form-group\" style=\"margin-bottom:0px;float:left;width:303px;margin-right:10px\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"><i class=\"fa fa-map-marker\"></i></span>\n" +
    "                        <input type=\"text\" tag-autocomplete=\"{{tagsAutocompleteOptions}}\" class=\"form-control\" style=\"height:34px;line-height:1.428571429;font-size:14px;\" id=\"k\" name=\"k\" ng-model=\"k\" placeholder=\"Search\"/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div id=\"nav-search-location\" class=\"form-group\" style=\"margin-bottom:0px;float:left;width:303px;margin-right:10px\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"><i class=\"fa fa-location-arrow\"></i></span>\n" +
    "                        <input type=\"text\" loc-autocomplete class=\"form-control\" style=\"height:34px;line-height:1.428571429;font-size:14px;\" id=\"l\" name=\"l\" placeholder=\"Around\" ng-model=\"l\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button id=\"nav-search-button\" ng-click=\"explore()\" type=\"submit\" class=\"btn btn-primary\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"> <i class=\"fa fa-search fa fa-white\"></i></input>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        \n" +
    "            <login-toolbar></login-toolbar>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("notifications/notifications.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("notifications/notifications.tpl.html",
    "<div ng-class=\"['alert', 'alert-'+notification.type]\" ng-repeat=\"notification in notifications.getCurrent()\">\n" +
    "    <button class=\"close\" ng-click=\"removeNotification(notification)\">x</button>\n" +
    "    {{notification.message}}\n" +
    "</div>");
}]);

angular.module("spot/comment/comment.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/comment/comment.edit.tpl.html",
    "<div style=\"overflow:auto;margin-bottom:15px\" id=\"comment-new\">\n" +
    "	<a class=\"pull-left\" href=\"#\">\n" +
    "		<img src=\"static/img/avatar_default.jpg\" class=\"img-rounded media-object story-avatar\">\n" +
    "	</a>\n" +
    "	<div style=\"width:83%; margin-left:100px\">\n" +
    "		<form role=\"form\" ng-submit=\"insertComment()\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-lg-12\">\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.title\" class=\"sr-only\">Title</label>\n" +
    "						<input type=\"text\" id=\"comment.title\" placeholder=\"Title\" data-ng-model=\"comment.title\" class=\"form-control\" autofocus=\"autofocus\">\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.body\" class=\"sr-only\">Type your story here</label>\n" +
    "						<textarea rows=\"4\" id=\"comment.body\" placeholder=\"Type your story here\" data-ng-model=\"comment.body\" class=\"form-control\"></textarea>\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.pictures\" class=\"sr-only\">Photos</label>\n" +
    "						<div ng-file-drop=\"onFileSelect($files)\" ng-file-drag-over-class=\"dragover\" ng-show=\"dropSupported\" class=\"drop-box\">\n" +
    "							<h4><i class=\"fa fa-camera fa fa-2x\" style=\"color:#aaa\"></i></h4>\n" +
    "							<h4 style=\"color:#aaa\">Drop your photos here</h4>\n" +
    "						</div>\n" +
    "						<div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">HTML5 Drop File is not supported!</div>\n" +
    "					</div>\n" +
    "					<div ng-repeat=\"upload in uploads\" class=\"form-group\">\n" +
    "						<div class=\"upload-progress panel panel-default panel-body\">\n" +
    "							<div class=\"col-lg-7\" style=\"padding-left:0\"><b>{{upload.name}} - {{upload.progress}}</b></div>\n" +
    "							<div class=\"progress col-lg-4\" style=\"margin-bottom:0;padding:0\">\n" +
    "								<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{upload.progress}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:{{upload.progress}}%\">\n" +
    "									<span class=\"sr-only\">{{upload.progress}}% Complete</span>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"pull-right\"><i class=\"fa fa-remove\"></i></div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<button data-ng-disabled=\"!enableAddStory()\" class=\"btn btn-success\">Add Story</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "	var offset = $(\"#comment-new\").offset().top - 70;\n" +
    "	$('html, body').animate({   \n" +
    "	  scrollTop: offset\n" +
    "	}, 500);\n" +
    "</script>");
}]);

angular.module("spot/comment/comment.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/comment/comment.tpl.html",
    "<div style=\"overflow:auto;margin-bottom:15px\" ng-controller=\"CommentController\">\n" +
    "	<a class=\"pull-left\" href=\"#\">\n" +
    "		<img src=\"static/img/avatar_default.jpg\" class=\"img-rounded media-object story-avatar\">\n" +
    "	</a>\n" +
    "	<div class=\"timeline-panel\">\n" +
    "		<div class=\"timeline-heading\">\n" +
    "			<h4 class=\"timeline-title\">{{comment.title}}</h4>\n" +
    "			<p><small class=\"text-muted\"><i class=\"fa fa-time\"></i> {{comment.creationDate}}</small></p>\n" +
    "		</div>\n" +
    "		<div class=\"timeline-body\">\n" +
    "			<p>{{comment.body}}</p>\n" +
    "			<div style=\"display:block;position:relative;margin: 10px -20px 0; padding-left:-20px; background-color:#f5f5f5;height:65px;\" ng-show=\"atLeastOnePicture()\">\n" +
    "				<div style=\"\" id=\"story-carousel-{{comment._id}}\" class=\"story-carousel\">\n" +
    "					<ul class=\"amazingslider-slides\" style=\"display:none;\">\n" +
    "						<li data-ng-repeat=\"picture in comment.pictures\">\n" +
    "							<img ng-src=\"/uploads/{{picture.url}}\"/>\n" +
    "						</li>\n" +
    "					</ul>\n" +
    "					<ul class=\"amazingslider-thumbnails\" style=\"display:none;\">\n" +
    "						<li data-ng-repeat=\"picture in comment.pictures\">\n" +
    "							<img ng-src=\"/uploads/{{picture.url}}\"/>\n" +
    "						</li>\n" +
    "						<div display-slider slider-id=\"story-carousel-{{comment._id}}\"></div>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div style=\"display:block;position:relative;margin: 10px -20px 0; padding-left:-20px; background-color:#f5f5f5;height:10px;\" ng-show=\"!atLeastOnePicture()\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("spot/data/data.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/data/data.edit.tpl.html",
    "<table class=\"table table-striped\" style=\"margin-bottom:0\">\n" +
    "	<tbody>\n" +
    "		<tr ng-repeat=\"data in data.table\">\n" +
    "			<td>\n" +
    "				<input type=\"text\" ng-model=\"data.key\" class=\"form-control input-sm\" style=\"width:29%;float:left;margin-right:6px;display:inline-block;\"></input>\n" +
    "				<!-- if != stars -->\n" +
    "				<input ng-if=\"data.type != 'stars'\" type=\"text\" ng-model=\"data.value\" class=\"form-control input-sm\" style=\"width:28%;text-align:right;float:left;margin-right:6px;display:inline-block;\"></input>\n" +
    "				<!-- if == stars -->\n" +
    "				<rating ng-if=\"data.type == 'stars'\" value=\"data.value\" max=\"max\" readonly=\"isReadonly\" on-hover=\"hoveringOver(value)\" rating-states=\"ratingStates\" on-leave=\"overStar = null\" style=\"margin-right:6px;float:left;padding-top:6px;padding-left:6px;font-size:1.2em\"></rating>\n" +
    "				\n" +
    "				<div style=\"float:right\">\n" +
    "					<div class=\"btn-group\">\n" +
    "						<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "							<i class=\"fa fa-bars\"></i>\n" +
    "						</button>\n" +
    "						<ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "							<li><a href ng-click=\"removeData($index)\"><i class=\"fa fa-trash-o\"></i> Remove data</a></li>\n" +
    "						</ul>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"btn-group\" style=\"float:right;margin-right:6px\">\n" +
    "					<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" style=\"width:54px\">\n" +
    "						{{data.type}}\n" +
    "					</button>\n" +
    "					<ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "						<li><a href ng-click=\"changeType($index,'km')\">Kilometer (km)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'m')\">Meter (m)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'day')\">Day</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'h')\">Hour (h)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'min')\">Minute (min)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'stars')\"><i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> (stars)</a></li>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td style=\"text-align:center\"><a href ng-click=\"addData()\">Add new data</a></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>");
}]);

angular.module("spot/data/data.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/data/data.tpl.html",
    "<!-- DATA -->\n" +
    "<div class=\"panel panel-default\" id=\"data\">\n" +
    "	<ul class=\"nav nav-tabs header-tabs\">\n" +
    "		<li><a href=\"#data-tab\" data-toggle=\"tab2\"><b>Data</b></a></li>\n" +
    "	</ul>\n" +
    "	<div data-ui-view=\"spot.data\" autoscroll=\"false\">\n" +
    "		<table class=\"table table-striped\" style=\"margin-bottom:0\">\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"data in data.table\">\n" +
    "					<td ng-if=\"data.type != 'stars'\">{{data.key}} <span class=\"pull-right\"><b>{{data.value}} {{data.type}}</b></span></td>\n" +
    "					<td ng-if=\"data.type == 'stars'\">{{data.key}} \n" +
    "						<span class=\"pull-right\">\n" +
    "							<rating value=\"data.value\" max=\"max\" readonly=\"true\" on-hover=\"hoveringOver(value)\" rating-states=\"ratingStates\" on-leave=\"overStar = null\" style=\"margin-left:8px;font-size:1.2em\"></rating>\n" +
    "						</span>\n" +
    "					</td>\n" +
    "				</tr>\n" +
    "			</tbody>\n" +
    "		</table>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "</script>");
}]);

angular.module("spot/header/header.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/header/header.edit.tpl.html",
    "<div class=\"form-group\">\n" +
    "	<strong><input class=\"form-control input-lg\" ng-model=\"spot.title\" placeholder=\"Spot Title\"></input></strong>\n" +
    "</div>\n" +
    "<input loc-autocomplete class=\"form-control\" ng-model=\"spot.address\" ng-change=\"updateMarker()\" placeholder=\"Spot Location\"></input>");
}]);

angular.module("spot/header/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/header/header.tpl.html",
    "<div ui-view=\"spot.header\" autoscroll=\"false\">\n" +
    "	<div class=\"pull-left\">\n" +
    "		<h1 style=\"margin-top:0;margin-bottom:0\">\n" +
    "			<strong>{{spot.title}}</strong>\n" +
    "		</h1>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\" autoscroll=\"false\">\n" +
    "		<a class=\"btn btn-default\" href ng-click=\"edit()\"><small><i class=\"fa fa-edit\"></i></small> Edit</a>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\">\n" +
    "		<button class=\"btn btn-default\" type=\"button\"><i class=\"fa fa-bookmark\"></i> <b>SAVE</b></button>\n" +
    "	</div>\n" +
    "	<div class=\"pull-right\">\n" +
    "		<div class=\"btn btn-group\" style=\"padding:0\">\n" +
    "			<button class=\"btn btn-default\" type=\"button\" ng-click=\"like()\" ><i class=\"fa fa-heart\"></i></button>\n" +
    "			<button class=\"btn btn-default\" type=\"button\" disabled><b>{{spot.likes.length}}</b></button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div style=\"clear:both\"></div>\n" +
    "	<p style=\"margin-bottom:0;margin-top:7px\" class=\"pull-left\"><i class=\"fa fa-home\"></i> {{spot.address.value}}</p>\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\">\n" +
    "		<div class=\"input-group\" style=\"width:180px\">\n" +
    "			<input type=\"text\" class=\"form-control\" value=\"{{url}}\">\n" +
    "			<span class=\"input-group-btn\">\n" +
    "				<a class=\"btn btn-default addthis_button_compact\" type=\"button\" addthis:ui_click=\"true\"><b>SHARE IT</b></a>\n" +
    "			</span>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div style=\"clear:both\"></div>\n" +
    "</div>\n" +
    "<script type=\"text/javascript\">\n" +
    "	var addthis_config = {\"data_track_addressbar\":true};\n" +
    "	addthis_config.ui_offset_top = 10;\n" +
    "</script>\n" +
    "<script type=\"text/javascript\" src=\"//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-520613fc20d317d5\"></script>");
}]);

angular.module("spot/spot.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.edit.tpl.html",
    "<div class=\"panel panel-default panel-body\">\n" +
    "	<h3 style=\"margin:0\">\n" +
    "		<span class=\"label label-primary\">EDIT MODE</span>\n" +
    "		<div class=\"pull-right\" style=\"padding-left:8px\" autoscroll=\"false\">\n" +
    "			<button class=\"btn btn-success\" ng-click=\"save()\">SAVE CHANGES</button>\n" +
    "		</div>\n" +
    "	</h3>\n" +
    "</div>");
}]);

angular.module("spot/spot.new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.new.tpl.html",
    "html");
}]);

angular.module("spot/spot.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.tpl.html",
    "<div class=\"container\">\n" +
    "	\n" +
    "	<div ui-view=\"spot.edit.toolbar\" autoscroll=\"false\"></div>\n" +
    "\n" +
    "	<div class=\"panel panel-default\">\n" +
    "		<!-- PANEL HEADING -->\n" +
    "		<div class=\"panel-heading\" ng-controller=\"SpotHeaderController\" ng-include=\"'spot/header/header.tpl.html'\"></div>\n" +
    "\n" +
    "		<!-- PANEL BODY -->\n" +
    "		<div class=\"panel-body\">\n" +
    "			<div  style=\"padding:0\" id=\"map-left\" class=\"col-lg-12\" ng-if=\"editMode\">\n" +
    "				<div class=\"panel panel-default\">\n" +
    "					<div class=\"panel-body\">\n" +
    "						<map loc=\"{{spot.loc}}\" mode=\"{{mapMode()}}\" on-move=\"updateAddress(loc)\" class=\"map\"></map>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div  style=\"clear:both\" id=\"map-left\" class=\"col-lg-9\">      \n" +
    "				<div class=\"panel panel-default panel-body\" ng-if=\"!editMode\">\n" +
    "					<div class=\"row\">\n" +
    "						<img src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\" class=\"col-lg-5\">\n" +
    "						<div class=\"col-lg-7\">\n" +
    "							<div style=\"margin-bottom:7px\">\n" +
    "								<i class=\"icon icon_trekking fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "								<i class=\"icon icon_skiing fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "								<i class=\"icon icon_swimming fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "							</div>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-lg-4\">\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">{{spot.likes.length}}</h4>\n" +
    "									<small>LOVES</small>\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">{{comments.length}}</h4>\n" +
    "									<small>COMMENTS</small>\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">12,423</h4>\n" +
    "									<small>VIEWS</small>\n" +
    "								</div>\n" +
    "								<div class=\"col-lg-8\">\n" +
    "									\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "					<div style=\"display:block;position:relative;margin: 10px -15px -14px; padding-left:-20px; background-color:#f5f5f5;height:65px;\">\n" +
    "						<div id=\"carousel-spot\" class=\"story-carousel\">\n" +
    "							<ul class=\"amazingslider-slides\" style=\"display:none;\">\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "							</ul>\n" +
    "							<ul class=\"amazingslider-thumbnails\" style=\"display:none;\">\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<div display-slider slider-id=\"carousel-spot\"></div>\n" +
    "							</ul>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				\n" +
    "				<div ng-controller=\"TopoController\" ng-include=\"'spot/topo/topo.tpl.html'\"></div>\n" +
    "				\n" +
    "\n" +
    "				<!-- STORIES -->\n" +
    "				<div class=\"panel panel-default\" id=\"stories\" ng-show=\"!editMode\">\n" +
    "					<ul class=\"nav nav-tabs header-tabs\">\n" +
    "						<li><a href=\"#stories\" data-toggle=\"tab3\"><b>Stories ({{comments.length}})</b></a></li>\n" +
    "						<div class=\"pull-right\" data-ui-view=\"comment.action\">\n" +
    "							<a class=\"btn btn-primary\" ui-sref=\"spot.comment\"><i class=\"fa fa-plus-sign\"></i> Add a Story</a>\n" +
    "						</div>\n" +
    "					</ul>\n" +
    "					<div class=\"panel-body\">\n" +
    "						<div data-ui-view=\"comment.form\"></div>\n" +
    "						<div data-ng-repeat=\"comment in comments | orderBy:'modificationDate':true\">\n" +
    "							<div ng-include src=\"'spot/comment/comment.tpl.html'\"></div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<!-- RIGHT ZONE -->\n" +
    "			<div id=\"map-right\" class=\"col-lg-3\">\n" +
    "				<!-- 	<div class=\"col-lg-12\" style=\"text-align:center\">\n" +
    "						<span style=\"font-size:3em;font-family: 'Candal', sans-serif;\"><i class=\"fa fa-comments\"></i> 47</span>\n" +
    "					</div>\n" +
    "				</div>-->\n" +
    "				<!-- MAP -->\n" +
    "				<div class=\"panel panel-default\" ng-if=\"!editMode\">\n" +
    "					<div class=\"panel-body\">\n" +
    "						<map loc=\"{{spot.loc}}\" mode=\"{{mapMode()}}\" class=\"map\"></map>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "\n" +
    "				<!-- DATA -->\n" +
    "				<div ng-controller=\"DataController\" ng-include=\"'spot/data/data.tpl.html'\"></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- JS DOM -->\n" +
    "<script>\n" +
    "\n" +
    "	$(document).ready(function(){\n" +
    "\n" +
    "		$('.header-tabs a').click(function (e) {\n" +
    "			e.preventDefault();\n" +
    "			$(this).tab('show');\n" +
    "		})\n" +
    "		$('.header-tabs').each(function(){\n" +
    "			$(this).find('a:first').tab('show');\n" +
    "		});\n" +
    "\n" +
    "		jQuery(\"#slideshow\").amazingslider({\n" +
    "\n" +
    "			jsfolder:'/static/img/',\n" +
    "			width:690,\n" +
    "			height:500,\n" +
    "			skinsfoldername:\"\",\n" +
    "			loadimageondemand:false,\n" +
    "			isresponsive:true,\n" +
    "			autoplayvideo:false,\n" +
    "			pauseonmouseover:false,\n" +
    "			addmargin:true,\n" +
    "			randomplay:false,\n" +
    "			playvideoonclickthumb:true,\n" +
    "			slideinterval:5000,\n" +
    "			enabletouchswipe:true,\n" +
    "			transitiononfirstslide:false,\n" +
    "			loop:0,\n" +
    "			autoplay:false,\n" +
    "			navplayvideoimage:\"play-32-32-0.png\",\n" +
    "			navpreviewheight:60,\n" +
    "			timerheight:2,\n" +
    "			shownumbering:false,\n" +
    "			skin:\"Gallery\",\n" +
    "			textautohide:false,\n" +
    "			addgooglefonts:true,\n" +
    "			navshowplaypause:true,\n" +
    "			navshowplayvideo:true,\n" +
    "			navshowplaypausestandalonemarginx:8,\n" +
    "			navshowplaypausestandalonemarginy:8,\n" +
    "			navbuttonradius:0,\n" +
    "			navthumbnavigationarrowimageheight:32,\n" +
    "			navpreviewarrowheight:8,\n" +
    "			showshadow:false,\n" +
    "			navfeaturedarrowimagewidth:16,\n" +
    "			navpreviewwidth:120,\n" +
    "			googlefonts:\"Inder\",\n" +
    "			textpositionmarginright:24,\n" +
    "			bordercolor:\"#ffffff\",\n" +
    "			navthumbnavigationarrowimagewidth:32,\n" +
    "			navthumbtitlehovercss:\"text-decoration:underline;\",\n" +
    "			arrowwidth:32,\n" +
    "			texteffecteasing:\"easeOutCubic\",\n" +
    "			texteffect:\"\",\n" +
    "			navspacing:8,\n" +
    "			navarrowimage:\"navarrows-28-28-0.png\",\n" +
    "			ribbonimage:\"ribbon_topleft-0.png\",\n" +
    "			navwidth:52,\n" +
    "			showribbon:false,\n" +
    "			arrowtop:50,\n" +
    "			timeropacity:0.6,\n" +
    "			navthumbnavigationarrowimage:\"carouselarrows-32-32-0.png\",\n" +
    "			navshowplaypausestandalone:false,\n" +
    "			navpreviewbordercolor:\"#ffffff\",\n" +
    "			ribbonposition:\"topleft\",\n" +
    "			navthumbdescriptioncss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "			navborder:2,\n" +
    "			navthumbtitleheight:20,\n" +
    "			textpositionmargintop:24,\n" +
    "			navswitchonmouseover:false,\n" +
    "			playvideoimage:\"playvideo-64-64-0.png\",\n" +
    "			arrowimage:\"arrows-32-32-0.png\",\n" +
    "			textstyle:\"static\",\n" +
    "			playvideoimageheight:64,\n" +
    "			navfonthighlightcolor:\"#666666\",\n" +
    "			showbackgroundimage:false,\n" +
    "			navpreviewborder:4,\n" +
    "			navopacity:0.8,\n" +
    "			shadowcolor:\"#aaaaaa\",\n" +
    "			navbuttonshowbgimage:true,\n" +
    "			navbuttonbgimage:\"navbuttonbgimage-28-28-0.png\",\n" +
    "			textbgcss:\"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);\",\n" +
    "			playvideoimagewidth:64,\n" +
    "			bottomshadowimagewidth:110,\n" +
    "			showtimer:true,\n" +
    "			navradius:0,\n" +
    "			navshowpreview:false,\n" +
    "			navmarginy:8,\n" +
    "			navmarginx:8,\n" +
    "			navfeaturedarrowimage:\"featuredarrow-16-8-0.png\",\n" +
    "			navfeaturedarrowimageheight:8,\n" +
    "			navstyle:\"thumbnails\",\n" +
    "			textpositionmarginleft:24,\n" +
    "			descriptioncss:\"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;\",\n" +
    "			navplaypauseimage:\"navplaypause-48-48-0.png\",\n" +
    "			backgroundimagetop:-10,\n" +
    "			arrowstyle:\"mouseover\",\n" +
    "			timercolor:\"#ffffff\",\n" +
    "			numberingformat:\"%NUM/%TOTAL \",\n" +
    "			navfontsize:12,\n" +
    "			navhighlightcolor:\"#333333\",\n" +
    "			navimage:\"bullet-24-24-5.png\",\n" +
    "			navheight:52,\n" +
    "			navshowplaypausestandaloneautohide:true,\n" +
    "			navbuttoncolor:\"\",\n" +
    "			navshowarrow:false,\n" +
    "			navshowfeaturedarrow:true,\n" +
    "			titlecss:\"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;\",\n" +
    "			ribbonimagey:0,\n" +
    "			ribbonimagex:0,\n" +
    "			navshowplaypausestandaloneposition:\"bottomright\",\n" +
    "			shadowsize:5,\n" +
    "			arrowhideonmouseleave:1000,\n" +
    "			navshowplaypausestandalonewidth:48,\n" +
    "			navshowplaypausestandaloneheight:48,\n" +
    "			backgroundimagewidth:120,\n" +
    "			navcolor:\"#999999\",\n" +
    "			navthumbtitlewidth:120,\n" +
    "			navpreviewposition:\"top\",\n" +
    "			arrowheight:32,\n" +
    "			arrowmargin:8,\n" +
    "			texteffectduration:1000,\n" +
    "			bottomshadowimage:\"bottomshadow-110-95-4.png\",\n" +
    "			border:6,\n" +
    "			timerposition:\"bottom\",\n" +
    "			navfontcolor:\"#333333\",\n" +
    "			navthumbnavigationstyle:\"arrow\",\n" +
    "			borderradius:0,\n" +
    "			navbuttonhighlightcolor:\"\",\n" +
    "			textpositionstatic:\"bottom\",\n" +
    "			navthumbstyle:\"imageonly\",\n" +
    "			textcss:\"display:block; padding:8px 16px; text-align:left; \",\n" +
    "			navbordercolor:\"#ffffff\",\n" +
    "			navpreviewarrowimage:\"previewarrow-16-8-0.png\",\n" +
    "			showbottomshadow:true,\n" +
    "			navdirection:\"horizontal\",\n" +
    "			textpositionmarginstatic:0,\n" +
    "			backgroundimage:\"\",\n" +
    "			navposition:\"bottom\",\n" +
    "			navpreviewarrowwidth:16,\n" +
    "			bottomshadowimagetop:95,\n" +
    "			textpositiondynamic:\"bottomleft\",\n" +
    "			navshowbuttons:false,\n" +
    "			navthumbtitlecss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "			textpositionmarginbottom:24,\n" +
    "			transition:\"\"\n" +
    "		});\n" +
    "\n" +
    "jQuery(\".story-carousel\").each(function(){\n" +
    "	$(this).amazingslider({\n" +
    "		lightboxmode:true,\n" +
    "		lightboxid:$(this).attr('id'),\n" +
    "		jsfolder:'/static/img/',\n" +
    "		width:690,\n" +
    "		height:0,\n" +
    "		skinsfoldername:\"\",\n" +
    "		loadimageondemand:false,\n" +
    "		isresponsive:true,\n" +
    "		autoplayvideo:false,\n" +
    "		pauseonmouseover:false,\n" +
    "		addmargin:true,\n" +
    "		randomplay:false,\n" +
    "		playvideoonclickthumb:true,\n" +
    "		slideinterval:5000,\n" +
    "		enabletouchswipe:true,\n" +
    "		transitiononfirstslide:false,\n" +
    "		loop:0,\n" +
    "		autoplay:false,\n" +
    "		navplayvideoimage:\"play-32-32-0.png\",\n" +
    "		navpreviewheight:60,\n" +
    "		timerheight:2,\n" +
    "		shownumbering:false,\n" +
    "		skin:\"Gallery\",\n" +
    "		textautohide:false,\n" +
    "		addgooglefonts:true,\n" +
    "		navshowplaypause:true,\n" +
    "		navshowplayvideo:true,\n" +
    "		navshowplaypausestandalonemarginx:8,\n" +
    "		navshowplaypausestandalonemarginy:8,\n" +
    "		navbuttonradius:0,\n" +
    "		navthumbnavigationarrowimageheight:32,\n" +
    "		navpreviewarrowheight:8,\n" +
    "		showshadow:false,\n" +
    "		navfeaturedarrowimagewidth:16,\n" +
    "		navpreviewwidth:120,\n" +
    "		googlefonts:\"Inder\",\n" +
    "		textpositionmarginright:24,\n" +
    "		bordercolor:\"#ffffff\",\n" +
    "		navthumbnavigationarrowimagewidth:32,\n" +
    "		navthumbtitlehovercss:\"text-decoration:underline;\",\n" +
    "		arrowwidth:32,\n" +
    "		texteffecteasing:\"easeOutCubic\",\n" +
    "		texteffect:\"\",\n" +
    "		navspacing:8,\n" +
    "		navarrowimage:\"navarrows-28-28-0.png\",\n" +
    "		ribbonimage:\"ribbon_topleft-0.png\",\n" +
    "		navwidth:52,\n" +
    "		showribbon:false,\n" +
    "		arrowtop:50,\n" +
    "		timeropacity:0.6,\n" +
    "		navthumbnavigationarrowimage:\"carouselarrows-32-32-0.png\",\n" +
    "		navshowplaypausestandalone:false,\n" +
    "		navpreviewbordercolor:\"#ffffff\",\n" +
    "		ribbonposition:\"topleft\",\n" +
    "		navthumbdescriptioncss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "		navborder:2,\n" +
    "		navthumbtitleheight:20,\n" +
    "		textpositionmargintop:24,\n" +
    "		navswitchonmouseover:false,\n" +
    "		playvideoimage:\"playvideo-64-64-0.png\",\n" +
    "		arrowimage:\"arrows-32-32-0.png\",\n" +
    "		textstyle:\"static\",\n" +
    "		playvideoimageheight:64,\n" +
    "		navfonthighlightcolor:\"#666666\",\n" +
    "		showbackgroundimage:false,\n" +
    "		navpreviewborder:4,\n" +
    "		navopacity:0.8,\n" +
    "		shadowcolor:\"#aaaaaa\",\n" +
    "		navbuttonshowbgimage:false,\n" +
    "		navbuttonbgimage:\"navbuttonbgimage-28-28-0.png\",\n" +
    "		textbgcss:\"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);\",\n" +
    "		playvideoimagewidth:64,\n" +
    "		bottomshadowimagewidth:110,\n" +
    "		showtimer:false,\n" +
    "		navradius:0,\n" +
    "		navshowpreview:false,\n" +
    "		navmarginy:8,\n" +
    "		navmarginx:8,\n" +
    "		navfeaturedarrowimage:\"featuredarrow-16-8-0.png\",\n" +
    "		navfeaturedarrowimageheight:8,\n" +
    "		navstyle:\"thumbnails\",\n" +
    "		textpositionmarginleft:24,\n" +
    "		descriptioncss:\"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;\",\n" +
    "		navplaypauseimage:\"navplaypause-48-48-0.png\",\n" +
    "		backgroundimagetop:-10,\n" +
    "		arrowstyle:\"mouseover\",\n" +
    "		timercolor:\"#ffffff\",\n" +
    "		numberingformat:\"%NUM/%TOTAL \",\n" +
    "		navfontsize:12,\n" +
    "		navhighlightcolor:\"#333333\",\n" +
    "		navimage:\"bullet-24-24-5.png\",\n" +
    "		navheight:52,\n" +
    "		navshowplaypausestandaloneautohide:true,\n" +
    "		navbuttoncolor:\"\",\n" +
    "		navshowarrow:false,\n" +
    "		navshowfeaturedarrow:false,\n" +
    "		titlecss:\"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;\",\n" +
    "		ribbonimagey:0,\n" +
    "		ribbonimagex:0,\n" +
    "		navshowplaypausestandaloneposition:\"bottomright\",\n" +
    "		shadowsize:0,\n" +
    "		arrowhideonmouseleave:1000,\n" +
    "		navshowplaypausestandalonewidth:48,\n" +
    "		navshowplaypausestandaloneheight:48,\n" +
    "		backgroundimagewidth:120,\n" +
    "		navcolor:\"#999999\",\n" +
    "		navthumbtitlewidth:120,\n" +
    "		navpreviewposition:\"top\",\n" +
    "		arrowheight:32,\n" +
    "		arrowmargin:8,\n" +
    "		texteffectduration:1000,\n" +
    "		bottomshadowimage:\"bottomshadow-110-95-4.png\",\n" +
    "		border:6,\n" +
    "		timerposition:\"bottom\",\n" +
    "		navfontcolor:\"#333333\",\n" +
    "		navthumbnavigationstyle:\"arrow\",\n" +
    "		borderradius:0,\n" +
    "		navbuttonhighlightcolor:\"\",\n" +
    "		textpositionstatic:\"bottom\",\n" +
    "		navthumbstyle:\"imageonly\",\n" +
    "		textcss:\"display:block; padding:8px 16px; text-align:left; \",\n" +
    "		navbordercolor:\"#ffffff\",\n" +
    "		navpreviewarrowimage:\"previewarrow-16-8-0.png\",\n" +
    "		showbottomshadow:false,\n" +
    "		navdirection:\"horizontal\",\n" +
    "		textpositionmarginstatic:0,\n" +
    "		backgroundimage:\"\",\n" +
    "		navposition:\"bottom\",\n" +
    "		navpreviewarrowwidth:16,\n" +
    "		bottomshadowimagetop:95,\n" +
    "		textpositiondynamic:\"bottomleft\",\n" +
    "		navshowbuttons:false,\n" +
    "		navthumbtitlecss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "		textpositionmarginbottom:24,\n" +
    "		transition:\"\"\n" +
    "	});\n" +
    "});\n" +
    "\n" +
    "$('[class^=amazingslider-slider-]').hide();\n" +
    "$('[class^=amazingslider-nav-]').css('background-color','#f5f5f5');\n" +
    "$('.amazingslider-slider-0').show();\n" +
    "\n" +
    "});\n" +
    "\n" +
    "</script>");
}]);

angular.module("spot/topo/topo.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/topo/topo.edit.tpl.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-lg-12\">\n" +
    "		<TEXTAREA rich-text-editor ng-model=\"topo.text\" rows=\"50\" style=\"width:100%;border:0;background:none\"></TEXTAREA>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "	// var offset = $(\"#topo-tab\").offset().top - 70;\n" +
    "	// $('html, body').animate({   \n" +
    "	//   scrollTop: offset\n" +
    "	// }, 500);\n" +
    "</script>");
}]);

angular.module("spot/topo/topo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/topo/topo.tpl.html",
    "<!-- TOPO -->\n" +
    "<div class=\"panel panel-default\" id=\"topo\">\n" +
    "	<ul class=\"nav nav-tabs header-tabs\">\n" +
    "		<li><a href=\"#topo-tab\" data-toggle=\"tab2\"><b>Topo</b></a></li>\n" +
    "	</ul>\n" +
    "	<div class=\"panel-body tab-pane\" id=\"topo-tab\" data-ui-view=\"spot.topo\" autoscroll=\"false\">\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-lg-12\" data-ng-bind-html=\"safeTopoText\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "</script>");
}]);

angular.module("user/user.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/user.tpl.html",
    "<div class=\"container\">\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <!-- PANEL HEADING -->\n" +
    "        <ul class=\"nav nav-tabs header-tabs\">\n" +
    "            <li><a href=\"#profile\" data-toggle=\"profile\"><b>{{currentUser.username}}</b></a></li>\n" +
    "            <li><a href=\"#photos\" data-toggle=\"photos\"><b>Photos (134)</b></a></li>\n" +
    "            <li><a href=\"#activity\" data-toggle=\"activity\"><b>Activity</b></a></li>\n" +
    "            <li><a href=\"#settings\" data-toggle=\"settings\"><b>Settings</b></a></li>\n" +
    "        </ul>\n" +
    "        <!-- PANEL BODY -->\n" +
    "        <div class=\"tab-content\">\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"profile\">\n" +
    "	            Profile for \n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"photos\">\n" +
    "	            All Photos\n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"activity\">\n" +
    "	            Activity\n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"settings\">\n" +
    "	            Settings\n" +
    "	        </div>\n" +
    "	    </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "\n" +
    "</script>");
}]);

angular.module('templates.common', ['directives/spotList/spot.popup.tpl.html', 'directives/spotList/spot.tpl.html', 'security/login/form.tpl.html', 'security/login/toolbar.tpl.html']);

angular.module("directives/spotList/spot.popup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/spotList/spot.popup.tpl.html",
    "<div class=\"row\" style=\"width:400px\">\n" +
    "	<div class=\"spot-infos col-lg-12\" style=\"margin-bottom:15px\">\n" +
    "		<span class=\"spot-icon-container\">\n" +
    "			<button class=\"btn btn-default btn-select\">\n" +
    "				<span style=\"font-size:1.2em;\">\n" +
    "					<b>{{spot.index}}</b>\n" +
    "				</span>\n" +
    "			</button>\n" +
    "		</span>\n" +
    "		<div class=\"spot-info-container\">\n" +
    "			<h4 class=\"list-group-item-heading\">\n" +
    "				<a href=\"#/spot/{{spot._id}}\" role=\"spot-title\"><b>{{spot.title}}</b></a>\n" +
    "				<div id=\"map-tags-container\">        \n" +
    "					<span id=\"map-tags\">\n" +
    "						<span style=\"display:inline-block\">\n" +
    "							<!--<span ng-class=\"tagClass($index)\">{{tag}}</span>-->\n" +
    "							<small>4, Place de Damloup, 31000 Toulouse, France</small>\n" +
    "						</span> \n" +
    "					</span> \n" +
    "				</div>\n" +
    "			</h4>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix\"></div>\n" +
    "	<div class=\"panel-default\" style=\"margin-bottom:-14px;margin-left:-5px;margin-right:-5px;\">\n" +
    "		<div class=\"panel-heading\" style=\"border:0;border-radius:0\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-xs-7\">\n" +
    "					<i class=\"icon icon_swimming fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_biking fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_skiing fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i>\n" +
    "				</div>\n" +
    "				<div class=\"col-xs-3 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>32</b></h4><small>COMMENTS</small></div>\n" +
    "				<div class=\"col-xs-2 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>1,324</b></h4><small>LOVES</small></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("directives/spotList/spot.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/spotList/spot.tpl.html",
    "<div class=\"panel panel-default\" role=\"spot-item\" style=\"margin-bottom:8px\" id=\"spot-{{_id}}\" ng-class=\"{'spot-selected': isSelected}\">\n" +
    "  <div class=\"panel-body\" ng-click=\"isSelected=true\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"spot-infos col-lg-12\" ng-mouseover=\"isSelected=true\">\n" +
    "        <span class=\"spot-icon-container visible-lg visible-sm visible-md\">\n" +
    "          <button class=\"btn btn-default btn-select\"><span style=\"font-size:1.2em;\"><b>{{displayIndex}}</b></span></button>\n" +
    "        </span>\n" +
    "        <div class=\"spot-info-container\" id=\"spot-info-{{id}}\">\n" +
    "          <!-- <button class=\"btn btn-default pull-right\" ng-click=\"selectSpot(spot)\"><i class=\"icon-map-marker icon-large\"></i></button> -->\n" +
    "          <h4 class=\"list-group-item-heading\">\n" +
    "            <div class=\"pull-right\">\n" +
    "              \n" +
    "            </div>\n" +
    "            <a ui-sref=\"spot({ id:_id })\" role=\"spot-title\" ng-click=\"$event.stopPropagation()\"><b>{{title}}</b></a></br>\n" +
    "            <div id=\"map-tags-container\">        \n" +
    "              <span id=\"map-tags\">\n" +
    "                <span style=\"display:inline-block\">\n" +
    "                  <!--<span ng-class=\"tagClass($index)\">{{tag}}</span>-->\n" +
    "                  <small>{{address.value}}</small>\n" +
    "                </span> \n" +
    "              </span> \n" +
    "            </div>\n" +
    "          </h4>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-7\">\n" +
    "        <i class=\"icon icon_swimming fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_biking fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_skiing fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"col-xs-3 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>32</b></h4><small>COMMENTS</small></div>\n" +
    "      <div class=\"col-xs-2 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>1,324</b></h4><small>LOVES</small></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("security/login/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/form.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <h4>Sign in</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"alert alert-warning\" ng-show=\"authReason\">\n" +
    "        {{authReason}}\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-error\" ng-show=\"authError\">\n" +
    "        {{authError}}\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info\">Please enter your login details</div>\n" +
    "    <form name=\"user.form\" novalidate class=\"login-form form-inline\">\n" +
    "        <fieldset>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control input-lg\" style=\"width:228px\" placeholder=\"E-mail\" name=\"username\" ng-model=\"user.username\" type=\"email\" required autofocus>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control input-lg\" style=\"width:228px\" placeholder=\"Password\" name=\"password\" type=\"password\" ng-model=\"user.password\" value=\"\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"btn btn-lg btn-success\" type=\"submit\" ng-click=\"login()\" value=\"Login\">\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "    <h4 style=\"text-align:center\">or</h4>\n" +
    "    <a class=\"btn btn-lg btn-primary btn-block\" id=\"sign-in-google\"><i class=\"fa fa-google-plus\"></i> Sign In with Google</a>\n" +
    "    <a class=\"btn btn-lg btn-primary btn-block\" id=\"sign-in-twitter\"><i class=\"fa fa-twitter\"></i> Sign In with Twitter</a>\n" +
    "    \n" +
    "</div>");
}]);

angular.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/toolbar.tpl.html",
    "<ul class=\"pull-right nav navbar-nav visible-lg visible-md visible-sm\">\n" +
    "	<li ng-if=\"!isAuthenticated()\"><a ng-click=\"login()\">Sign In</a></li>\n" +
    "	<form ng-if=\"!isAuthenticated()\" class=\"navbar-form navbar-left\" role=\"signup\">\n" +
    "	    <button type=\"submit\" class=\"btn btn-success\">Sign Up</button>\n" +
    "	</form>\n" +
    "	<!-- else -->\n" +
    "    <li ng-if=\"isAuthenticated()\"><a ui-sref=\"activity\"><i class=\"icon-globe icon-large\"></i> Activity</a></li>\n" +
    "    <li ng-if=\"isAuthenticated()\" class=\"dropdown nav-img\">\n" +
    "        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><img src=\"static/img/Avatar-128.png\" class=\"img-small\"> {{currentUser.username}}</a>\n" +
    "        <ul class=\"dropdown-menu\">\n" +
    "          <li><a ui-sref=\"user\">Profile</a></li>\n" +
    "          <li><a ng-click=\"logout()\">Logout</a></li>\n" +
    "        </ul>\n" +
    "    </li>\n" +
    "</ul>");
}]);
