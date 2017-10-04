'use strict'

webaccessApp.controller('VerificationCtrl', ["$scope", "Api", "localStorageService", "storage", "$rootScope", "$timeout", "$location", "config",
	function($scope, Api, localStorageService, storage, $rootScope, $timeout, $location, config) {
		
		var init = function() {

			$scope.verification = {};
			$scope.media = storage.createFrame();
			createVideo();
		}

		var startVerirication = function(){
			
			$rootScope.preloader = true;

			var id = localStorageService.get("personId");
			
			if (id){
				Api.startVerification({"id": id}, function(verif){
					
					$scope.verification.password = verif.password;
					localStorageService.set("transaction", verif.transactionId);

				}, function(e){

				}).$promise.finally(function(){
					$rootScope.preloader = false;
				});
			}
		}

		var verificationResult = function(){
			
			Api.verificationResult(function(result){
				if(result.status == "SUCCESS"){
					$scope.showPopup('access');	
					$timeout(profile, 3000);
				} else {
					$scope.showPopup('denied');
				}
			}, function(e){
				$scope.showPopup('denied');
			}).$promise.finally(function(){
				$rootScope.preloader = false;
				localStorageService.remove("transaction");
			});
		}

		var profile = function(){
			$location.path("profile");
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
				$scope.media.vrec.mimeType = "video/webm";
				$scope.media.vrec.stream = stream;
				$scope.media.vrec.video = mergeProps($scope.media.video, {
					muted: true
				});

	
				$scope.media.vrec.ondataavailable = function(blob) {
					
					if ($scope.verification.recording) {
						$scope.verification.recording = false;
						encodeBase64(blob, uploadLastRecordingVideo);
					}
				};

				startVerirication();

			}, function(e){
				$scope.$apply(function(){
					$rootScope.preloader = false;	
				});
			});
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

		var uploadLastRecordingVideo = function(base64) {
			
			$rootScope.preloader = true;
			
			Api.video({}, {
				'data': base64,
				'password': $scope.verification.password
			}, function(response) {
				
			}, function(e) {
				$scope.showPopup('denied');
			}).$promise.finally(function(){
				verificationResult();
				$rootScope.preloader = false;
			});
		}

		$scope.startRecordVideo = function() {
			$scope.verification.recording = true;
			$scope.media.vrec.start();
			$timeout($scope.stopRecordVideo, 7000);
		}

		$scope.stopRecordVideo = function() {
			$scope.media.vrec.stop();
		}

		$scope.decodePassword = function(text){
			var arr = text.split(" "),
			language = config.getLanguage(),
			arr2 = $scope.media.numbers[language],
			arr3 = [];

			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < arr2.length; j++) {
					if (arr[i] == arr2[j].text) arr3.push(arr2[j].number);
				}
			}
			
			return arr3.join(" ");
		}


		$scope.showPopup = function(type){
			$scope.verification[type] = true;
		}

		$scope.hidePopup = function(type){
			startVerirication();
			$scope.verification[type] = false;
		}

		$scope.cancel = function(type){
			$scope.verification[type] = false;
			$location.path("/");
		}

		init();

	}
]);