'use strict'

webaccessApp.controller('AccessCtrl', ["$scope", '$location', '$timeout',
	function($scope, $location, $timeout) {
		$timeout(function() {
			$location.url("/profile");
		}, 2000);
	}
]);