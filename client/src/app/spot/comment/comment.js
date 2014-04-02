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
