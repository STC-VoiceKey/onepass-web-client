'use strict'

webaccessApp.controller('MainCtrl', ["$scope", "Api", "localStorageService", "$location", "$rootScope",
	function($scope, Api, localStorageService, $location, $rootScope) {

		var init = function() {

			$scope.main = {"person": localStorageService.get("personId")};
			$scope.cancel();

		}

		var verificationError = function(){
			$scope.main.errorNotFound = true;
		}

		var registrationError = function(){
			$scope.main.errorExists = true;
			$rootScope.preloader = false;
		}

		var addPerson = function(id){

			$rootScope.preloader = true;

			Api.addPerson({
				"id": id
			}, function(person) {
				localStorageService.set("transaction", person.transactionId);
				localStorageService.set("personId", id);
				$scope.main.agree = true;
			}, function(e) {
				console.log(e);
			}).$promise.finally(function(){
				$rootScope.preloader = false;	
			});
		}

		var deletePerson = function(id){

			$rootScope.preloader = true;
			
			Api.deletePerson({
				"id": id
			}, function() {
				addPerson(id);
			}, function(e) {
				console.log(e);
				$rootScope.preloader = false;
			}).$promise.finally(function(){

			});
		}


		$scope.verification = function(person) {
			$rootScope.preloader = true;

			Api.checkPerson({
				"id": person
			}, function(res) {
				if (res.isFullEnroll) {
					$location.path("verification");
					localStorageService.set("personId", person);
				} else { 
					verificationError();
				}
			}, function(e) {
				verificationError();
			}).$promise.finally(function(){
				$rootScope.preloader = false;				
			});
		}

		$scope.registration = function(person) {
			$rootScope.preloader = true;

			Api.checkPerson({
				"id": person
			}, function(res) {
				if (!res.isFullEnroll) deletePerson(person);
					else registrationError();	
			}, function(e) {
				addPerson(person);
			}).$promise.finally(function(){
							
			});
		}

		$scope.agreeAccept = function() {
			$location.path("registration");
		}

		$scope.cancel = function() {
			$scope.main.agree = false;
			$scope.main.errorNotFound = null;
			$scope.main.errorExists = null;
			localStorageService.remove("transaction", "isLogged");
		}

		$scope.change = function() {
			$scope.cancel();
		}

		init();

	}
]);