angular.module('spot.data',['ui.bootstrap.rating'])
//.value('$anchorScroll', angular.noop)
.controller('DataController', function ($scope, $state, spotsService) {

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


  $scope.save = function() {
    spotsService.updateData($scope.data).then(function(data) {
      // Nothing
    });
    $state.go('spot');
  }

})
.controller('DataEditController', function ($scope, $state) {

 $scope.addData = function() {
  var newData = {
    key: '',
    value: '',
    type: 'km'
  };
  $scope.data.table.push(newData);
}

$scope.changeType = function(index,type) {
  $scope.data.table[index].type = type;
}

$scope.removeData = function(index) {
  $scope.data.table.splice(index,1);
}


});

