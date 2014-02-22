'use strict';

angular.module('directives.input')
.directive('locAutocomplete', function() {
	return {
		require:'ngModel',
		link:function (scope, element, attrs, ngModelCtrl) {
			// To do delete ?
			ngModelCtrl.$formatters.push(function(val) {
				return val.address;
			});

			var updateModel = function (suggestion) {
				ngModelCtrl.$setViewValue({
					address:suggestion
				});
				$.ajax({
					url: "https://maps.googleapis.com/maps/api/place/details/json?reference="+suggestion.data+"&sensor=true&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw",
				}).done(function( data ) {
					scope.$apply(function () {
						//element.datepicker("setDate", element.val());
						ngModelCtrl.$setViewValue({
							lng:data.result.geometry.location.lng,
							lat:data.result.geometry.location.lat,
							address:data.result.formatted_address
						})
					});
	                    //$('#home-explore-form').submit();
	                    //$('#search-button').removeAttr('disabled');
                });
			};
			
			var setup = function () {
				var options = scope.$eval(attrs.autocomplete) || {};
				options.paramName =  'input';
				options.serviceUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode&language=fr&sensor=false&key=AIzaSyDhECsfYPYNNM7n-x-GuDTE3lwJlL5C_pw';
		        options.onSelect = updateModel;
		        options.transformResult = function(response) {
		            return {
		                suggestions: $.map($.parseJSON(response).predictions, function(dataItem) {
	                  		return { value: dataItem.description , data: dataItem.reference };
	                	})
		            };
		        }
				//options.onSelect = onSelectHandler(options.onSelect);
				//element.bind('change', updateModel);
				//element.datepicker('destroy');
				element.autocomplete(options);
				ngModelCtrl.$render();
			};
			ngModelCtrl.$render = function () {
				element.val(ngModelCtrl.$viewValue);//element.datepicker("setDate", ngModelCtrl.$viewValue);
			};
			scope.$watch(attrs.locAutocomplete, setup, true);
		}
	};
});