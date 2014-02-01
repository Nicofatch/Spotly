'use strict';

angular.module('directives.tagAutocomplete',[])
.directive('tagAutocomplete', function() {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			// To do delete ?
			ngModelCtrl.$formatters.push(function(val) { return val;});
			var updateModel = function (suggestion) {
				scope.$apply(function () {
					//element.datepicker("setDate", element.val());
					ngModelCtrl.$setViewValue(suggestion.value);
				});
			};
			var onSelectHandler = function(userHandler) {
				if ( userHandler ) {
					return function(suggestion) {
						updateModel();
						return userHandler(suggestion);
					};
				} else {
					return updateModel;
				}
			};
			var setup = function () {
				var options = scope.$eval(attrs.tagAutocomplete) || {};
				options.paramName =  'input',
		        options.onSelect = updateModel;
		        options.transformResult = function(response) {
		            return {
		                suggestions: $.map($.parseJSON(response), function(dataItem) {
		                    return { value: dataItem.value , data: dataItem.value };
		                })
		            };
		        }
				//options.onSelect = onSelectHandler(options.onSelect);
				//element.bind('change', updateModel);
				//element.datepicker('destroy');
				element.autocomplete(options);
				//ngModelCtrl.$render();
			};
			ngModelCtrl.$render = function () {
				//element.datepicker("setDate", ngModelCtrl.$viewValue);
			};
			scope.$watch(attrs.tagAutocomplete, setup, true);
		}
	};
});