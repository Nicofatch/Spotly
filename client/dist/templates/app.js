angular.module('templates.app', ['activity/activity.tpl.html', 'explore/explore.tpl.html', 'home/home.tpl.html', 'navbar/navbar.tpl.html', 'notifications/notifications.tpl.html', 'spot/comment/comment.edit.tpl.html', 'spot/comment/comment.tpl.html', 'spot/data/data.edit.tpl.html', 'spot/data/data.tpl.html', 'spot/header/header.edit.tpl.html', 'spot/header/header.tpl.html', 'spot/spot.edit.tpl.html', 'spot/spot.new.tpl.html', 'spot/spot.tpl.html', 'spot/topo/topo.edit.tpl.html', 'spot/topo/topo.tpl.html', 'user/user.tpl.html']);

angular.module("activity/activity.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("activity/activity.tpl.html",
    "<div class=\"container\">\n" +
    "	<div class=\"panel panel-default\">\n" +
    "		<!-- PANEL HEADING -->\n" +
    "		<div class=\"panel-heading\">\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<!-- PANEL BODY -->\n" +
    "		<div class=\"panel-body\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("explore/explore.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("explore/explore.tpl.html",
    "<div style=\"margin-bottom:70px\">\n" +
    "  <div id=\"spots-left-bar\">\n" +
    "\n" +
    "    <div class=\"panel panel-default\" style=\"margin-bottom:0px\">\n" +
    "      <div class=\"panel-body\">\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "          <a style=\"width:45px;\" ng-click=\"openModal()\" class=\"btn btn-default btn-lg\"><i class=\"fa fa-link\"></i></a>\n" +
    "          <a style=\"display:none\"  class=\"btn btn-default btn-lg\" ng-click=\"explore()\"><i style=\"font-size:1em;\" class=\"fa fa-arrow-right\"></i></a>\n" +
    "        </div>\n" +
    "        <span >\n" +
    "          <h1 id=\"map-title\" class=\"\">Explore</h1>\n" +
    "          <p>Results for <b>{{k.value}}</b> around <b>{{l.value}}</b> </p>\n" +
    "        </span>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div spot-list>\n" +
    "      <map style=\"position:fixed;right:0;left:0;top:51px;bottom:0;z-index:-1\" mode=\"explore\" location=\"{{location}}\" onPopupOpen=\"onPopupOpen\"></map> \n" +
    "      <div data-ng-repeat=\"spot in spots\" spot-item spot=\"{{spot}}\" index=\"{{$index}}\" last=\"{{$last}}\" on-like=\"like($index)\" is-selected=\"{{spot.isSelected}}\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- <script type=\"text/ng-template\" id=\"myModalContent.html\">\n" +
    "    <div class=\"modal-header\">\n" +
    "        <h3>I'm a modal!</h3>\n" +
    "    </div>\n" +
    "    <div class=\"modal-body\">\n" +
    "        <ul>\n" +
    "           CHAT\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button>\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    </div>\n" +
    "</script> -->");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div style=\"background:white\">\n" +
    "	<section class=\"home-slider-top\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-lg-12\">\n" +
    "					<div class=\"home-slider-top-text\">\n" +
    "						<h1><i class=\"fa fa-map-marker\"></i> Spotly</h1>\n" +
    "						<h3 style=\"font-family: 'Norican', cursive;font-size:3em\">Find places to enjoy your favorite sports</h3>\n" +
    "					</div>\n" +
    "\n" +
    "					<form role=\"explore\" class=\"\" id=\"home-explore-form\" novalidate>\n" +
    "						<div class=\"form-group pull-left\" style=\"width:303px;margin-left:15px;\">\n" +
    "							<div class=\"input-group\">\n" +
    "								<span class=\"input-group-addon input-lg\"><i class=\"fa fa-map-marker\"></i></span>\n" +
    "								<input tag-autocomplete=\"{{tagsAutocompleteOptions}}\" id=\"k\" type=\"text\" name=\"k\" ng-model=\"search.k\" class=\"form-control input-lg\" placeholder=\"Search\" autofocus>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div class=\"search-location form-group pull-left\" style=\"width:303px;margin-left:15px;\">\n" +
    "							<div class=\"input-group\">\n" +
    "								<span class=\"input-group-addon input-lg\"><i class=\"fa fa-location-arrow\"></i></span>\n" +
    "								<input loc-autocomplete type=\"text\" name=\"l\" id=\"l\" ng-model=\"search.l\" class=\"form-control input-lg\"  placeholder=\"Around\">\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<button id=\"search-button\" ng-click=\"explore()\" class=\"btn btn-success btn-lg\" style=\"margin-left:15px;\"> <i class=\"fa fa-search fa fa-white\"></i> <b>FIND SPOTS</b></button>\n" +
    "					</form>\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "		\n" +
    "		</div>\n" +
    "	</section><!-- \n" +
    "	<section id=\"explore\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>What can I do ?</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/980-riding.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1010-surf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1013-rock-climbing.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1019-bmx.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1025-runner.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1038-diving.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "\n" +
    "			<br/>\n" +
    "\n" +
    "			<div class=\"row\">\n" +
    "\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1812-snowboard.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2540-windsurf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2554-race-car.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/3656-canoe-kayak.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/2554-race-car.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/3656-canoe-kayak.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "			</div>\n" +
    "\n" +
    "			<br/>\n" +
    "\n" +
    "			<div class=\"row\">\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5339-yoga.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5400-backpacker.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/5421-rafting.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "				\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/980-riding.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1010-surf.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-2 services-info\">\n" +
    "					<img src=\"/img/1013-rock-climbing.jpg\" class=\"img-thumbnail\" style=\"border:0\">\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section> -->\n" +
    "	<section id=\"services\">\n" +
    "			\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>What can I do ?</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-map-marker\"></i>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Spot places</h4>\n" +
    "						<p>Share sport-related points of interest.</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-search\"></i>\n" +
    "						</span>	\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Find any spots around</h4>\n" +
    "						<p>Find sporting activities around you.</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			\n" +
    "				<div class=\"col-lg-4 services-info\">\n" +
    "					<div class=\"ico\">\n" +
    "						<span class=\"fa fa-stack fa fa-5x\">\n" +
    "							<i class=\"shadow fa fa-circle fa fa-muted fa fa-stack-base\"></i>\n" +
    "							<i class=\"fa fa-comments\"></i>\n" +
    "						</span>\n" +
    "					</div>\n" +
    "					<div class=\"desc\">\n" +
    "						<h4>Grow a community</h4>\n" +
    "						<p>Meet and exchange with people that share your passion</p>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section>\n" +
    "\n" +
    "	<section id=\"get-started\">\n" +
    "		<div class=\"container\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"content-head\">\n" +
    "					<h2>Let's get started</h2>\n" +
    "					<div class=\"line\"></div>\n" +
    "				</div>\n" +
    "				<div class=\"col-lg-4 col-lg-offset-4\">\n" +
    "					<a href=\"#\" class=\"btn btn-success btn-lg\" style=\"width:100%\">Find sports spots around my location</a>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</section>\n" +
    "</div>\n" +
    "\n" +
    "<footer>\n" +
    "	<div class=\"footer\">\n" +
    "		<p>© 2013. <a href=\"#\">Spotly.</a> All rights reserved.</p>\n" +
    "	</div>\n" +
    "</footer>\n" +
    "\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "	/*$('#main-slider').flexslider({\n" +
    "		animation: \"fade\",\n" +
    "		slideshowSpeed: 7000\n" +
    "	});*/\n" +
    "\n" +
    "	//locationAutocomplete($('#l'));\n" +
    "	//tagAutocomplete($('#k'));\n" +
    "	var hp = ['hp1.jpg','hp2.jpg'];\n" +
    "	$('.home-slider-top').css('background-image','url(../static/img/'+hp[Math.floor(Math.random() * hp.length)]+')');\n" +
    "	$('.home-slider-top').css('background-position','center');\n" +
    "	$('.home-slider-top').css('background-repeat','no-repeat');\n" +
    "\n" +
    "});\n" +
    "</script>");
}]);

angular.module("navbar/navbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("navbar/navbar.tpl.html",
    "<nav class=\"navbar navbar-default\" ng-class=\"{'navbar-fixed-top':fixed, 'navbar-unfixed-top':!fixed}\" role=\"navigation\" style=\"min-width:970px\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "       <!-- APP TITLE -->\n" +
    "       \n" +
    "        <a class=\"navbar-brand\" ui-sref=\"home\" style=\"font-family: 'Grand Hotel', cursive;font-size:2em;padding:13px 15px\">\n" +
    "            <i ng-show=\"hasPendingRequests()\" class=\"fa fa-spinner fa-spin fa-fw\"></i>\n" +
    "            <i ng-show=\"!hasPendingRequests()\" class=\"fa fa-map-marker fa-fw\"></i> Spotly</a>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n" +
    "        <div ng-if=\"search\">\n" +
    "            <form class=\"navbar-form navbar-left\" style=\"float:left;margin-bottom:0px;margin-top:10px;\" role=\"explore\" ng-controller=\"ExploreFormController\">\n" +
    "                <div id=\"nav-search-spot\" class=\"form-group\" style=\"margin-bottom:0px;float:left;width:303px;margin-right:10px\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"><i class=\"fa fa-map-marker\"></i></span>\n" +
    "                        <input type=\"text\" tag-autocomplete=\"{{tagsAutocompleteOptions}}\" class=\"form-control\" style=\"height:34px;line-height:1.428571429;font-size:14px;\" id=\"k\" name=\"k\" ng-model=\"k\" placeholder=\"Search\"/>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div id=\"nav-search-location\" class=\"form-group\" style=\"margin-bottom:0px;float:left;width:303px;margin-right:10px\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"><i class=\"fa fa-location-arrow\"></i></span>\n" +
    "                        <input type=\"text\" loc-autocomplete class=\"form-control\" style=\"height:34px;line-height:1.428571429;font-size:14px;\" id=\"l\" name=\"l\" placeholder=\"Around\" ng-model=\"l\" />\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button id=\"nav-search-button\" ng-click=\"explore()\" type=\"submit\" class=\"btn btn-primary\" style=\"height:34px;line-height:1.428571429;font-size:14px;\"> <i class=\"fa fa-search fa fa-white\"></i></input>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        \n" +
    "            <login-toolbar></login-toolbar>\n" +
    "    </div>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("notifications/notifications.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("notifications/notifications.tpl.html",
    "<div ng-class=\"['alert', 'alert-'+notification.type]\" ng-repeat=\"notification in notifications.getCurrent()\">\n" +
    "    <button class=\"close\" ng-click=\"removeNotification(notification)\">x</button>\n" +
    "    {{notification.message}}\n" +
    "</div>");
}]);

angular.module("spot/comment/comment.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/comment/comment.edit.tpl.html",
    "<div style=\"overflow:auto;margin-bottom:15px\" id=\"comment-new\">\n" +
    "	<a class=\"pull-left\" href=\"#\">\n" +
    "		<img src=\"static/img/avatar_default.jpg\" class=\"img-rounded media-object story-avatar\">\n" +
    "	</a>\n" +
    "	<div style=\"width:83%; margin-left:100px\">\n" +
    "		<form role=\"form\" ng-submit=\"insertComment()\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-lg-12\">\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.title\" class=\"sr-only\">Title</label>\n" +
    "						<input type=\"text\" id=\"comment.title\" placeholder=\"Title\" data-ng-model=\"comment.title\" class=\"form-control\" autofocus=\"autofocus\">\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.body\" class=\"sr-only\">Type your story here</label>\n" +
    "						<textarea rows=\"4\" id=\"comment.body\" placeholder=\"Type your story here\" data-ng-model=\"comment.body\" class=\"form-control\"></textarea>\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<label for=\"comment.pictures\" class=\"sr-only\">Photos</label>\n" +
    "						<div ng-file-drop=\"onFileSelect($files)\" ng-file-drag-over-class=\"dragover\" ng-show=\"dropSupported\" class=\"drop-box\">\n" +
    "							<h4><i class=\"fa fa-camera fa fa-2x\" style=\"color:#aaa\"></i></h4>\n" +
    "							<h4 style=\"color:#aaa\">Drop your photos here</h4>\n" +
    "						</div>\n" +
    "						<div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">HTML5 Drop File is not supported!</div>\n" +
    "					</div>\n" +
    "					<div ng-repeat=\"upload in uploads\" class=\"form-group\">\n" +
    "						<div class=\"upload-progress panel panel-default panel-body\">\n" +
    "							<div class=\"col-lg-7\" style=\"padding-left:0\"><b>{{upload.name}} - {{upload.progress}}</b></div>\n" +
    "							<div class=\"progress col-lg-4\" style=\"margin-bottom:0;padding:0\">\n" +
    "								<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{upload.progress}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:{{upload.progress}}%\">\n" +
    "									<span class=\"sr-only\">{{upload.progress}}% Complete</span>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"pull-right\"><i class=\"fa fa-remove\"></i></div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "					<div class=\"form-group\">\n" +
    "						<button data-ng-disabled=\"!enableAddStory()\" class=\"btn btn-success\">Add Story</button>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "	var offset = $(\"#comment-new\").offset().top - 70;\n" +
    "	$('html, body').animate({   \n" +
    "	  scrollTop: offset\n" +
    "	}, 500);\n" +
    "</script>");
}]);

angular.module("spot/comment/comment.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/comment/comment.tpl.html",
    "<div style=\"overflow:auto;margin-bottom:15px\" ng-controller=\"CommentController\">\n" +
    "	<a class=\"pull-left\" href=\"#\">\n" +
    "		<img src=\"static/img/avatar_default.jpg\" class=\"img-rounded media-object story-avatar\">\n" +
    "	</a>\n" +
    "	<div class=\"timeline-panel\">\n" +
    "		<div class=\"timeline-heading\">\n" +
    "			<h4 class=\"timeline-title\">{{comment.title}}</h4>\n" +
    "			<p><small class=\"text-muted\"><i class=\"fa fa-time\"></i> {{comment.creationDate}}</small></p>\n" +
    "		</div>\n" +
    "		<div class=\"timeline-body\">\n" +
    "			<p>{{comment.body}}</p>\n" +
    "			<div style=\"display:block;position:relative;margin: 10px -20px 0; padding-left:-20px; background-color:#f5f5f5;height:65px;\" ng-show=\"atLeastOnePicture()\">\n" +
    "				<div style=\"\" id=\"story-carousel-{{comment._id}}\" class=\"story-carousel\">\n" +
    "					<ul class=\"amazingslider-slides\" style=\"display:none;\">\n" +
    "						<li data-ng-repeat=\"picture in comment.pictures\">\n" +
    "							<img ng-src=\"/uploads/{{picture.url}}\"/>\n" +
    "						</li>\n" +
    "					</ul>\n" +
    "					<ul class=\"amazingslider-thumbnails\" style=\"display:none;\">\n" +
    "						<li data-ng-repeat=\"picture in comment.pictures\">\n" +
    "							<img ng-src=\"/uploads/{{picture.url}}\"/>\n" +
    "						</li>\n" +
    "						<div display-slider slider-id=\"story-carousel-{{comment._id}}\"></div>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div style=\"display:block;position:relative;margin: 10px -20px 0; padding-left:-20px; background-color:#f5f5f5;height:10px;\" ng-show=\"!atLeastOnePicture()\">\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("spot/data/data.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/data/data.edit.tpl.html",
    "<table class=\"table table-striped\" style=\"margin-bottom:0\">\n" +
    "	<tbody>\n" +
    "		<tr ng-repeat=\"data in data.table\">\n" +
    "			<td>\n" +
    "				<input type=\"text\" ng-model=\"data.key\" class=\"form-control input-sm\" style=\"width:29%;float:left;margin-right:6px;display:inline-block;\"></input>\n" +
    "				<!-- if != stars -->\n" +
    "				<input ng-if=\"data.type != 'stars'\" type=\"text\" ng-model=\"data.value\" class=\"form-control input-sm\" style=\"width:28%;text-align:right;float:left;margin-right:6px;display:inline-block;\"></input>\n" +
    "				<!-- if == stars -->\n" +
    "				<rating ng-if=\"data.type == 'stars'\" value=\"data.value\" max=\"max\" readonly=\"isReadonly\" on-hover=\"hoveringOver(value)\" rating-states=\"ratingStates\" on-leave=\"overStar = null\" style=\"margin-right:6px;float:left;padding-top:6px;padding-left:6px;font-size:1.2em\"></rating>\n" +
    "				\n" +
    "				<div style=\"float:right\">\n" +
    "					<div class=\"btn-group\">\n" +
    "						<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "							<i class=\"fa fa-bars\"></i>\n" +
    "						</button>\n" +
    "						<ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "							<li><a href ng-click=\"removeData($index)\"><i class=\"fa fa-trash-o\"></i> Remove data</a></li>\n" +
    "						</ul>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				<div class=\"btn-group\" style=\"float:right;margin-right:6px\">\n" +
    "					<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" style=\"width:54px\">\n" +
    "						{{data.type}}\n" +
    "					</button>\n" +
    "					<ul class=\"dropdown-menu pull-right\" role=\"menu\">\n" +
    "						<li><a href ng-click=\"changeType($index,'km')\">Kilometer (km)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'m')\">Meter (m)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'day')\">Day</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'h')\">Hour (h)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'min')\">Minute (min)</a></li>\n" +
    "						<li><a href ng-click=\"changeType($index,'stars')\"><i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> <i class=\"fa fa-star\"></i> (stars)</a></li>\n" +
    "					</ul>\n" +
    "				</div>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "		<tr>\n" +
    "			<td style=\"text-align:center\"><a href ng-click=\"addData()\">Add new data</a></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "</table>");
}]);

angular.module("spot/data/data.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/data/data.tpl.html",
    "<!-- DATA -->\n" +
    "<div class=\"panel panel-default\" id=\"data\">\n" +
    "	<ul class=\"nav nav-tabs header-tabs\">\n" +
    "		<li><a href=\"#data-tab\" data-toggle=\"tab2\"><b>Data</b></a></li>\n" +
    "	</ul>\n" +
    "	<div data-ui-view=\"spot.data\" autoscroll=\"false\">\n" +
    "		<table class=\"table table-striped\" style=\"margin-bottom:0\">\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"data in data.table\">\n" +
    "					<td ng-if=\"data.type != 'stars'\">{{data.key}} <span class=\"pull-right\"><b>{{data.value}} {{data.type}}</b></span></td>\n" +
    "					<td ng-if=\"data.type == 'stars'\">{{data.key}} \n" +
    "						<span class=\"pull-right\">\n" +
    "							<rating value=\"data.value\" max=\"max\" readonly=\"true\" on-hover=\"hoveringOver(value)\" rating-states=\"ratingStates\" on-leave=\"overStar = null\" style=\"margin-left:8px;font-size:1.2em\"></rating>\n" +
    "						</span>\n" +
    "					</td>\n" +
    "				</tr>\n" +
    "			</tbody>\n" +
    "		</table>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "</script>");
}]);

angular.module("spot/header/header.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/header/header.edit.tpl.html",
    "<div class=\"form-group\">\n" +
    "	<strong><input class=\"form-control input-lg\" ng-model=\"spot.title\" placeholder=\"Spot Title\"></input></strong>\n" +
    "</div>\n" +
    "<input loc-autocomplete class=\"form-control\" ng-model=\"spot.address\" ng-change=\"updateMarker()\" placeholder=\"Spot Location\"></input>");
}]);

angular.module("spot/header/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/header/header.tpl.html",
    "<div ui-view=\"spot.header\" autoscroll=\"false\">\n" +
    "	<div class=\"pull-left\">\n" +
    "		<h1 style=\"margin-top:0;margin-bottom:0\">\n" +
    "			<strong>{{spot.title}}</strong>\n" +
    "		</h1>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\" autoscroll=\"false\">\n" +
    "		<a class=\"btn btn-default\" href ng-click=\"edit()\"><small><i class=\"fa fa-edit\"></i></small> Edit</a>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\">\n" +
    "		<button class=\"btn btn-default\" type=\"button\"><i class=\"fa fa-bookmark\"></i> <b>SAVE</b></button>\n" +
    "	</div>\n" +
    "	<div class=\"pull-right\">\n" +
    "		<div class=\"btn btn-group\" style=\"padding:0\">\n" +
    "			<button class=\"btn btn-default\" type=\"button\" ng-click=\"like()\" ><i class=\"fa fa-heart\"></i></button>\n" +
    "			<button class=\"btn btn-default\" type=\"button\" disabled><b>{{spot.likes.length}}</b></button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div style=\"clear:both\"></div>\n" +
    "	<p style=\"margin-bottom:0;margin-top:7px\" class=\"pull-left\"><i class=\"fa fa-home\"></i> {{spot.address.value}}</p>\n" +
    "	<div class=\"pull-right\" style=\"padding-left:8px\">\n" +
    "		<div class=\"input-group\" style=\"width:180px\">\n" +
    "			<input type=\"text\" class=\"form-control\" value=\"{{url}}\">\n" +
    "			<span class=\"input-group-btn\">\n" +
    "				<a class=\"btn btn-default addthis_button_compact\" type=\"button\" addthis:ui_click=\"true\"><b>SHARE IT</b></a>\n" +
    "			</span>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div style=\"clear:both\"></div>\n" +
    "</div>\n" +
    "<script type=\"text/javascript\">\n" +
    "	var addthis_config = {\"data_track_addressbar\":true};\n" +
    "	addthis_config.ui_offset_top = 10;\n" +
    "</script>\n" +
    "<script type=\"text/javascript\" src=\"//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-520613fc20d317d5\"></script>");
}]);

angular.module("spot/spot.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.edit.tpl.html",
    "<div class=\"panel panel-default panel-body\">\n" +
    "	<h3 style=\"margin:0\">\n" +
    "		<span class=\"label label-primary\">EDIT MODE</span>\n" +
    "		<div class=\"pull-right\" style=\"padding-left:8px\" autoscroll=\"false\">\n" +
    "			<button class=\"btn btn-success\" ng-click=\"save()\">SAVE CHANGES</button>\n" +
    "		</div>\n" +
    "	</h3>\n" +
    "</div>");
}]);

angular.module("spot/spot.new.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.new.tpl.html",
    "html");
}]);

angular.module("spot/spot.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/spot.tpl.html",
    "<div class=\"container\">\n" +
    "	\n" +
    "	<div ui-view=\"spot.edit.toolbar\" autoscroll=\"false\"></div>\n" +
    "\n" +
    "	<div class=\"panel panel-default\">\n" +
    "		<!-- PANEL HEADING -->\n" +
    "		<div class=\"panel-heading\" ng-controller=\"SpotHeaderController\" ng-include=\"'spot/header/header.tpl.html'\"></div>\n" +
    "\n" +
    "		<!-- PANEL BODY -->\n" +
    "		<div class=\"panel-body\">\n" +
    "			<div  style=\"padding:0\" id=\"map-left\" class=\"col-lg-12\" ng-if=\"editMode\">\n" +
    "				<div class=\"panel panel-default\">\n" +
    "					<div class=\"panel-body\">\n" +
    "						<map loc=\"{{spot.loc}}\" mode=\"{{mapMode()}}\" on-move=\"updateAddress(loc)\" class=\"map\"></map>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<div  style=\"clear:both\" id=\"map-left\" class=\"col-lg-9\">      \n" +
    "				<div class=\"panel panel-default panel-body\" ng-if=\"!editMode\">\n" +
    "					<div class=\"row\">\n" +
    "						<img src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\" class=\"col-lg-5\">\n" +
    "						<div class=\"col-lg-7\">\n" +
    "							<div style=\"margin-bottom:7px\">\n" +
    "								<i class=\"icon icon_trekking fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "								<i class=\"icon icon_skiing fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "								<i class=\"icon icon_swimming fa-3x img-thumbnail fa-fw\" style=\"color:#031634\"></i>\n" +
    "							</div>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-lg-4\">\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">{{spot.likes.length}}</h4>\n" +
    "									<small>LOVES</small>\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">{{comments.length}}</h4>\n" +
    "									<small>COMMENTS</small>\n" +
    "									<h4 style=\"font-size:2.5em;font-weight:bold;margin-bottom:1px\">12,423</h4>\n" +
    "									<small>VIEWS</small>\n" +
    "								</div>\n" +
    "								<div class=\"col-lg-8\">\n" +
    "									\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "					<div style=\"display:block;position:relative;margin: 10px -15px -14px; padding-left:-20px; background-color:#f5f5f5;height:65px;\">\n" +
    "						<div id=\"carousel-spot\" class=\"story-carousel\">\n" +
    "							<ul class=\"amazingslider-slides\" style=\"display:none;\">\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "							</ul>\n" +
    "							<ul class=\"amazingslider-thumbnails\" style=\"display:none;\">\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<li>\n" +
    "									<img ng-src=\"http://www.raquette-evasion.com/ori-trek-randonnee-vercors-690-euros-403_382.jpg\"/>\n" +
    "								</li>\n" +
    "								<div display-slider slider-id=\"carousel-spot\"></div>\n" +
    "							</ul>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "				\n" +
    "				<div ng-controller=\"TopoController\" ng-include=\"'spot/topo/topo.tpl.html'\"></div>\n" +
    "				\n" +
    "\n" +
    "				<!-- STORIES -->\n" +
    "				<div class=\"panel panel-default\" id=\"stories\" ng-show=\"!editMode\">\n" +
    "					<ul class=\"nav nav-tabs header-tabs\">\n" +
    "						<li><a href=\"#stories\" data-toggle=\"tab3\"><b>Stories ({{comments.length}})</b></a></li>\n" +
    "						<div class=\"pull-right\" data-ui-view=\"comment.action\">\n" +
    "							<a class=\"btn btn-primary\" ui-sref=\"spot.comment\"><i class=\"fa fa-plus-sign\"></i> Add a Story</a>\n" +
    "						</div>\n" +
    "					</ul>\n" +
    "					<div class=\"panel-body\">\n" +
    "						<div data-ui-view=\"comment.form\"></div>\n" +
    "						<div data-ng-repeat=\"comment in comments | orderBy:'modificationDate':true\">\n" +
    "							<div ng-include src=\"'spot/comment/comment.tpl.html'\"></div>\n" +
    "						</div>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<!-- RIGHT ZONE -->\n" +
    "			<div id=\"map-right\" class=\"col-lg-3\">\n" +
    "				<!-- 	<div class=\"col-lg-12\" style=\"text-align:center\">\n" +
    "						<span style=\"font-size:3em;font-family: 'Candal', sans-serif;\"><i class=\"fa fa-comments\"></i> 47</span>\n" +
    "					</div>\n" +
    "				</div>-->\n" +
    "				<!-- MAP -->\n" +
    "				<div class=\"panel panel-default\" ng-if=\"!editMode\">\n" +
    "					<div class=\"panel-body\">\n" +
    "						<map loc=\"{{spot.loc}}\" mode=\"{{mapMode()}}\" class=\"map\"></map>\n" +
    "					</div>\n" +
    "				</div>\n" +
    "\n" +
    "				<!-- DATA -->\n" +
    "				<div ng-controller=\"DataController\" ng-include=\"'spot/data/data.tpl.html'\"></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- JS DOM -->\n" +
    "<script>\n" +
    "\n" +
    "	$(document).ready(function(){\n" +
    "\n" +
    "		$('.header-tabs a').click(function (e) {\n" +
    "			e.preventDefault();\n" +
    "			$(this).tab('show');\n" +
    "		})\n" +
    "		$('.header-tabs').each(function(){\n" +
    "			$(this).find('a:first').tab('show');\n" +
    "		});\n" +
    "\n" +
    "		jQuery(\"#slideshow\").amazingslider({\n" +
    "\n" +
    "			jsfolder:'/static/img/',\n" +
    "			width:690,\n" +
    "			height:500,\n" +
    "			skinsfoldername:\"\",\n" +
    "			loadimageondemand:false,\n" +
    "			isresponsive:true,\n" +
    "			autoplayvideo:false,\n" +
    "			pauseonmouseover:false,\n" +
    "			addmargin:true,\n" +
    "			randomplay:false,\n" +
    "			playvideoonclickthumb:true,\n" +
    "			slideinterval:5000,\n" +
    "			enabletouchswipe:true,\n" +
    "			transitiononfirstslide:false,\n" +
    "			loop:0,\n" +
    "			autoplay:false,\n" +
    "			navplayvideoimage:\"play-32-32-0.png\",\n" +
    "			navpreviewheight:60,\n" +
    "			timerheight:2,\n" +
    "			shownumbering:false,\n" +
    "			skin:\"Gallery\",\n" +
    "			textautohide:false,\n" +
    "			addgooglefonts:true,\n" +
    "			navshowplaypause:true,\n" +
    "			navshowplayvideo:true,\n" +
    "			navshowplaypausestandalonemarginx:8,\n" +
    "			navshowplaypausestandalonemarginy:8,\n" +
    "			navbuttonradius:0,\n" +
    "			navthumbnavigationarrowimageheight:32,\n" +
    "			navpreviewarrowheight:8,\n" +
    "			showshadow:false,\n" +
    "			navfeaturedarrowimagewidth:16,\n" +
    "			navpreviewwidth:120,\n" +
    "			googlefonts:\"Inder\",\n" +
    "			textpositionmarginright:24,\n" +
    "			bordercolor:\"#ffffff\",\n" +
    "			navthumbnavigationarrowimagewidth:32,\n" +
    "			navthumbtitlehovercss:\"text-decoration:underline;\",\n" +
    "			arrowwidth:32,\n" +
    "			texteffecteasing:\"easeOutCubic\",\n" +
    "			texteffect:\"\",\n" +
    "			navspacing:8,\n" +
    "			navarrowimage:\"navarrows-28-28-0.png\",\n" +
    "			ribbonimage:\"ribbon_topleft-0.png\",\n" +
    "			navwidth:52,\n" +
    "			showribbon:false,\n" +
    "			arrowtop:50,\n" +
    "			timeropacity:0.6,\n" +
    "			navthumbnavigationarrowimage:\"carouselarrows-32-32-0.png\",\n" +
    "			navshowplaypausestandalone:false,\n" +
    "			navpreviewbordercolor:\"#ffffff\",\n" +
    "			ribbonposition:\"topleft\",\n" +
    "			navthumbdescriptioncss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "			navborder:2,\n" +
    "			navthumbtitleheight:20,\n" +
    "			textpositionmargintop:24,\n" +
    "			navswitchonmouseover:false,\n" +
    "			playvideoimage:\"playvideo-64-64-0.png\",\n" +
    "			arrowimage:\"arrows-32-32-0.png\",\n" +
    "			textstyle:\"static\",\n" +
    "			playvideoimageheight:64,\n" +
    "			navfonthighlightcolor:\"#666666\",\n" +
    "			showbackgroundimage:false,\n" +
    "			navpreviewborder:4,\n" +
    "			navopacity:0.8,\n" +
    "			shadowcolor:\"#aaaaaa\",\n" +
    "			navbuttonshowbgimage:true,\n" +
    "			navbuttonbgimage:\"navbuttonbgimage-28-28-0.png\",\n" +
    "			textbgcss:\"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);\",\n" +
    "			playvideoimagewidth:64,\n" +
    "			bottomshadowimagewidth:110,\n" +
    "			showtimer:true,\n" +
    "			navradius:0,\n" +
    "			navshowpreview:false,\n" +
    "			navmarginy:8,\n" +
    "			navmarginx:8,\n" +
    "			navfeaturedarrowimage:\"featuredarrow-16-8-0.png\",\n" +
    "			navfeaturedarrowimageheight:8,\n" +
    "			navstyle:\"thumbnails\",\n" +
    "			textpositionmarginleft:24,\n" +
    "			descriptioncss:\"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;\",\n" +
    "			navplaypauseimage:\"navplaypause-48-48-0.png\",\n" +
    "			backgroundimagetop:-10,\n" +
    "			arrowstyle:\"mouseover\",\n" +
    "			timercolor:\"#ffffff\",\n" +
    "			numberingformat:\"%NUM/%TOTAL \",\n" +
    "			navfontsize:12,\n" +
    "			navhighlightcolor:\"#333333\",\n" +
    "			navimage:\"bullet-24-24-5.png\",\n" +
    "			navheight:52,\n" +
    "			navshowplaypausestandaloneautohide:true,\n" +
    "			navbuttoncolor:\"\",\n" +
    "			navshowarrow:false,\n" +
    "			navshowfeaturedarrow:true,\n" +
    "			titlecss:\"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;\",\n" +
    "			ribbonimagey:0,\n" +
    "			ribbonimagex:0,\n" +
    "			navshowplaypausestandaloneposition:\"bottomright\",\n" +
    "			shadowsize:5,\n" +
    "			arrowhideonmouseleave:1000,\n" +
    "			navshowplaypausestandalonewidth:48,\n" +
    "			navshowplaypausestandaloneheight:48,\n" +
    "			backgroundimagewidth:120,\n" +
    "			navcolor:\"#999999\",\n" +
    "			navthumbtitlewidth:120,\n" +
    "			navpreviewposition:\"top\",\n" +
    "			arrowheight:32,\n" +
    "			arrowmargin:8,\n" +
    "			texteffectduration:1000,\n" +
    "			bottomshadowimage:\"bottomshadow-110-95-4.png\",\n" +
    "			border:6,\n" +
    "			timerposition:\"bottom\",\n" +
    "			navfontcolor:\"#333333\",\n" +
    "			navthumbnavigationstyle:\"arrow\",\n" +
    "			borderradius:0,\n" +
    "			navbuttonhighlightcolor:\"\",\n" +
    "			textpositionstatic:\"bottom\",\n" +
    "			navthumbstyle:\"imageonly\",\n" +
    "			textcss:\"display:block; padding:8px 16px; text-align:left; \",\n" +
    "			navbordercolor:\"#ffffff\",\n" +
    "			navpreviewarrowimage:\"previewarrow-16-8-0.png\",\n" +
    "			showbottomshadow:true,\n" +
    "			navdirection:\"horizontal\",\n" +
    "			textpositionmarginstatic:0,\n" +
    "			backgroundimage:\"\",\n" +
    "			navposition:\"bottom\",\n" +
    "			navpreviewarrowwidth:16,\n" +
    "			bottomshadowimagetop:95,\n" +
    "			textpositiondynamic:\"bottomleft\",\n" +
    "			navshowbuttons:false,\n" +
    "			navthumbtitlecss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "			textpositionmarginbottom:24,\n" +
    "			transition:\"\"\n" +
    "		});\n" +
    "\n" +
    "jQuery(\".story-carousel\").each(function(){\n" +
    "	$(this).amazingslider({\n" +
    "		lightboxmode:true,\n" +
    "		lightboxid:$(this).attr('id'),\n" +
    "		jsfolder:'/static/img/',\n" +
    "		width:690,\n" +
    "		height:0,\n" +
    "		skinsfoldername:\"\",\n" +
    "		loadimageondemand:false,\n" +
    "		isresponsive:true,\n" +
    "		autoplayvideo:false,\n" +
    "		pauseonmouseover:false,\n" +
    "		addmargin:true,\n" +
    "		randomplay:false,\n" +
    "		playvideoonclickthumb:true,\n" +
    "		slideinterval:5000,\n" +
    "		enabletouchswipe:true,\n" +
    "		transitiononfirstslide:false,\n" +
    "		loop:0,\n" +
    "		autoplay:false,\n" +
    "		navplayvideoimage:\"play-32-32-0.png\",\n" +
    "		navpreviewheight:60,\n" +
    "		timerheight:2,\n" +
    "		shownumbering:false,\n" +
    "		skin:\"Gallery\",\n" +
    "		textautohide:false,\n" +
    "		addgooglefonts:true,\n" +
    "		navshowplaypause:true,\n" +
    "		navshowplayvideo:true,\n" +
    "		navshowplaypausestandalonemarginx:8,\n" +
    "		navshowplaypausestandalonemarginy:8,\n" +
    "		navbuttonradius:0,\n" +
    "		navthumbnavigationarrowimageheight:32,\n" +
    "		navpreviewarrowheight:8,\n" +
    "		showshadow:false,\n" +
    "		navfeaturedarrowimagewidth:16,\n" +
    "		navpreviewwidth:120,\n" +
    "		googlefonts:\"Inder\",\n" +
    "		textpositionmarginright:24,\n" +
    "		bordercolor:\"#ffffff\",\n" +
    "		navthumbnavigationarrowimagewidth:32,\n" +
    "		navthumbtitlehovercss:\"text-decoration:underline;\",\n" +
    "		arrowwidth:32,\n" +
    "		texteffecteasing:\"easeOutCubic\",\n" +
    "		texteffect:\"\",\n" +
    "		navspacing:8,\n" +
    "		navarrowimage:\"navarrows-28-28-0.png\",\n" +
    "		ribbonimage:\"ribbon_topleft-0.png\",\n" +
    "		navwidth:52,\n" +
    "		showribbon:false,\n" +
    "		arrowtop:50,\n" +
    "		timeropacity:0.6,\n" +
    "		navthumbnavigationarrowimage:\"carouselarrows-32-32-0.png\",\n" +
    "		navshowplaypausestandalone:false,\n" +
    "		navpreviewbordercolor:\"#ffffff\",\n" +
    "		ribbonposition:\"topleft\",\n" +
    "		navthumbdescriptioncss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "		navborder:2,\n" +
    "		navthumbtitleheight:20,\n" +
    "		textpositionmargintop:24,\n" +
    "		navswitchonmouseover:false,\n" +
    "		playvideoimage:\"playvideo-64-64-0.png\",\n" +
    "		arrowimage:\"arrows-32-32-0.png\",\n" +
    "		textstyle:\"static\",\n" +
    "		playvideoimageheight:64,\n" +
    "		navfonthighlightcolor:\"#666666\",\n" +
    "		showbackgroundimage:false,\n" +
    "		navpreviewborder:4,\n" +
    "		navopacity:0.8,\n" +
    "		shadowcolor:\"#aaaaaa\",\n" +
    "		navbuttonshowbgimage:false,\n" +
    "		navbuttonbgimage:\"navbuttonbgimage-28-28-0.png\",\n" +
    "		textbgcss:\"display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#fff; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; opacity:0.7; filter:alpha(opacity=70);\",\n" +
    "		playvideoimagewidth:64,\n" +
    "		bottomshadowimagewidth:110,\n" +
    "		showtimer:false,\n" +
    "		navradius:0,\n" +
    "		navshowpreview:false,\n" +
    "		navmarginy:8,\n" +
    "		navmarginx:8,\n" +
    "		navfeaturedarrowimage:\"featuredarrow-16-8-0.png\",\n" +
    "		navfeaturedarrowimageheight:8,\n" +
    "		navstyle:\"thumbnails\",\n" +
    "		textpositionmarginleft:24,\n" +
    "		descriptioncss:\"display:block; position:relative; font:14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#333;\",\n" +
    "		navplaypauseimage:\"navplaypause-48-48-0.png\",\n" +
    "		backgroundimagetop:-10,\n" +
    "		arrowstyle:\"mouseover\",\n" +
    "		timercolor:\"#ffffff\",\n" +
    "		numberingformat:\"%NUM/%TOTAL \",\n" +
    "		navfontsize:12,\n" +
    "		navhighlightcolor:\"#333333\",\n" +
    "		navimage:\"bullet-24-24-5.png\",\n" +
    "		navheight:52,\n" +
    "		navshowplaypausestandaloneautohide:true,\n" +
    "		navbuttoncolor:\"\",\n" +
    "		navshowarrow:false,\n" +
    "		navshowfeaturedarrow:false,\n" +
    "		titlecss:\"display:block; position:relative; font: 16px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#000;\",\n" +
    "		ribbonimagey:0,\n" +
    "		ribbonimagex:0,\n" +
    "		navshowplaypausestandaloneposition:\"bottomright\",\n" +
    "		shadowsize:0,\n" +
    "		arrowhideonmouseleave:1000,\n" +
    "		navshowplaypausestandalonewidth:48,\n" +
    "		navshowplaypausestandaloneheight:48,\n" +
    "		backgroundimagewidth:120,\n" +
    "		navcolor:\"#999999\",\n" +
    "		navthumbtitlewidth:120,\n" +
    "		navpreviewposition:\"top\",\n" +
    "		arrowheight:32,\n" +
    "		arrowmargin:8,\n" +
    "		texteffectduration:1000,\n" +
    "		bottomshadowimage:\"bottomshadow-110-95-4.png\",\n" +
    "		border:6,\n" +
    "		timerposition:\"bottom\",\n" +
    "		navfontcolor:\"#333333\",\n" +
    "		navthumbnavigationstyle:\"arrow\",\n" +
    "		borderradius:0,\n" +
    "		navbuttonhighlightcolor:\"\",\n" +
    "		textpositionstatic:\"bottom\",\n" +
    "		navthumbstyle:\"imageonly\",\n" +
    "		textcss:\"display:block; padding:8px 16px; text-align:left; \",\n" +
    "		navbordercolor:\"#ffffff\",\n" +
    "		navpreviewarrowimage:\"previewarrow-16-8-0.png\",\n" +
    "		showbottomshadow:false,\n" +
    "		navdirection:\"horizontal\",\n" +
    "		textpositionmarginstatic:0,\n" +
    "		backgroundimage:\"\",\n" +
    "		navposition:\"bottom\",\n" +
    "		navpreviewarrowwidth:16,\n" +
    "		bottomshadowimagetop:95,\n" +
    "		textpositiondynamic:\"bottomleft\",\n" +
    "		navshowbuttons:false,\n" +
    "		navthumbtitlecss:\"display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;\",\n" +
    "		textpositionmarginbottom:24,\n" +
    "		transition:\"\"\n" +
    "	});\n" +
    "});\n" +
    "\n" +
    "$('[class^=amazingslider-slider-]').hide();\n" +
    "$('[class^=amazingslider-nav-]').css('background-color','#f5f5f5');\n" +
    "$('.amazingslider-slider-0').show();\n" +
    "\n" +
    "});\n" +
    "\n" +
    "</script>");
}]);

angular.module("spot/topo/topo.edit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/topo/topo.edit.tpl.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-lg-12\">\n" +
    "		<TEXTAREA rich-text-editor ng-model=\"topo.text\" rows=\"50\" style=\"width:100%;border:0;background:none\"></TEXTAREA>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "	// var offset = $(\"#topo-tab\").offset().top - 70;\n" +
    "	// $('html, body').animate({   \n" +
    "	//   scrollTop: offset\n" +
    "	// }, 500);\n" +
    "</script>");
}]);

angular.module("spot/topo/topo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("spot/topo/topo.tpl.html",
    "<!-- TOPO -->\n" +
    "<div class=\"panel panel-default\" id=\"topo\">\n" +
    "	<ul class=\"nav nav-tabs header-tabs\">\n" +
    "		<li><a href=\"#topo-tab\" data-toggle=\"tab2\"><b>Topo</b></a></li>\n" +
    "	</ul>\n" +
    "	<div class=\"panel-body tab-pane\" id=\"topo-tab\" data-ui-view=\"spot.topo\" autoscroll=\"false\">\n" +
    "		<div class=\"row\">\n" +
    "			<div class=\"col-lg-12\" data-ng-bind-html=\"safeTopoText\"></div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<script>\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "</script>");
}]);

angular.module("user/user.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("user/user.tpl.html",
    "<div class=\"container\">\n" +
    "    <div class=\"panel panel-default\">\n" +
    "        <!-- PANEL HEADING -->\n" +
    "        <ul class=\"nav nav-tabs header-tabs\">\n" +
    "            <li><a href=\"#profile\" data-toggle=\"profile\"><b>{{currentUser.username}}</b></a></li>\n" +
    "            <li><a href=\"#photos\" data-toggle=\"photos\"><b>Photos (134)</b></a></li>\n" +
    "            <li><a href=\"#activity\" data-toggle=\"activity\"><b>Activity</b></a></li>\n" +
    "            <li><a href=\"#settings\" data-toggle=\"settings\"><b>Settings</b></a></li>\n" +
    "        </ul>\n" +
    "        <!-- PANEL BODY -->\n" +
    "        <div class=\"tab-content\">\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"profile\">\n" +
    "	            Profile for \n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"photos\">\n" +
    "	            All Photos\n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"activity\">\n" +
    "	            Activity\n" +
    "	        </div>\n" +
    "	        <div class=\"panel-body tab-pane\" id=\"settings\">\n" +
    "	            Settings\n" +
    "	        </div>\n" +
    "	    </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "$(document).ready(function(){\n" +
    "\n" +
    "	$('.header-tabs a').click(function (e) {\n" +
    "		e.preventDefault();\n" +
    "		$(this).tab('show');\n" +
    "	})\n" +
    "	$('.header-tabs').each(function(){\n" +
    "		$(this).find('a:first').tab('show');\n" +
    "	});\n" +
    "});\n" +
    "\n" +
    "</script>");
}]);
