'use strict';

var maxListSongs = 20;

/* Controllers */

/**
 *
 * TODO: Bug on update playlist, the current playlist not update in player
 */
/* App Module */

var myAllSongsController = angular.module('myAllSongsController', ['ngResource']);

myAllSongsController.controller('myAllSongsController', ['$scope', '$location' ,'$log', '$http', 'player' ,
  function($scope , $location , $log ,$http , player ) {
  
    /************ Default loading data ***************/
    $http.post('/getMyAllSongs', {} ).success(function(data, status, headers, config){
       $scope.currentPlaylist = {};
       $scope.currentPlaylist.songs = data;
       $scope.currentPlaylist.playingMethod = "arrow-right";
       /****INIT PLAYER*******/
       player.init( $scope );
    });
  
  

    /******* SCOPE FUNCTIONS *********************/
    $scope.viewSongDetails = function( Song ){
          Song.showDetails = !Song.showDetails;
          return Song.showDetails;
    };  

    $scope.wait = function( wait ){
        if( wait ){
            $('#loading_modal').modal('show');
        }
        else{
            $('#loading_modal').modal('hide');
        }
    };
    $scope.updatePlayMethod = function( playingMethod ){
        if( playingMethod !== $scope.currentPlaylist.playingMethod ){
            $scope.currentPlaylist.playingMethod = playingMethod ;
        }
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
 
    /********************************************
     * PLAYER CONTROL
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
 
}]);


/*********************************************************
 * THE AUDIO PLAYER FOR MAIN PAGE
 * 
 * 1/The player need scope to display to the view
 ********************************************************/

myAllSongsController.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);


myAllSongsController.factory('player', ['audio' , '$rootScope', '$log' , function(audio , $rootScope) {
    var player = {
        playing: false,
        current: null,
        currentSong: null,
        currentSongIndex: 0,
        ready: false,
        progress:0,
        duration:0,
        
        playlist: null,
        currentScope: null,

        init: function( scope ) {
            
            player.currentScope = scope;
            player.playlist = scope.currentPlaylist;
            
            //Default currentSong is first in the list;
            if( player.playlist && player.playlist.songs.length > 0 ){
                player.currentSong = player.playlist.songs[0];
                player.currentSongIndex = 0;
            }

        },
        
        updatePlaylist: function( playlist ){
            player.playlist = playlist;
            player.currentScope.currentPlaylist = playlist;
        },
        
        play: function() {
            if( !audio.src || audio.src != player.currentSong.url){
                audio.src = player.currentSong.url;
            }
            audio.play(); // Start playback of the url
            player.playing = true

        },

        stop: function() {
            if (player.playing) {
                audio.pause(); // stop playback
                // Clear the state of the player
                player.playing = false;
                player.ready = false;
                audio.src = player.currentSong.url;
                player.current = null;
            }
        },

        pause: function() {
            if (player.playing) {
                audio.pause(); // stop playback
                // Clear the state of the player
                player.ready = player.playing = false;
                player.current = null;
            }
        },

        playNext: function(){
           if( player.playlist.songs[ player.currentSongIndex +1 ] ){
               var newCurrentSongIndex = player.currentSongIndex +1 ;
               player.currentSong = player.playlist.songs[ newCurrentSongIndex ];
               player.currentSongIndex = newCurrentSongIndex;
               player.play();
           }
           else{
               player.stop();
           }
        },

        playPrev: function(){
           if( player.playlist.songs[ player.currentSongIndex - 1 ] ){
               var newCurrentSongIndex = player.currentSongIndex - 1 ;
               player.currentSong = player.playlist.songs[ newCurrentSongIndex ];
               player.currentSongIndex = newCurrentSongIndex;
               player.play();
           }
           else{
               player.stop();
               if( player.playing ){
                   player.play();
               }
               
           }
        },
        
        playAt: function( index ){
            player.currentSong = player.playlist.songs[ index ];
            player.currentSongIndex = index;
            player.play();
        },

        currentTime: function() {
            return audio.currentTime;
        },
        currentDuration: function() {
            return parseInt(audio.duration);
        },
        
        buffered: function(){
            return parseInt( (audio.buffered.end(0)/audio.duration) * 100 );
        }
    };

    audio.addEventListener('timeupdate', function(evt) {
        $rootScope.$apply(function() {            
            player.currentScope.progress = player.currentTime();
            if( player.currentScope.duration <= 0 ){
                player.currentScope.duration = player.currentDuration();
                player.currentScope.currentSong = player.currentSong;
                player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
            }
        });
    });
    
    audio.addEventListener('loadstart', function() {
        $rootScope.$apply( function(){
            player.currentScope.wait( true );
        }
        );
    });
    
    audio.addEventListener('progress', function() {
        $rootScope.$apply( function(){
            player.currentScope.buffered = player.buffered();
        }
        );
    });
    
    audio.addEventListener('canplay', function() {
        $rootScope.$apply( function(){
            player.currentScope.wait( false );
            player.currentScope.duration = player.currentDuration();
            player.currentScope.currentSong = player.currentSong;
            player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
        });
    });
    
    audio.addEventListener('ended', function() {
        $rootScope.$apply(function(){ 
            switch( player.playlist.playingMethod ){
                case "arrow-right":                        
                    player.playNext();
                    break;
                case "retweet":
                    if( player.currentSongIndex + 1 == player.playlist.songs.length ){
                        player.currentSongIndex = 0;
                        player.currentSong = player.playlist.songs[0];
                        player.play();
                    }
                    else{
                        player.playNext();
                    }
                    break;
                case "random" :
                    var randomIndex = Math.floor( Math.random() * player.playlist.songs.length );
                    player.currentSongIndex = randomIndex;
                    player.currentSong = player.playlist.songs[ randomIndex ];
                    player.play();
                    break;
                case "repeat" :
                    player.play();
                    break;
            }
                
        });
    });

    return player;
}]);