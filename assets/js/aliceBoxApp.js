'use strict';

/* App Module */

var aliceBoxApp = angular.module('aliceBoxApp', [
  'ngRoute',
  'mainPageController','flowUploadPageController','myAllSongsController'
]);

aliceBoxApp.run(function( $rootScope ){
    $rootScope.isAdroid = false ;
    $rootScope.isIPhone = false ;
});

aliceBoxApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: '/templates/main.html',
        controller: 'mainController'
      })
      // route for the about page
      .when('/upload', {
        templateUrl : '/templates/upload.html',
        controller  : 'flowUploadController'
      })
      .when('/myAllSongs', {
        templateUrl : '/templates/allSongs.html',
        controller  : 'myAllSongsController'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }]);
