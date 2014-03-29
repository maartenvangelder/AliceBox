'use strict';

/* Controllers */

/**
 *
 * TODO: Bug on update playlist, the current playlist not update in player
 */
/* App Module */

var uploadPage = angular.module('uploadPage', [
  'ngRoute',
  'uploadPageController'
]);

var uploadPageController = angular.module('uploadPageController', ['ngResource','adaptive.detection']);

uploadPageController.controller('uploadController', ['$scope', '$log', '$http' , '$detection', 
  function($scope, $log ,$http,$detection ) {
    
    $scope.test = "HELLO";
    
//    $detectionProvider.setUserAgent('angular browser');
    
//    alert( $detection.isAndroid());
//    alert( $detection.isiOS());
    
    Dropzone.options.myAwesomeDropzone = { 
                                            acceptedFiles : ".mp3,.wav,.m4a" 
                                         };

}]);

