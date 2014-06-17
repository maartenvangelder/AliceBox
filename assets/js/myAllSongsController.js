'use strict';

/* Controllers */

/* App Module */

var myAllSongsController = angular.module('myAllSongsController', ['ngResource']);

myAllSongsController.controller('myAllSongsController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
  function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
  
    $rootScope.location = 'myAllSongs';
    $scope.permissions = [ {name:'world', value:'World'}, {name:'friend', value:'Friend'}, {name:'me', value:'Private'} ];
    
    /************ Default loading data ***************/
    $http.post('/getMyAllSongs', {} ).success(function(data, status, headers, config){
       $scope.currentPlaylist = {};
       $scope.currentPlaylist.songs = data;
       $scope.currentPlaylist.playingMethod = "arrow-right";
       /****INIT PLAYER*******/
       player.init( $scope );
    });

    $scope.removeMySong = function( song, index ){
        
        $http.post('/myAllSongs/removeMySong', { song : song } ).success(function(data, status, headers, config){
             $http.post('/getMyAllSongs', {} ).success(function(songs, status, headers, config){
                $scope.currentPlaylist.songs = songs;
             });
        });   
    }
  
  

    /******* SCOPE FUNCTIONS *********************/
    $scope.updatePlayMethod = function( playingMethod ){
        if( playingMethod !== $scope.currentPlaylist.playingMethod ){
            $scope.currentPlaylist.playingMethod = playingMethod;
        }
    }
    
    $scope.goUpdateMySong = function( song ){
        $scope.editSong = song;
        $('#updateMySong').modal('show');
    }
    
    $scope.updateMySong = function(){
        $http.post('/updateMySong', { song : $scope.editSong } ).success(function(data, status, headers, config){
             $http.post('/getMyAllSongs', {} ).success(function(songs, status, headers, config){
                $scope.currentPlaylist.songs = songs;
             });
        });
        $('#updateMySong').modal('hide');
    }
 
    /********************************************
     * MUST NEED WHEN USE PLAYER CONTROL
     ********************************************/
    $scope.play = function() {
        player.play();
        $scope.playing = player.playing;   
    };
    
    $scope.stop = function() {
        player.stop();
        $scope.playing = player.playing;
    };
 
    $scope.pause = function() {
        player.pause();
        $scope.playing = player.playing;
    };
    
    $scope.playPrev = function() {
        player.playPrev();
        $scope.playing = player.playing;
    };
    
    $scope.playNext = function() {
        player.playNext();
        $scope.playing = player.playing;
    };
    
    $scope.wait = function( wait ){
        if( wait ){
            $('#loading_modal').modal('show');
        }
        else{
            $('#loading_modal').modal('hide');
        }
    };
    
    $scope.error = function( text ){
        aliceBootbox.dialog( text , "Loading error !!" );
    }
    
    $scope.curentPlayingMinutes = function(){
        if( $scope.progress > 0 ){
            return $scope.convertToMinute( $scope.progress );
        }
        else{ 
            return "";
        }
    };
    
    $scope.convertToMinute = function( seconds ){
        var minutes = Math.floor( seconds/60 );
        var leftSeconds = seconds - ( minutes * 60 );
        return minutes + ":" + leftSeconds;
    };
    
    $scope.viewSongDetails = function( Song ){
        Song.showDetails = !Song.showDetails;
        return Song.showDetails;
    };
    
    $scope.isActive = function( index ){
        if( player.currentSongIndex == index ){
            return "active";
        }
    };
    
    $scope.playThisSong = function( index ){
        if( player.currentSongIndex != index ){
            player.playAt(index);
            $scope.playing = player.playing;
            $scope.progress = player.currentTime();
        }
    }
    /*********************END ADD PLAYER***************************/
 
}]);

