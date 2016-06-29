'use strict';

webaccessApp.factory('storage', ['$resource', 'localStorageService',
	function($resource, localStorageService) {

		var baseUrl = 'https://onepass.tech/vkonepass/rest/v4/';
		var id = localStorageService.get("person") || '';


		return $resource(baseUrl + ':req', {

		}, {
			audio: {
				method: 'POST',
				url: baseUrl + 'person/:id/voice/dynamic/file'
			},

			video: {
				method: 'POST',
				url: baseUrl + 'verification/:id/video/dynamic',
				transformResponse: function(data) {
					return data;
				}
			},

			session: {
				method: 'GET',
				url: baseUrl + 'verification/:id?close_session'
			},

			close: {
				method: 'DELETE',
				url: baseUrl + 'verification/:id'
			},

			verify: {
				method: 'GET',
				url: baseUrl + 'verification/start/:person',
			},

			check: {
				method: 'GET',
				url: baseUrl + 'person/:person',
			},

			add: {
				method: 'POST',
				url: baseUrl + 'person'
			},

			delete: {
				method: 'DELETE',
				url: baseUrl + 'person/:person'
			},

			face: {
				method: 'POST',
				url: baseUrl + 'person/:id/face/sample',
				transformResponse: function(data) {
					return data;
				}
			}
		});
	}

]);