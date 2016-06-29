'use strict';

var webaccessApp = angular.module('webaccessApp', [
  'ngRoute',
  'ngResource',
  'gettext',
  'LocalStorageModule'
]);


webaccessApp.config(['$routeProvider', 'localStorageServiceProvider',
  function($routeProvider, localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('webaccessApp')
      .setStorageType('sessionStorage');

    $routeProvider.
    when('/', {
      templateUrl: 'templates/main.html',
      controller: 'MainCtrl'
    }).
    when('/registration', {
      templateUrl: 'templates/registration.html',
      controller: 'RegistrationCtrl'
    }).
    when('/login', {
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    }).
    when('/profile', {
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/logout', {
      templateUrl: 'templates/logout.html',
      controller: 'LogoutCtrl'
    }).
    when('/access', {
      templateUrl: 'templates/access.html',
      controller: 'AccessCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  }
]);

webaccessApp.run(['config', '$rootScope', 'popup', 'localStorageService', '$location',
  function(config, $rootScope, popup, localStorageService, $location) {
    config.setLanguage('en');

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (localStorageService.get("registration")) {
        localStorageService.clearAll();
        $location.url("/");
      }
      if ($rootScope.astream) $rootScope.astream.stop();
      if ($rootScope.vstream) $rootScope.vstream.stop();
      popup.hidden();
    });

  }
]);