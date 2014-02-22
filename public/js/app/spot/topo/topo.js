angular.module('spot.topo',['ui.bootstrap.rating'])
.controller('TopoController', ['$scope','$state','$sce', function ($scope, $state, $sce) {
  
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
    $scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);
    $state.go('spot');
  }
  

  $scope.topo = {
    text:'<h1>CHAT</h1>',
    data:[
      {
        key:'Length',
        value:'12',
        type:'km'
      },
      {
        key:'Duration',
        value:'20',
        type:'min'
      },
      {
        key:'Difficulty',
        value:'4',
        type:'stars'
      }
    ]
   }

   $scope.safeTopoText = $sce.trustAsHtml($scope.topo.text);
}])
.controller('TopoEditController', function ($scope, $state, $stateParams) {

   

   $scope.topo.addData = function() {
    var newData = {
      key: 'Title',
      value: 'Value',
      type: 'km'
    };
    $scope.topo.data.push(newData);    
   }

   $scope.topo.removeData = function(index) {
    $scope.topo.data.splice(index,1);
   }

  
});

