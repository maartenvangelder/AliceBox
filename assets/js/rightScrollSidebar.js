'use strict';

var rightScrollController = angular.module('rightScrollController', ['ngResource']);

rightScrollController.controller('rightScrollController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
    function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
    
      $scope.test = "NAM";
}]);