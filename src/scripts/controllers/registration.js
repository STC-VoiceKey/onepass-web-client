'use strict'

webaccessApp.controller('RegistrationCtrl', ["$scope", 'storage', 'MediaService', '$rootScope', 'localStorageService', '$location',
	function($scope, storage, MediaService, $rootScope, localStorageService, $location) {

		var person = localStorageService.get("person");
		var id = localStorageService.get("id");

		if (person && person.auth) {
			$location.url("/profile");
			return;
		}

		if (!id) {
			$location.url("/");
			return;
		}


		MediaService.startVideo();

		$scope.uploadScreen = function() {
			MediaService.uploadScreen();
		}

		$scope.startRecordAudio = function() {
			$rootScope.arecord = true;
			MediaService.startRecordAudio();
		}

		$scope.stopRecordAudio = function() {
			$rootScope.arecord = false;
			MediaService.stopRecordAudio();
		}

		$scope.regCancel = function() {
			localStorageService.clearAll();
			$location.url("/");
		}

		$scope.retake = function() {
			$rootScope.screenError = false;
			$rootScope.audioError = false;
		}
	}
]);