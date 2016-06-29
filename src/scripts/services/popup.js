'use strict';

webaccessApp.factory('popup', [

	function() {
		return {

			visible: function() {
				document.getElementById('eloading').style.display = "block";

			},

			hidden: function() {
				document.getElementById('eloading').style.display = "none";
			}
		}
	}
]);