'use strict'

webaccessApp.controller('LoginCtrl', ["$scope", 'MediaService', '$rootScope', 'localStorageService', '$location',
	function($scope, MediaService, $rootScope, localStorageService, $location) {
		var person = localStorageService.get("person");
		if (person) {
			if (person.auth) {
				$location.url("/profile");
				return;
			}
		} else {
			$location.url("/");
			return;
		}

		MediaService.startVideo();
		$rootScope.verifyText = MediaService.decodeText();

		$scope.startVerification = function() {
			$rootScope.vrecord = true;
			MediaService.startVerification();
		}

		$scope.stopVerification = function() {
			$rootScope.vrecord = false;
			MediaService.stopVerification();
		}

		$scope.again = function() {
			$rootScope.denied = false;
			MediaService.startSession();
		}

		$scope.loginCancel = function() {
			localStorageService.clearAll();
			$rootScope.denied = false;
			$location.url("/");
		}
	}
]);