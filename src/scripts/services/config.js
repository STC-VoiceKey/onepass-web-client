'use strict';

webaccessApp.factory('config', ['gettextCatalog', 'localStorageService', '$rootScope',
	function(gettextCatalog, localStorageService, $rootScope) {
		
		var language = localStorageService.get("language");
		
		var set_lang = function(lang){
			gettextCatalog.loadRemote('translations/' + lang + '.json');
			gettextCatalog.setCurrentLanguage(lang);
			$rootScope.language = lang;
		}

		return {

			language: function(lang) {
				localStorageService.set("language", lang);
				set_lang(lang)
			},

			languageDefault: function(lang){
				var val = language || lang;
				set_lang(val);
			}, 

			getLanguage: function(){
				return gettextCatalog.getCurrentLanguage();
			}
		}
	}
]);