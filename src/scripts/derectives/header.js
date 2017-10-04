'use strict'

webaccessApp.directive('header', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: "templates/header.html",
		controller: ['$scope', 'config', 'gettextCatalog', 
			function($scope, config, gettextCatalog) {
				

				$scope.setLanguage = function(lang) {
					config.language(lang);
				}
				
				$scope.setClassLanguage = function(classname) {
					var language = gettextCatalog.getCurrentLanguage();
					return classname + '-' + language;
				}
				
				$scope.isCurrentLanguage = function(lang) {
					return lang === gettextCatalog.getCurrentLanguage() ? 'b-location__current' : '';
				}
			}
		]
	}
});