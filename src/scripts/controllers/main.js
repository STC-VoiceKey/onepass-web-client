'use strict'

webaccessApp.controller('MainCtrl', ["$scope", 'storage', '$location', 'popup', 'localStorageService', '$rootScope',
	function($scope, storage, $location, popup, localStorageService, $rootScope) {
		var person = localStorageService.get("person");
		if (person && person.auth) {
			$location.url("/profile");
			return;
		}

		localStorageService.remove("registration");

		var _person;
		var createPerson = function(personid) {
			storage.add({
				"personId": personid
			}, function(response) {
				console.log("person added: ", response);
				localStorageService.clearAll();
				localStorageService.set("id", personid);
				document.location.href = "#/registration"; //fix for facedetection
			}, function(e) {
				console.log("person not added: ", e);
			});
		}

		$scope.regForm = function() {
			$scope.isReg = true;
			$scope.inputError = "";
		}

		$scope.login = function(person) {
			popup.visible();
			storage.verify({
				'person': person.id
			}, function(response) {
				localStorageService.clearAll();
				response.personId = person.id;
				response.auth = false;
				localStorageService.set("person", response);
				console.log("person infomation SUCCESS: ", response);
				document.location.href = "#/login"; //fix for facedetection
			}, function(e) {
				console.log("person not found (login): ", e);
				$scope.inputError = "account not found";
				popup.hidden();
			})

		}

		$scope.start = function() {
			popup.visible();
			$scope.agree = false;
			createPerson(_person.id);
		}

		$scope.cancel = function() {
			localStorageService.clearAll();
			$scope.agree = false;
		}

		$scope.registration = function(person) {
			_person = person;
			popup.visible();
			$scope.inputError = "";
			storage.check({
				'person': person.id
			}, function(response) {

				if (!response.isFullEnroll) {
					console.log("person not full: ", response);
					storage.delete({
						'person': person.id
					}, function(response) {
						console.log("person deleted: ", response);
						$scope.agree = true;
						popup.hidden();
					})
				} else {
					console.log("account is booked: ", response);
					$scope.inputError = "account is booked";
					popup.hidden();
				}

			}, function(e) {
				console.log("person not found(registration): ", e);
				$scope.agree = true;
				popup.hidden();
			})
		}
	}
]);