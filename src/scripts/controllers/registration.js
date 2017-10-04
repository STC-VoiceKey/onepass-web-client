'use strict'

webaccessApp.controller('RegistrationCtrl', ["$scope", "Api", "storage", "$location", "$rootScope", "config",
	function($scope, Api, storage, $location, $rootScope, config) {
		
		var init = function() {

			$scope.registration = {"screen": true};
			$scope.media = storage.createFrame();
			createVideo();

		}

		var encodeBase64 = function(blob, callback) {
			var reader = new FileReader();
			reader.onload = function(event) {
				var data = event.target.result.split(','),
				decodedImageData = data[1];
				callback(decodedImageData);
			};
			reader.readAsDataURL(blob);
		}


		var shuffle = function(a) {
		    var j, x, i;
		    for (i = a.length; i; i--) {
		        j = Math.floor(Math.random() * i);
		        x = a[i - 1];
		        a[i - 1] = a[j];
		        a[j] = x;
		    }
		}
		
		var createVideo = function(){
			$rootScope.preloader = true;

			navigator.getUserMedia({
				"video": true,
				"audio": true
			}, function(stream) {
				
				$scope.$apply(function(){
					$rootScope.preloader = false;	
				});
				
				if ($scope.media.video.mozCaptureStream) {
	            	$scope.media.video.mozSrcObject = stream;
	            } else {
	            	$scope.media.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
	            }
				
				$scope.media.vrec = new MediaStreamRecorder(stream);
				$scope.media.vrec.stream = stream;
				$scope.media.vrec.video = mergeProps($scope.media.video, {
					muted: true
				});

			}, function(e){

			});
		}

		var createAudio = function() {
			
			$rootScope.preloader = true;

			navigator.getUserMedia({
				"audio": true
			}, function(stream) {
				$rootScope.preloader = false;

				$scope.media.arec = new MediaStreamRecorder(stream);
				$scope.media.arec.mimeType = "audio/wav";
				$scope.media.arec.audioChannels = 2;
				$scope.media.arec.stream = stream;
				$scope.media.arec.ondataavailable = function(blob) {
					$scope.registration.recording = false;
					$scope.media.arec.stop();
					encodeBase64(blob, uploadLastRecordingAudio);
				};

				$scope.$apply(function(){
					$scope.registration.audioStep = 0;
					createPassword();
					$scope.registration.screen = false;
					$scope.registration.audio = true;
				});


			}, function(e){

			});

		}
		
		var createPassword = function(){
			var arr = [],
			arr2 = [],
			language = config.getLanguage(),
			numbers = $scope.media.numbers[language],
			reg = $scope.registration;

			shuffle(numbers);

			for (var i = 0; i < numbers.length; i++){
				arr.push(numbers[i].text);	
				arr2.push(numbers[i].number);	
			}

			reg.password = {
				"text": arr.join(" "),
				"numbers": arr2.join(" ")
			}
		}
		

		var uploadLastRecordingAudio = function(base64) {
			
			var reg = $scope.registration;
			
			$rootScope.preloader = true;

			Api.audio({}, {
				'data': base64,
				'password': reg.password.text,
				'channel': 0
			}, function(response) {
					if (reg.audioStep < 2){
						reg.audioStep++;
						createPassword();
					} else {
						reg.complete = true;
						reg.audioStep = false;
					}
			}, function(e) {
				$scope.showPopup('audioError');
			}).$promise.finally(function(){
				$rootScope.preloader = false;				
			});
		}

		$scope.uploadScreen = function(){
			
			$rootScope.preloader = true;

			var screen = storage.getScreen();

			Api.face({}, {
				"data": screen
			}, function(response) {
				$scope.media.vrec.stream.stop();
				createAudio();
			}, function(error) {
				$scope.showPopup('faceError');
			}).$promise.finally(function(){
				$rootScope.preloader = false;				
			});
		}

		$scope.startRecordAudio = function() {
			$scope.registration.recording = true;
			$scope.media.arec.start(10000);
		}

		$scope.stopRecordAudio = function() {
			$scope.registration.recording = false;
			$scope.media.arec.stop();	
		}

		$scope.complete = function(){
			$location.path("/");
		}


		$scope.showPopup = function(type){
			$scope.registration[type] = true;
		}


		$scope.hidePopup = function(type){
			$scope.registration[type] = false;
		}

		$scope.cancel = function(type){
			$scope.hidePopup(type);
			$location.path("/");
		}

		init();

	}
]);