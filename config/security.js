var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./dbschema');

var filterUser = function(user) {
  if ( user ) {
    return {
      user : {
        id: user._id.$oid,
        email: user.email,
        username: user.username,
        admin: user.admin
      }
    };
  } else {
    return { user: null };
  }
};

exports.initialize = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.userModel.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(function(username, password, done) {
    db.userModel.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }));
}

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
// exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login?url='+ req.url.replace('#','%hash%'));
// }

exports.authenticationRequired = function(req, res, next) {
    console.log('authRequired');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
}
exports.adminRequired = function(req, res, next) {
    console.log('adminRequired');
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.json(401, filterUser(req.user));
    }
}
exports.sendCurrentUser = function(req, res, next) {
    res.json(200, filterUser(req.user));
    res.end();
}

exports.login = function(req, res, next) {
    function authenticationFailed(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json(filterUser(user)); }
      req.logIn(user, function(err) {
        if ( err ) { return next(err); }
        return res.json(filterUser(user));
      });
    }
    return passport.authenticate('local', authenticationFailed)(req, res, next);
}

exports.logout = function(req, res, next) {
    req.logout();
    res.send(204);
}



// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
// exports.ensureAdmin = function ensureAdmin(req, res, next) {
//   return function(req, res, next) {
// 	      if(req.user && req.user.admin === true)
//             next();
//         else
//             res.send(403);
//     }
// }