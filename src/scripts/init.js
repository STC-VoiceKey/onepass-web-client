'use strict';

/* App Module */
var webaccessApp = angular.module('webaccessApp', [
  'ngRoute',
  'ngResource',
  'gettext',
  'LocalStorageModule'
  /*,
    'ngLocationUpdate'*/
]);


webaccessApp.config(['$routeProvider', /*'$locationProvider',*/ 'localStorageServiceProvider', '$httpProvider',
  function($routeProvider, /*$locationProvider,*/ localStorageServiceProvider, $httpProvider) {
    //$locationProvider.html5Mode({enabled: true, requireBase: false});

    //$httpProvider.defaults.headers.common['Accept-Language'] = 'ru-RU';

    localStorageServiceProvider
      .setPrefix('webaccessApp')
      .setStorageType('sessionStorage');

    $routeProvider.
    when('/', {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
    }).
    when('/verification', {
        templateUrl: 'templates/verification.html',
        controller: 'VerificationCtrl'
    }).
    when('/registration', {
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl'
    }).
    when('/profile', {
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/logout', {
      templateUrl: 'templates/logout.html',
      controller: 'LogoutCtrl'
    }).
    when('/404', {
      templateUrl: 'templates/404.html',
      controller: '404Ctrl'
    }).
    otherwise({
      redirectTo: '/404'
    });
  }
]);

webaccessApp.run(['config', '$rootScope', 'loginService', 'storage',
  function(config, $rootScope, loginService, storage) {

    config.languageDefault('ru_RU');
    
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      
      loginService.isLogged();
      
      var media = storage.getMedia();
      
      if (media.arec) media.arec.stream.stop();
      if (media.vrec) media.vrec.stream.stop();
      
    });

    $rootScope.$on("$routeChangeSuccess", function(event, next, current) {
      
    });
  
  }
]);