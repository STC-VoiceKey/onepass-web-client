webaccessApp.factory('Api', ['$resource', 'localStorageService',
	function($resource, localStorageService) {

		
		var session = function() {

			return localStorageService.get("session");

		}

		var transaction = function() {

			return localStorageService.get("transaction");

		}		

		return $resource('', {

		}, {

			session: {
				method: 'POST',
				url: sessionService + 'session'
			},

			checkSession: {
				method: 'GET',
				url: sessionService + 'session',
				headers: {
					'X-Session-Id': session
				}
			},

			deleteSession: {
				method: 'DELETE',
				url: sessionService + 'session',
				headers: {
					'X-Session-Id': session
				}	
			},

			addPerson: {
				method: 'GET',
				url: rest + 'registration/person/:id',
				headers: {
					'x-session-id': session
				}	
			},

			checkPerson: {
				method: 'GET',
				url: rest + 'person/:id',
				headers: {
					'x-session-id': session
				}	
			},

			deletePerson: {
				method: 'DELETE',
				url: rest + 'person/:id',
				headers: {
					'x-session-id': session
				}	
			},

			face: {
				method: 'POST',
				url: rest + 'registration/face/file',
				headers: {
					'x-session-id': session,
					'x-transaction-id': transaction
				},
				transformResponse: function(data) {
					return data;
				}
			},

			audio: {
				method: 'POST',
				url: rest + 'registration/voice/dynamic/file',
				headers: {
					'x-session-id': session,
					'x-transaction-id': transaction
				}
			},

			video: {
				method: 'POST',
				url: rest + 'verification/video/dynamic/file',
				headers: {
					'x-session-id': session,
					'x-transaction-id': transaction
				},
				transformResponse: function(data) {
					return data;
				}
			},

			startVerification:{
				method: 'GET',
				url: rest + 'verification/person/:id',
				headers: {
					'x-session-id': session
				}
			},

			verificationResult: {
				method: 'GET',
				url: rest + 'verification/result?close_session=true',
				headers: {
					'x-session-id': session,
					'x-transaction-id': transaction
				}
			}

		});
	}	
]);