angular.module('I18N',[])
  .constant('I18N.MESSAGES', {
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}.",
  'spot.data.update.success': "Spot data successfully updated",
  'errors.route.changeError': "Route change error",
  'login.reason.notAuthorized':"You are not authorized to perform this action.",
  'login.reason.notAuthenticated':"You must be authenticated to perform this action."
 });