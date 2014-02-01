var passport = require('passport')
    , url = require('url');

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};


exports.admin = function(req, res) {
  res.send('access granted admin!');
};

exports.getLogin = function(req, res) {
  res.render('loginForm', {
    user: req.user,
    message: req.session.messages,
    title:'Sign In',
    navbar: {
      fixed: false,
      search: false
    }
  });
  req.session.messages = null;
};

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.session.messages = null;
      if (req.body.redirectUrl) { return res.redirect(req.body.redirectUrl); }
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};