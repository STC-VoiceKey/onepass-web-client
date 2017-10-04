'use strict';

webaccessApp.factory('storage', [
	function() {

		var media = {
			"numbers": {
				"ru_RU": [{
					"text": "ноль",
					"number": "0"
				}, {
					"text": "один",
					"number": "1"
				}, {
					"text": "два",
					"number": "2"
				}, {
					"text": "три",
					"number": "3"
				}, {
					"text": "четыре",
					"number": "4"
				}, {
					"text": "пять",
					"number": "5"
				}, {
					"text": "шесть",
					"number": "6"
				}, {
					"text": "семь",
					"number": "7"
				}, {
					"text": "восемь",
					"number": "8"
				}, {
					"text": "девять",
					"number": "9"
				}],
				"en": [{
					"text": "zero",
					"number": "0"
				}, {
					"text": "one",
					"number": "1"
				}, {
					"text": "two",
					"number": "2"
				}, {
					"text": "three",
					"number": "3"
				}, {
					"text": "four",
					"number": "4"
				}, {
					"text": "five",
					"number": "5"
				}, {
					"text": "six",
					"number": "6"
				}, {
					"text": "seven",
					"number": "7"
				}, {
					"text": "eight",
					"number": "8"
				}, {
					"text": "nine",
					"number": "9"
				}]
			}
		};

		var methods = {

			createFrame: function() {
				var frame = document.querySelector(".video-frame");
				media.video = document.createElement("video");
				media.canvas = document.createElement("canvas");
				media.context = media.canvas.getContext('2d');
				media.video.autoplay = true;
				media.video.loop = true;
				media.video.width = media.canvas.width = 640;
				media.video.height = media.canvas.height = 480;
				frame.appendChild(media.canvas);
				frame.appendChild(media.video);

				return media;
			},

			getMedia: function() {
				return media;
			},

			getScreen: function(){
				media.context.drawImage(media.video, 0, 0, media.video.width, media.video.height);
				return media.canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpeg);base64,/, '');
			}
		}

		return methods;
	}
]);