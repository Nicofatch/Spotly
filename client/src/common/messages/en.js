angular.module('I18N',[])
  .constant('I18N.MESSAGES', {
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}.",
  'spot.data.update.success': "Spot data successfully updated",
  'errors.route.changeError': "Route change error",
  'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
 });