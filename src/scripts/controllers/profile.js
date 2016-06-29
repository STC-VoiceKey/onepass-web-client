'use strict';

webaccessApp.controller('ProfileCtrl', ['$scope', '$location', 'localStorageService', '$rootScope',
	function($scope, $location, localStorageService, $rootScope) {
		var person = localStorageService.get("person");
		if (person && person.auth) {
			$rootScope.username = person.personId;
		} else {
			$location.url("/");
			return;
		}

		console.log("profile");
	}
]);