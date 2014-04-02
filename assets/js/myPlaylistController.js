'use strict';
var maxListPlaylist = 10;

var myPlaylistController = angular.module('myPlaylistController', ['ngResource']);

myPlaylistController.controller('myPlaylistController', ['$rootScope', '$scope', '$location' ,'$log', '$http', 'player' , 'aliceBootbox', 
  function($rootScope , $scope , $location , $log ,$http , player , aliceBootbox ) {
  
    $rootScope.location = 'myPlaylist';
    
    /************ Default load playlist data ***************/
    $http.post('/getPlaylist', {} ).success(function(data, status, headers, config){
        
        $scope.myPlaylists = data;
        //Find the currentPlaylist
        data.forEach( function( playlist ){ 
            if( playlist.isSelected ){
                $scope.currentPlaylist = playlist ;
                /****INIT PLAYER*******/
                player.init( $scope );
            }
        });
    });
    

    /******* SCOPE FUNCTIONS *********************/
    $scope.addPlaylist = function(){
        if( $scope.myPlaylists.length >= maxListPlaylist ){
           aliceBootbox.dialog( "Warning, Can not add more than " + maxListPlaylist + " playlists!!",
                                "Have too much playlist." );
           return;
        }
        bootbox.prompt("Playlist's name : ", function(result) {                
            if( result != null && result.trim() != "" ){
              $http.post('/addPlaylist', { playlistName : result } ).success(function(data, status, headers, config){
                 $scope.myPlaylists = data;
              });
            }
        });
    }
    
    $scope.changeSelectPlaylist = function( changedPlaylistId ){
        if( changedPlaylistId != $scope.currentPlaylist.id ){
            $http.post('/changeSelectPlaylist', { playlistId : $scope.currentPlaylist.id , changedPlaylistId : changedPlaylistId } ).success(function(data, status, headers, config){
                   $scope.currentPlaylist = data;
                   player.updatePlaylist( data );
            });
        }
    }
    
    $scope.updatePlayMethod = function( playingMethod ){
        if( playingMethod !== $scope.currentPlaylist.playingMethod ){
            $http.post('/updatePlayingMethod', { playingMethod : playingMethod , playlistId : $scope.currentPlaylist.id } )
                 .success(function(data, status, headers, config){
                        player.updatePlaylist( data );
            });
        }
    };
    
    $scope.selectPlaylist = function( playlist ){
        $scope.currentPlayList = playlist ;
    };
    
    
    
    ///SEARCH SONG FUNCTIONS
//    $scope.searchParam = { songName : "" , albumName :"", artistName :"", playlistId : "" };
    
    $scope.openSearchModal = function( playlistId ){
//        $scope.searchParam.playlistId = playlistId;
        $('#searchSongModal').modal("show");
    };
    
    //NEED BEST VALIDATIONs
    $scope.searchSong = function(){
        $http.post('/searchSongAdvance', $scope.searchParam ).success(function(data, status, headers, config){
           $scope.searchedSongs = data;
        });
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
        }
    }
    /************************************************/
 
}]);
