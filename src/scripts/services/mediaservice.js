'use strict';

webaccessApp.factory('MediaService', ['storage', 'localStorageService', 'popup', 'config', '$rootScope', '$location', '$timeout',
	function(storage, localStorageService, popup, config, $rootScope, $location, $timeout) {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
		var elem = {
			get: function(selector) {
				return document.querySelector(selector);
			},

			gebi: function(id) {
				return document.getElementById(id);
			},

			create: function(tag) {
				return document.createElement(tag);
			},

			hide: function(selector) {
				var s = document.querySelector(selector);
				if (s) s.style.display = "none";
			},

			show: function(selector) {
				var s = document.querySelector(selector);
				if (s) s.style.display = "block";
			}
		}

		var media = {
			video: null,
			id: localStorageService.get("id") || '',
			steps: 0,
			progress: false,
			password: null,
			passwordTranslate: {
				"en": {
					"zero": "0",
					"one": "1",
					"two": "2",
					"three": "3",
					"four": "4",
					"five": "5",
					"six": "6",
					"seven": "7",
					"eight": "8",
					"nine": "9"
				},
				"en_static": {
					"seven": "7",
					"one": "1",
					"three": "3",
					"nine": "9",
					"four": "4",
					"eight": "8",
					"six": "6",
					"zero": "0",
					"five": "5",
					"two": "2"
				}
			}
		}

		var createAudio = function() {
			navigator.getUserMedia({
				"audio": true
			}, function(stream) {
				$rootScope.astream = stream;
				media.arec = new MediaStreamRecorder(stream);
				media.arec.mimeType = "audio/wav";
				media.arec.audioChannels = 2;
				media.arec.stream = stream;
				media.arec.ondataavailable = function(blob) {
					$rootScope.arecord = false;
					media.arec.stop();
					encodeBase64(blob, uploadLastRecordingAudio);
				};
			}, errorMedia);

		}

		var createVideo = function() {
			var vid = elem.create("video");
			vid.id = "video";
			vid.autoplay = true;
			vid.loop = true;
			vid.width = 640;
			vid.height = 480;
			media.video = vid;
			media.canvas = elem.gebi('canvas');
			media.context = media.canvas.getContext('2d');
			var e = elem.get(".video__box");
			e.innerHTML = "";
			e.appendChild(vid);
			navigator.getUserMedia({
				"video": true,
				"audio": true
			}, function(stream) {
				$rootScope.vstream = stream;
				activatedFaceDetection(stream);
				media.vrec = new MediaStreamRecorder(stream);
				media.vrec.mimeType = "video/webm";
				media.vrec.stream = stream;
				media.vrec.video = mergeProps(media.video, {
					muted: true
				});
				media.vrec.ondataavailable = function(blob) {
					$rootScope.vrecord = false;
					if (media.progress) {
						media.progress = false;
						encodeBase64(blob, uploadLastRecordingVideo);
					}

				};
			}, errorMedia);
		}

		var uploadLastRecordingAudio = function(base64) {
			console.log("uploadLastRecordingAudio");
			storage.audio({
				"id": media.id
			}, {
				'data': base64,
				'password': media.password.text,
				'gender': 0
			}, function(response) {
				console.log("upload audio COMPLETE: ", response);
				if (media.steps > 1) {
					elem.hide(".b-audio");
					elem.show(".b-complete");
					localStorageService.clearAll();
					media.steps = 0;
					popup.hidden();
				} else {
					media.steps++;
					audioSteps();
					popup.hidden();
				}

			}, function(e) {
				console.log("uploadAudio ERROR: ", e);
				popup.hidden();
				showErrors("audio");
			});


		}

		var uploadLastRecordingVideo = function(base64) {
			console.log("uploadLastRecordingVideo");
			var p = localStorageService.get("person");
			storage.video({
				"id": p.verificationId
			}, {
				'data': base64,
				'password': p.password
			}, function(response) {
				console.log("upload video COMPLETE: ", response);
				checkSession();
			}, function(e) {
				console.log("upload video FAILED: ", e);
				checkSession();
				popup.hidden();
			});
		}

		var startSession = function() {
			var p = localStorageService.get("person");
			var person = p ? p.personId : '';
			storage.verify({
				'person': person
			}, function(response) {
				localStorageService.clearAll();
				response.personId = person;
				response.auth = false;
				localStorageService.set("person", response);
				$rootScope.verifyText = decodeText();
				console.log("person is DONE: ", response);
				document.location.href = "#/login"; //fix for facedetection
			}, function(e) {
				console.log("person not found (login): ", e);
				popup.hidden();
			})
		}

		var checkSession = function() {

			storage.session({
				"id": localStorageService.get("person").verificationId
			}, function(response) {
				if (response.status == "SUCCESS") {
					var loc = localStorageService.get("person");
					loc.auth = true;
					localStorageService.set("person", loc);
					$rootScope.username = loc.personId;
					$location.url("/access");
				} else {
					$rootScope.denied = true;
					console.log("verification STATUS: ", response.status);
				}
				closeSession();
			}, function(e) {
				$rootScope.denied = true;
				console.log("verification request FAILED: ", e);
				closeSession();

			});


		}

		var closeSession = function() {
			storage.close({
				"id": localStorageService.get("person").verificationId
			}, function(response) {
				popup.hidden();
				console.log("close session COMPLETE: ", response);
			}, function(e) {
				console.log("close session FAILED: ", e);
				popup.hidden();
			});
		}

		var deleteAccount = function() {
			storage.delete({
				'person': localStorageService.get("person").personId
			}, function(response) {
				popup.hidden();
				console.log("deleteAccount COMPLETE: ", response);
				localStorageService.clearAll();
				$location.url("/");
			}, function(e) {
				console.log("deleteAccount FAILED: ", e);
				popup.hidden();
			});

		}

		var logOut = function() {
			localStorageService.clearAll();
			$location.url("/");
		}

		var uploadScreen = function() {
			popup.visible();
			media.context.drawImage(media.video, 0, 0, media.video.width, media.video.height);
			var screen = media.canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpeg);base64,/, '');
			media.id = localStorageService.get("id");
			if (media.id) {
				storage.face({
					"id": media.id
				}, {
					'sample': {
						"data": screen
					}
				}, function(response) {
					console.log("uploadScreen COMPLETE: ", response);
					if (media.vrec.stream) {
						media.vrec.stream.stop();
						localStorageService.set("registration", true);
						audioSteps();
						popup.hidden();
					}
				}, function(error) {
					console.log("uploadScreen ERROR: ", error);
					popup.hidden();
					showErrors("screen");
				});
			}
		}

		var showErrors = function(err) {
			if (err == "screen") $rootScope.screenError = true;
			if (err == "audio") $rootScope.audioError = true;
		}

		var audioSteps = function() {
			if (media.htracker) {
				media.htracker.stop();
				media.htracker = null
			};

			createAudio();

			if (!media.steps) {
				media.password = createPassword(0);
				$rootScope.stepText = "Selfie: done";
			} else if (media.steps && media.steps == 1) {
				media.password = createPassword(1);
				$rootScope.stepText = "Two to go";
			} else {
				media.password = createPassword(2);
				$rootScope.stepText = "Last one";
			}

			$rootScope.stepNumbers = media.password.numbers;
			elem.hide(".b-vwrap");
			elem.show(".b-audio");
		}

		var activatedFaceDetection = function(stream) {
			console.log("activatedFaceDetection");
			if (media.htracker) {
				media.htracker.stop();
				media.htracker = null
			};
			media.htracker = new headtrackr.Tracker({
				calcAngles: true,
				ui: false,
				headPosition: true
			});

			media.htracker.init(media.video, media.canvas, stream);
			media.htracker.start();

			disabledButton(false);

			document.addEventListener("facetrackingEvent", function(event) {
				drawFrame(event);
			});

			document.addEventListener("headtrackrStatus", function(event) {
				if (event.status == "found") disabledButton(true);
			}, true);

		}

		var frameFaceReInit = function() {
			disabledButton(false);
			media.htracker.stop();
			media.htracker.start();
		}


		var startRecordAudio = function() {
			console.log("startRecordAudio");
			media.arec.start(10000);
		}

		var stopRecordAudio = function() {
			console.log("stopRecordAudio");
			media.arec.stop();
		}

		var startVerification = function() {
			console.log("Start verification");
			media.progress = true;
			media.vrec.start();
			$timeout(stopVerification, 7000);
			media.htracker.stop();
		}

		var stopVerification = function() {
			console.log("Stop verification");
			media.vrec.stop();
			media.htracker.start();
		}

		var createPassword = function(st) {
			console.log("createPassword");
			var language = config.getLanguage();
			var prop = (st == 2) ? "_static" : "";
			var arr = [];
			var arr2 = [];
			var obj = media.passwordTranslate[language + prop];
			for (var key in obj) {
				arr.push(key);
				arr2.push(obj[key]);
			}
			if (st) {
				arr.reverse();
				arr2.reverse();
			}

			return {
				"numbers": arr2.join(" "),
				"text": arr.join(" ")
			}
		}

		var encodeBase64 = function(blob, callback) {
			console.log("encodeBase64 SUCCESS: ", blob);
			popup.visible();
			var reader = new FileReader();
			reader.onload = function(event) {
				var data = event.target.result.split(','),
					decodedImageData = data[1];
				callback(decodedImageData);
			};
			reader.readAsDataURL(blob);
		}


		var disabledButton = function(status) {
			var button = elem.get(".b-video__control-button");

			if (!button) return;

			button.disabled = !status;

			if (status) button.style.opacity = 1;
			else button.style.opacity = 0.5;
		}

		var drawFrame = function(event) {
			media.context.clearRect(0, 0, 640, 480);
			if (event.detection == "CS") {
				var accept = event.x > 250 && event.x < 350 && event.y > 220 && event.y < 350;
				disabledButton(accept);
			}
		}

		var errorMedia = function(e) {
			console.log("errorMedia: ", e);
		}

		var decodeText = function() {
			var language = config.getLanguage();
			var uid = localStorageService.get("person");
			var sp = uid.password.split(" ");
			var arr = [];
			for (var i = 0; i < sp.length; i++) {
				if (sp[i] in media.passwordTranslate[language]) {
					arr.push(media.passwordTranslate[language][sp[i]])
				}
			}
			return arr.join(" ");
		}

		return {

			startVideo: function() {
				createVideo();
			},

			startAudio: function() {
				createAudio();
			},

			startVerification: function() {
				startVerification();
			},

			stopVerification: function() {
				stopVerification();
			},

			faceDetectionReInit: function() {
				frameFaceReInit();
			},

			startRecordAudio: function() {
				startRecordAudio();
			},

			stopRecordAudio: function() {
				stopRecordAudio();
			},

			startSession: function() {
				startSession();
			},

			uploadScreen: function() {
				uploadScreen();
			},

			deleteAccount: function() {
				deleteAccount();
			},

			logOut: function() {
				logOut();
			},

			decodeText: function() {
				return decodeText();
			}
		}
	}
]);