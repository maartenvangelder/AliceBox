'use strict';

var myProfileController = angular.module('myProfileController', ['tc.chartjs'] );

myProfileController.controller('myProfileController', ['$rootScope', '$scope', '$location' ,'$log', '$http', '$filter' , 'player' , 'aliceBootbox', 
  function($rootScope , $scope , $location , $log ,$http , $filter , player , aliceBootbox ) {
  
    $rootScope.location = 'myProfile';
    $http.post('/getUserInfo', {} ).success(function(data, status, headers, config){
        $scope.User = data;
        if($scope.User.dropBoxQuota ){
            $scope.dropBoxQuota = ( $scope.User.dropBoxQuota.quota )/ 1073741824;
            $scope.normal = ( $scope.User.dropBoxQuota.normal / $scope.User.dropBoxQuota.quota ) * 100;
            $scope.left = ( ( $scope.User.dropBoxQuota.quota - $scope.User.dropBoxQuota.normal ) / $scope.User.dropBoxQuota.quota) * 100;
            $scope.a = parseInt( $filter('number')($scope.normal,0) );
            $scope.b = parseInt( $filter('number')($scope.left,0) );
            
            $scope.myData = [
               { value : $scope.a, color : "#F7464A" },
               { value : $scope.b, color : "#E2EAE9" }
           ];
        }
    });
    
    
   
    
}]);
