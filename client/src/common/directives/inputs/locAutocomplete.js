angular.module('directives.input')
.directive('locAutocomplete', ['appSettings',function(appSettings) {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			
			ngModelCtrl.$formatters.push(function(val) {
				if (val) {
					return val.value;
				}
			});

			var updateModel = function (suggestion) {
				ngModelCtrl.$setViewValue({
					value:suggestion.value,
					type:suggestion.data.type
				});
			};
			
			var setup = function () {
				var options = scope.$eval(attrs.autocomplete) || {};
				options.paramName =  'input';
				options.minChars = 1;
				//options.serviceUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw';
				//todo : put this as an option of the directive
				options.serviceUrl = appSettings.apiServer + appSettings.apiUri + '/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw';
				options.onSelect = updateModel;
				options.noCache = true;
				options.formatResult = function (suggestion, currentValue) {

					//Add <strong> tags around current value. Method taken from vendor autocomplete script
					// var pattern = '(' + currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')';
					// suggestion.value = suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');

					var icon;
					switch (suggestion.data.type) {
						case 'administrative_area_level_1':
						case 'country':
						icon='fa-flag';
						break;
						case 'route':
						icon='fa-road';
						break;
						case 'locality':
						icon='fa-building-o';
						break;
						case 'around':
						icon='fa-bullseye';
						break;
						default:
						icon='fa-map-marker';
					}
					return '<i class="fa '+ icon + '"></i> ' + suggestion.value;
				};
				options.transformResult = function(response) {
					var suggestions = $.map($.parseJSON(response).predictions, function(dataItem) {
						return { 
							value: dataItem.description,
							data: {
								reference:dataItem.reference,
								type:dataItem.types[0]
							}
						};
					});
					suggestions.push( {value: 'My Location', data: {type:'around'} });
					return {
						suggestions: suggestions   
					};
				};
				//options.onSelect = onSelectHandler(options.onSelect);
				//element.bind('change', updateModel);
				//element.datepicker('destroy');
				element.autocomplete(options);
				//ngModelCtrl.$render();
			};
			/*ngModelCtrl.$render = function () {
				element.val(ngModelCtrl.$viewValue);
			};*/
			scope.$watch(attrs.locAutocomplete, setup, true);
		}
	};
}]);