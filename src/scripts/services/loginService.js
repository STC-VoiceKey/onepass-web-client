'use strict';

webaccessApp.factory('loginService', ['Api', 'localStorageService', 'storage',
	function(Api, localStorageService, storage) {

		var methods = {
			
			login: function() {
				storage.devices().then(function(devices){
					
					var dev = [];
					
					for (var i = 0; i < devices.length; i++) {
						dev.push({"kind":devices[i].kind, "label":devices[i].label});
					}
					
					Api.session({}, {
						"username": "",
						"password": "",
						"domain_id": 201/*,
						"device_info": JSON.stringify({
							"OS": storage.getOS(),
							"Browser": storage.getBrowser(),
							"userAgent": storage.getUserAgent(),
							"devices": dev
						})*/
						
					}, function(access) {
						
						localStorageService.set("session", access.session_id);
					
					}, function(e) {

						console.log('login failed: ', e);
					
					});
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