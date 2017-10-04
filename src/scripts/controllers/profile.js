'use strict'

webaccessApp.controller('ProfileCtrl', ["$scope", "localStorageService", "$location",
	function($scope, localStorageService, $location) {
		
		$scope.username = localStorageService.get("personId");
		
		if(!$scope.username) $location.path("/");
	}
]);