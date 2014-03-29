'use strict';

/* Controllers */
/*TODO - HardCode Config : Constant para*/
var maxListSongs = 20;
var maxListPlaylist = 10;

/**
 *
 * TODO: Bug on update playlist, the current playlist not update in player
 */

var mainPageController = angular.module('mainPageController', ['uiSlider', 'ngResource', 'ui.bootstrap', 'adaptive.detection', 'ngTouch']);

mainPageController.controller('mainController', ['$scope', '$log', '$http' ,'player', '$detection', 
  function($scope, $log ,$http , player , $detection ) {
    
//    alert( $detection.isAndroid());
//    $rootScope.isAdroid = $detection.isAndroid();
//    $rootScope.isIPhone = $detection.isiOS();
    
    
    /********************************************
     * DEDAULT ON PAGE_LOAD
     ********************************************/
    $scope.Search={ word : "" , permission : "world" };
    $scope.newPlaylist = { name : "" };
    /**
     * Get All Playlist when page on load
     */
    $http.post('/getPlaylist', {} ).success(function(data, status, headers, config){
        
        $scope.Playlists = data;
        //Find the currentPlaylist
        data.forEach( function( playlist ){ 
            if( playlist.isSelected ){
                $scope.currentPlaylist = playlist ;
                /****INIT PLAYER*******/
                player.init( $scope );
            }
        });
    });
    
    
    $http.post('/getUserInfo', {} ).success(function(data, status, headers, config){
        $scope.User = data;
    });
    
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
 
    /***********************************
     * HOME PAGE FUNCTIONS
     **********************************/
    
    /**
     * Func Search Song
     */
    $scope.searchSong = function( songs ){ 
        if( $scope.Search.word.trim() != "" ){
            $http.post('/searchSong', { word : $scope.Search.word, permission : $scope.Search.permission , songs : songs } ).success(function(data, status, headers, config){
               $scope.SearchedSongs = data;
            });
        }
    }
    
    $scope.changeSearchPermission = function( permission ){     
        $scope.Search.permission = permission;
    }
    
    $scope.addPlaylist = function(){
        if( $scope.Playlists.length >= maxListPlaylist ){
            bootbox.dialog({
                message: "Warning, Can not add more than " + maxListPlaylist + " playlists!!",
                title: "Have too much playlist.",
                buttons: {
                  danger: {
                    label: "Close",
                    className: "btn-danger",
                    callback: function() {
                      //Do something
                    }
                  }
                }
              });
           return;
        }
        bootbox.prompt("Playlist's name : ", function(result) {                
            if( result != null && result.trim() != "" ){
              $http.post('/addPlaylist', { playlistName : result } ).success(function(data, status, headers, config){
                 $scope.Playlists = data;
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
    
    $scope.selectPlaylist = function( playlist ){
        $scope.currentPlayList = playlist ;
    };
    
    $scope.addSongsToPlaylist = function( songsToPlayList ){
        //Check number of song
        if( $scope.currentPlaylist.songs.length >= maxListSongs ){
            bootbox.dialog({
                message: "Warning, Can not add more than " + maxListSongs + " songs!!",
                title: "Have too much song in this playlist.",
                buttons: {
                  danger: {
                    label: "Close",
                    className: "btn-danger",
                    callback: function() {
                      //Do something
                    }
                  }
                }
              });
           return;
        }
        
        $('#loading_modal').modal('show');
        $http.post('/addSongsToPlaylist', { songsToPlayList : songsToPlayList, playlistId : $scope.currentPlaylist.id  } )
             .success(function(data, status, headers, config){
                    $scope.currentPlaylist = data;
                    player.init( $scope );
                    $('#loading_modal').modal('hide');
        });
    };
    
    $scope.removeASongFromPlaylist = function( songIndex ){
        $('#loading_modal').modal('show');
        $http.post('/removeASongFromPlaylist', { songIndex : songIndex , playlistId : $scope.currentPlaylist.id } )
             .success(function(data, status, headers, config){
                    $scope.currentPlaylist = data;
                    player.init( $scope );
                    $('#loading_modal').modal('hide');
        });
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
            $http.post('/updatePlayingMethod', { playingMethod : playingMethod , playlistId : $scope.currentPlaylist.id } )
                 .success(function(data, status, headers, config){
                        player.updatePlaylist( data );
            });
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
    
    
}]);


/*********************************************************
 * THE AUDIO PLAYER FOR MAIN PAGE
 * 
 * 1/The player need scope to display to the view
 ********************************************************/

mainPageController.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);


mainPageController.factory('player', ['audio' , '$rootScope', '$log' , function(audio , $rootScope) {
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
  


