'use strict'

webaccessApp.controller('ProfileCtrl', ["$scope", "localStorageService", "$location",
	function($scope, localStorageService, $location) {
		
		$scope.username = localStorageService.get("personId");
		
		if( !localStorageService.get("isLogged") ) $location.path("/");
	}
]);