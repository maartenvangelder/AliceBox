'use strict';

var myProfileController = angular.module('myProfileController', ['ngResource']);

myProfileController.controller('myProfileController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
  function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
  
    $rootScope.location = 'myProfile';
    $http.post('/getUserInfo', {} ).success(function(data, status, headers, config){
        $scope.User = data;
    });
    
    
}]);
