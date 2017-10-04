'use strict';

webaccessApp.factory('loginService', ['Api', 'localStorageService',
	function(Api, localStorageService) {

		var methods = {
			
			login: function() {
				Api.session({}, {
					"username": "",
					"password": "",
					"domainId": 201
					
				}, function(access) {
					
					localStorageService.set("session", access.sessionId);
				
				}, function(e) {

					console.log('login failed: ', e);
				
				});
			},

			isLogged: function() {
				
				var isSession = localStorageService.get("session");
				
				if (isSession) {
				
					Api.checkSession({}, function(user) {

					}, function(e) {

						methods.login();
					});
				
				} else {
					
					methods.login();
				
				}
			}
		}

		return methods;
	}
]);