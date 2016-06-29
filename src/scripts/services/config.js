'use strict';

webaccessApp.factory('config', ['gettextCatalog',
	function(gettextCatalog) {

		return {

			setLanguage: function(lang) {
				gettextCatalog.loadRemote('translations/' + lang + '.json');
				gettextCatalog.setCurrentLanguage(lang);
			},

			getLanguage: function() {
				return gettextCatalog.getCurrentLanguage();
			}
		}
	}
]);