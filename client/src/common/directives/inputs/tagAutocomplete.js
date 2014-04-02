angular.module('directives.input')
.directive('tagAutocomplete', function() {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			// To do delete ?
			ngModelCtrl.$formatters.push(function(val) { 
				if (val) {
					return val.value;
				}
			});
			var updateModel = function (suggestion) {
				scope.$apply(function () {	
					ngModelCtrl.$setViewValue({
						value:suggestion.value,
						type:suggestion.data
					});
				});
			};
			
			var setup = function () {
				var options = scope.$eval(attrs.tagAutocomplete) || {};
				options.paramName =  'input';
				options.onSelect = updateModel;
				options.transformResult = function(response) {
					// first line of the JSON is sliced (see server/config/protectJSON.js)
					var suggestions = $.map($.parseJSON(response.split("\n").slice(1).join("\n")), function(dataItem) {
						return { value: dataItem.value , data: 'tag' };
					});
					suggestions.push({value: 'All Sports', data: 'all'});
					return {
						suggestions:suggestions    
					};
				};
				element.autocomplete(options);
			};
			scope.$watch(attrs.tagAutocomplete, setup, true);
		}
	};
});