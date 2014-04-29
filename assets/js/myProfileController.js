'use strict';

var myProfileController = angular.module('myProfileController', ['tc.chartjs'] );

myProfileController.controller('myProfileController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
  function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
  
    $rootScope.location = 'myProfile';
    $http.post('/getUserInfo', {} ).success(function(data, status, headers, config){
        $scope.User = data;
    });
    
    $scope.myData = [
        { value : 20, color : "#F7464A" },
        { value : 80, color : "#E2EAE9" }
    ];
    
}]);
