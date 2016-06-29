'use strict'

webaccessApp.controller('LogoutCtrl', ["$scope", 'MediaService', 'localStorageService', '$rootScope', '$location',
	function($scope, MediaService, localStorageService, $rootScope, $location) {
		var person = localStorageService.get("person");
		if (person && person.auth) {
			$rootScope.username = person.personId;
		} else {
			$location.url("/");
			return;
		}

		$scope.deleteAccount = function() {
			MediaService.deleteAccount();
		}

		$scope.logOut = function() {
			MediaService.logOut();
		}
	}
]);