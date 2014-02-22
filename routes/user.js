var passport = require('passport')
    , security = require('../config/security');

exports.postLogin = function(req,res,next){
  security.login(req,res,next);
}

exports.postLogout = function(req,res,next){
  security.logout(req,res,next);
}

exports.authenticatedUser = function(req, res) {
  security.authenticationRequired(req, res, function() { security.sendCurrentUser(req, res); });
}

exports.adminUser = function(req, res) {
  security.adminRequired(req, res, function() { security.sendCurrentUser(req, res); });
}

exports.currentUser = function(req, res) {
  security.sendCurrentUser(req,res);
}