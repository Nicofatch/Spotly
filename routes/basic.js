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