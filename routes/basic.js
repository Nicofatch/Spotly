exports.app = function(req, res) {
	res.render("appPage", {
	  title: Constants.APP_NAME,
	  user: req.user,
	  message: req.session.messages,
	  navbar: {
	  	fixed: false,
	  	search: false
	  }
	});
  	req.session.messages = null;
};

exports.home = function(req, res) {
	res.render("homepage", {
	  title: Constants.APP_NAME,
	  user: req.user,
	  message: req.session.messages,
	  navbar: {
	  	fixed: false,
	  	search: false
	  }
	});
  	req.session.messages = null;
};

exports.maps = function(req,res) {
	res.render("maps", {
	  title: Constants.APP_NAME,
	  user: req.user,
	  message: req.session.messages,
	  navbar: {
	  	fixed: true,
	  	search: true
	  }
	});
  	req.session.messages = null;	
}

exports.explore = function(req,res) {
	res.render("explore", {
	  title: Constants.APP_NAME,
	  user: req.user,
	  message: req.session.messages,
	  navbar: {
	  	fixed: true,
	  	search: true
	  }
	});
  	req.session.messages = null;	
}

exports.spot = function(req,res) {
	res.render("spot", {
	  title: Constants.APP_NAME,
	  user: req.user,
	  message: req.session.messages,
	  navbar: {
	  	fixed: false,
	  	search: true
	  }
	});
  	req.session.messages = null;	
}
