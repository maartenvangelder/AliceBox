'use strict';

var myAlbumController = angular.module('myAlbumController', ['ngResource']);

myAlbumController.controller('myAlbumController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
    function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
    $rootScope.location = 'myAlbum';


    /************ Default load playlist data ***************/
    $http.post('/getMyAlbums', {} ).success(function(data, status, headers, config){
        $scope.myAlbums = data;
        if( data && data.length > 0 ){
            $scope.currentAlbum = data[0];
            //get default songs
            $scope.getSongByAlbum( $scope.currentAlbum );
        }
    });

    $scope.selectAlbum = function( album ){
        $scope.currentAlbum = album;
        $scope.getSongByAlbum( album );
    }


    /******* SCOPE FUNCTIONS *********************/
    $scope.updatePlayMethod = function( playingMethod ){
        if( playingMethod !== $scope.currentPlaylist.playingMethod ){
            $scope.currentPlaylist.playingMethod = playingMethod;
        }
    };
    
    //GET SONG
    $scope.getSongByAlbum = function( album ){
        $http.post('/getSongByAlbum', { album : album.album } ).success(function(data, status, headers, config){
            $scope.currentPlaylist = {};
            $scope.currentPlaylist.songs = data;
            $scope.currentPlaylist.playingMethod = "arrow-right";
            /****INIT PLAYER*******/
            player.init( $scope );
        });
    };
 
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