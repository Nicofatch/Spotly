angular.module('security.login.form', [])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
.controller('LoginFormController', ['$scope', '$modal','security', function($scope, $modalInstance, security) {

  // The model for this form 
  // $scope.user = {};
 
  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( security.getLoginReason() ) {
    $scope.authReason = ( security.isAuthenticated() ) ?
      /*localizedMessages.get('login.reason.notAuthorized')*/'login.reason.notAuthorized' :
      /*localizedMessages.get('login.reason.notAuthenticated')*/'login.reason.notAuthenticated' ;
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
        //$scope.authError = localizedMessages.get('login.error.invalidCredentials');
        $scope.authError = 'login.error.invalidCredentials';
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
