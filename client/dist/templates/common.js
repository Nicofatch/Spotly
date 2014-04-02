angular.module('templates.common', ['directives/spotList/spot.popup.tpl.html', 'directives/spotList/spot.tpl.html', 'security/login/form.tpl.html', 'security/login/toolbar.tpl.html']);

angular.module("directives/spotList/spot.popup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/spotList/spot.popup.tpl.html",
    "<div class=\"row\" style=\"width:400px\">\n" +
    "	<div class=\"spot-infos col-lg-12\" style=\"margin-bottom:15px\">\n" +
    "		<span class=\"spot-icon-container\">\n" +
    "			<button class=\"btn btn-default btn-select\">\n" +
    "				<span style=\"font-size:1.2em;\">\n" +
    "					<b>{{spot.index}}</b>\n" +
    "				</span>\n" +
    "			</button>\n" +
    "		</span>\n" +
    "		<div class=\"spot-info-container\">\n" +
    "			<h4 class=\"list-group-item-heading\">\n" +
    "				<a href=\"#/spot/{{spot._id}}\" role=\"spot-title\"><b>{{spot.title}}</b></a>\n" +
    "				<div id=\"map-tags-container\">        \n" +
    "					<span id=\"map-tags\">\n" +
    "						<span style=\"display:inline-block\">\n" +
    "							<!--<span ng-class=\"tagClass($index)\">{{tag}}</span>-->\n" +
    "							<small>4, Place de Damloup, 31000 Toulouse, France</small>\n" +
    "						</span> \n" +
    "					</span> \n" +
    "				</div>\n" +
    "			</h4>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"clearfix\"></div>\n" +
    "	<div class=\"panel-default\" style=\"margin-bottom:-14px;margin-left:-5px;margin-right:-5px;\">\n" +
    "		<div class=\"panel-heading\" style=\"border:0;border-radius:0\">\n" +
    "			<div class=\"row\">\n" +
    "				<div class=\"col-xs-7\">\n" +
    "					<i class=\"icon icon_swimming fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_biking fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_skiing fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i>\n" +
    "				</div>\n" +
    "				<div class=\"col-xs-3 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>32</b></h4><small>COMMENTS</small></div>\n" +
    "				<div class=\"col-xs-2 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>1,324</b></h4><small>LOVES</small></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("directives/spotList/spot.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("directives/spotList/spot.tpl.html",
    "<div class=\"panel panel-default\" role=\"spot-item\" style=\"margin-bottom:8px\" id=\"spot-{{_id}}\" ng-class=\"{'spot-selected': isSelected}\">\n" +
    "  <div class=\"panel-body\" ng-click=\"isSelected=true\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"spot-infos col-lg-12\" ng-mouseover=\"isSelected=true\">\n" +
    "        <span class=\"spot-icon-container visible-lg visible-sm visible-md\">\n" +
    "          <button class=\"btn btn-default btn-select\"><span style=\"font-size:1.2em;\"><b>{{displayIndex}}</b></span></button>\n" +
    "        </span>\n" +
    "        <div class=\"spot-info-container\" id=\"spot-info-{{id}}\">\n" +
    "          <!-- <button class=\"btn btn-default pull-right\" ng-click=\"selectSpot(spot)\"><i class=\"icon-map-marker icon-large\"></i></button> -->\n" +
    "          <h4 class=\"list-group-item-heading\">\n" +
    "            <div class=\"pull-right\">\n" +
    "              \n" +
    "            </div>\n" +
    "            <a ui-sref=\"spot({ id:_id })\" role=\"spot-title\" ng-click=\"$event.stopPropagation()\"><b>{{title}}</b></a></br>\n" +
    "            <div id=\"map-tags-container\">        \n" +
    "              <span id=\"map-tags\">\n" +
    "                <span style=\"display:inline-block\">\n" +
    "                  <!--<span ng-class=\"tagClass($index)\">{{tag}}</span>-->\n" +
    "                  <small>{{address.value}}</small>\n" +
    "                </span> \n" +
    "              </span> \n" +
    "            </div>\n" +
    "          </h4>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-7\">\n" +
    "        <i class=\"icon icon_swimming fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_biking fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i> <i class=\"icon icon_skiing fa-2x img-thumbnail\" style=\"padding:5px;width:37px\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"col-xs-3 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>32</b></h4><small>COMMENTS</small></div>\n" +
    "      <div class=\"col-xs-2 pull-right\"><h4 style=\"margin-top:0px;margin-bottom:0px\"><b>1,324</b></h4><small>LOVES</small></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("security/login/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/form.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <h4>Sign in</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div class=\"alert alert-warning\" ng-show=\"authReason\">\n" +
    "        {{authReason}}\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-error\" ng-show=\"authError\">\n" +
    "        {{authError}}\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-info\">Please enter your login details</div>\n" +
    "    <form name=\"user.form\" novalidate class=\"login-form form-inline\">\n" +
    "        <fieldset>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control input-lg\" style=\"width:228px\" placeholder=\"E-mail\" name=\"username\" ng-model=\"user.username\" type=\"email\" required autofocus>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control input-lg\" style=\"width:228px\" placeholder=\"Password\" name=\"password\" type=\"password\" ng-model=\"user.password\" value=\"\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"btn btn-lg btn-success\" type=\"submit\" ng-click=\"login()\" value=\"Login\">\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "    </form>\n" +
    "    <h4 style=\"text-align:center\">or</h4>\n" +
    "    <a class=\"btn btn-lg btn-primary btn-block\" id=\"sign-in-google\"><i class=\"icon-google-plus\"></i> Sign In with Google</a>\n" +
    "    <a class=\"btn btn-lg btn-primary btn-block\" id=\"sign-in-twitter\"><i class=\"icon-twitter\"></i> Sign In with Twitter</a>\n" +
    "    \n" +
    "</div>");
}]);

angular.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/toolbar.tpl.html",
    "<ul class=\"pull-right nav navbar-nav visible-lg visible-md visible-sm\">\n" +
    "	<li ng-if=\"!isAuthenticated()\"><a ng-click=\"login()\">Sign In</a></li>\n" +
    "	<form ng-if=\"!isAuthenticated()\" class=\"navbar-form navbar-left\" role=\"signup\">\n" +
    "	    <button type=\"submit\" class=\"btn btn-success\">Sign Up</button>\n" +
    "	</form>\n" +
    "	<!-- else -->\n" +
    "    <li ng-if=\"isAuthenticated()\"><a ui-sref=\"activity\"><i class=\"icon-globe icon-large\"></i> Activity</a></li>\n" +
    "    <li ng-if=\"isAuthenticated()\" class=\"dropdown nav-img\">\n" +
    "        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\"><img src=\"static/img/Avatar-128.png\" class=\"img-small\"> {{currentUser.username}}</a>\n" +
    "        <ul class=\"dropdown-menu\">\n" +
    "          <li><a ui-sref=\"user\">Profile</a></li>\n" +
    "          <li><a ng-click=\"logout()\">Logout</a></li>\n" +
    "        </ul>\n" +
    "    </li>\n" +
    "</ul>");
}]);
