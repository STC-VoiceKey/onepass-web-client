'use strict'

webaccessApp.controller('LogoutCtrl', ["$scope", 'localStorageService', '$location', 'Api', '$rootScope',
	function($scope, localStorageService, $location, Api, $rootScope) {
		
		var person = localStorageService.get("personId");
		
		if( !localStorageService.get("isLogged") ) $location.path("/");
		
		$scope.deleteAccount = function() {

			$rootScope.preloader = true;
			
			Api.deletePerson({
				"id": person
			}, function() {
				$scope.logout();							
			}, function(e) {
				console.log(e);
			}).$promise.finally(function(){
				$rootScope.preloader = false;				
			});;	
		}

		$scope.logout = function() {
			$location.path("/");
		}
	}
]);