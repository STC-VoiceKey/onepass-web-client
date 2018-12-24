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
			},

			getBrowser: function() {
				var ua = navigator.userAgent,
					tem,
					M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
				if (/trident/i.test(M[1])) {
					tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
					return 'IE ' + (tem[1] || '');
				}
				if (M[1] === 'Chrome') {
					tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
					if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
				}
				M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
				if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
				return M.join(' ');
			},

			getOS: function() {
				var OS = {
					'Win16': 'Windows 3.11',
					'Windows 95': 'Windows 95',
					'Win95': 'Windows 95',
					'Windows_95': 'Windows 95',
					'Windows 98': 'Windows 98',
					'Win98': 'Windows 98',
					'Windows NT 5.0': 'Windows 2000',
					'Windows 2000': 'Windows 2000',
					'Windows NT 5.1': 'Windows XP',
					'Windows XP': 'Windows XP',
					'Windows NT 5.2': 'Windows Server 2003',
					'Windows NT 6.0': 'Windows Vista',
					'Windows NT 6.1': 'Windows 7',
					'Windows NT 6.2': 'Windows 8',
					'WOW64': 'Windows 8',
					'Windows NT 10.0':'Windows 10',
					'Windows NT 4.0': 'Windows NT 4.0',
					'WinNT4.0': 'Windows NT 4.0',
					'WinNT': 'Windows NT 4.0',
					'Windows NT': 'Windows NT 4.0',
					'Windows ME': 'Windows ME',
					'OpenBSD': 'Open BSD',
					'SunOS': 'Sun OS',
					'Linux': 'Linux',
					'X11': 'Linux',
					'Mac_PowerPC': 'Mac OS',
					'Macintosh': 'Mac OS',
					'QNX': 'QNX',
					'BeOS': 'BeOS',
					'OS/2': 'OS/2',
					'nuhk': 'Search Bot',
					'Googlebot': 'Search Bot',
					'Yammybot': 'Search Bot',
					'Openbot': 'Search Bot',
					'Slurp': 'Search Bot',
					'MSNBot': 'Search Bot',
					'Ask Jeeves/Teoma': 'Search Bot',
					'ia_archiver': 'Search Bot'
				}

				var version;

				if (navigator.oscpu){
					version = OS[navigator.oscpu.split(";")[0]];
				} else {
					version = OS[navigator.userAgent.split("(")[1].split(")")[0].split(";")[0]];					
				}

				return version;	
			},

			getUserAgent: function(){
				return navigator.userAgent;
			},

			devices: function(){
				return navigator.mediaDevices.enumerateDevices();
			}
		}

		return methods;
	}
]);