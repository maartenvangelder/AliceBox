'use strict';

/* App Module */

var aliceBoxApp = angular.module('aliceBoxApp', [
  'ngRoute', 'localization',
  'mainPageController','flowUploadPageController','myAllSongsController' , 'myPlaylistController' , 'myAlbumController' , 'myArtistController' ,  'myProfileController'
]).run( function( $rootScope, $location, $http ,$window , localize ) {
    $rootScope.location = '';
    $http.post('/getUserInfo', {} ).success(function( user , status, headers, config){
        $rootScope.userInfo = user; 
        
        //SET LOCALE
        if( user.myLocale ){
            localize.setLanguage( user.myLocale );
        }
        //SET THEME
        switch ( $rootScope.userInfo.themeType ){
            case "default":
                $rootScope.themes = 'css/themes.css';
                break;
            case "amethyst":
                $rootScope.themes = 'css/themes/amethyst.css';
                break;
            case "dragon":
                $rootScope.themes = 'css/themes/dragon.css';
                break;
            case "emerald":
                $rootScope.themes = 'css/themes/emerald.css';
                break;
            case "grass":
                $rootScope.themes = 'css/themes/grass.css';
                break;
            case "river":
                $rootScope.themes = 'css/themes/river.css';
                break;
        }
        
    });
    
    $rootScope.mstUpdateTheme = function( themesName ){
        $http.post('/updateThemes', { themesName : themesName } ).success(function( user , status, headers, config){
            $rootScope.userInfo = user;
            $window.location.reload();
        });
    };
    
    /**** LANGUAGE ******/
    $rootScope.setLanguage = function( language ) {
        localize.setLanguage( language );
        $http.post('/updateLocale', { myLocale : language } ).success(function( user , status, headers, config){
            $rootScope.userInfo = user;
        });
    };
   
});

aliceBoxApp.config(['$routeProvider',
  function($routeProvider) {
   
    $routeProvider.
      when('/home', {
        templateUrl: '/templates/main.html',
        controller: 'mainController'
      })
      // route for the about page
      .when('/upload', {
        templateUrl : '/templates/upload.html',
        controller  : 'flowUploadController'
      })
      .when('/myAllSongs', {
        templateUrl : '/templates/allSongs.html',
        controller  : 'myAllSongsController'
      })
      .when('/myPlaylist', {
        templateUrl : '/templates/myPlaylist.html',
        controller  : 'myPlaylistController'
      })
      .when('/myAlbum', {
        templateUrl : '/templates/myAlbum.html',
        controller  : 'myAlbumController'
      })
      .when('/myArtist', {
        templateUrl : '/templates/myArtist.html',
        controller  : 'myArtistController'
      })
      .when('/myProfile', {
        templateUrl : '/templates/myProfile.html',
        controller  : 'myProfileController'
      })
      .otherwise({
        redirectTo: '/home'
      });
  }]);

/***************************************
 * BOOTBOX ALERT, COMFIRM SERVICES
 ***************************************/
aliceBoxApp.factory('aliceBootbox', function() {
    var aliceBootbox = { };
  
    aliceBootbox.dialog = function( message , title ){
        bootbox.dialog({
          message: message,
          title: title,
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
    }
    
return aliceBootbox;
});

/*********************************************************
 * THE AUDIO PLAYER FOR MAIN PAGE
 * 
 * 1/The player need scope to display to the view
 ********************************************************/

aliceBoxApp.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);

aliceBoxApp.factory('player', ['$document', '$rootScope', '$log' , function( $document, $rootScope) {
    
//    var audio = $document[0].createElement('audio'); 
    
    var player = {
        playing: false,
        current: null,
        currentSong: null,
        currentSongIndex: 0,
        ready: false,
        progress:0,
        duration:0,
        audioList : [],
        
        playlist: null,
        currentScope: null,

        init: function( scope , songNumber ) {
            
            player.currentScope = scope;
            player.playlist = scope.currentPlaylist;
            
            //Default currentSong is first in the list;
            if( player.playlist && player.playlist.songs.length > 0 ){
                player.currentSong = player.playlist.songs[0];
                player.currentSongIndex = 0;
            }

			player.audioList = [];
            for( var i = 0; i < songNumber; i++ ){
                var songObj = $document[0].createElement('audio');
//           		songObj.src = player.playlist.songs[i].url;
           		songObj = player.addAudioEvent( songObj );
                player.audioList.push( songObj );
            }
            
        },
        
        updatePlaylist: function( playlist ){
            player.playlist = playlist;
            player.currentScope.currentPlaylist = playlist;
        },
        
        play: function() {
//            audio.pause();
//            audio = player.audioList[player.currentSongIndex];
            //var currentAudio = player.audioList[player.currentSongIndex];
            
//            if( !player.audioList[player.currentSongIndex].src ){

 //               player.audioList[player.currentSongIndex].src = player.currentSong.url;
 //               player.addAudioEvent( player.audioList[player.currentSongIndex] );
//                currentAudio.src = player.audioList[player.currentSongIndex].src;    
 //           }
            
//            if( !audio.src || audio.src != player.currentSong.url){
//                
//                audio.src = player.currentSong.url ;
//            }
            alert("play");
            if( player.audioList[player.currentSongIndex].src != player.currentSong.url ){
            	alert("add new src");
            	player.audioList[player.currentSongIndex].src = player.currentSong.url;
            }
            alert(player.audioList[player.currentSongIndex].src);
            player.audioList[player.currentSongIndex].play(); // Start playback of the url
            player.playing = true

        },

        stop: function() {
            if (player.playing) {
            	alert("stop");
                player.audioList[player.currentSongIndex].pause(); // stop playback
                // Clear the state of the player
                player.playing = false;
                player.ready = false;
//                player.audioList[player.currentSongIndex].src = player.currentSong.url;
                player.current = null;
            }
        },

        pause: function() {
            if (player.playing) {
                player.audioList[player.currentSongIndex].pause(); // stop playback
                // Clear the state of the player
                player.ready = player.playing = false;
                player.current = null;
            }
        },

        playNext: function(){
           player.stop();
           if( player.playlist.songs[ player.currentSongIndex +1 ] ){
               alert("playNext");
               player.playAt( player.currentSongIndex +1 );
//               var newCurrentSongIndex = player.currentSongIndex +1 ;
//               player.currentSong = player.playlist.songs[ newCurrentSongIndex ];
//               player.currentSongIndex = newCurrentSongIndex;
//               player.playing = true;
//               player.play();
//               player.currentScope.currentSong = player.currentSong;
//               player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
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
            player.stop();
            player.currentSong = player.playlist.songs[ index ];
            player.currentSongIndex = index;
            player.playing = true;
            player.play();
        },

        currentTime: function() {
        	if( player.audioList[player.currentSongIndex].currentTime && player.audioList[player.currentSongIndex].currentTime > 0 ){
            	player.currentScope.currentSong = player.currentSong;
                player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
            	return player.audioList[player.currentSongIndex].currentTime;
            }else{
            	player.currentScope.currentSong = player.currentSong;
                player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
            	return 0 ;
            }
        },
        currentDuration: function() {
        	if( player.audioList[player.currentSongIndex].duration && player.audioList[player.currentSongIndex].duration > 0 ){
            	return parseInt(player.audioList[player.currentSongIndex].duration);
            }else{
            	return 0;
            }
        },
        
        buffered: function(){
            if(  player.audioList[player.currentSongIndex].duration >= 0 ){
                    return parseInt( (player.audioList[player.currentSongIndex].buffered.end(0)/player.audioList[player.currentSongIndex].duration) * 100 );
                }
            else{
            	return 0;
            }
        },
        
        addAudioEvent : function( audioItem ){
            audioItem.addEventListener('timeupdate', function(evt) {
                $rootScope.$apply(function() {            
                    player.currentScope.progress = player.currentTime();
                    if( player.currentScope.duration <= 0 ){
                        player.currentScope.duration = player.currentDuration();
                        player.currentScope.currentSong = player.currentSong;
                        player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
                    }
                });
            });

            audioItem.addEventListener('loadstart', function() {
                  alert( "loadstart" );
                  
//                $rootScope.$apply( function(){
//                    player.currentScope.wait( true );
//                }
//                );
            });
            
            audioItem.addEventListener('durationchange', function() {
                  alert( "durationchange" );
            });
            
            audioItem.addEventListener('progress', function() {
//                $rootScope.$apply( function(){
                    player.currentScope.buffered = player.buffered();
                    alert(player.audioList[player.currentSongIndex].src);
                	alert("progress1");
//                });
            });

            audioItem.addEventListener('canplay', function() {
            	  alert("canplay");
//                $rootScope.$apply( function(){
                    player.currentScope.wait( false );
                    player.currentScope.duration = player.currentDuration();
                    player.currentScope.currentSong = player.currentSong;
                    player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
//                });
            });

            audioItem.addEventListener('ended', function() {
//                $rootScope.$apply(function(){ 
                    switch( player.playlist.playingMethod ){
                        case "arrow-right":                        
                            player.playNext();
                            break;
                        case "retweet":
                            if( player.currentSongIndex + 1 == player.playlist.songs.length ){
                                player.currentSongIndex = 0;
                                player.currentSong = player.playlist.songs[0];
                                player.play();
                                console.log("Second");
                                console.log( player.currentSongIndex );
                            }
                            else{
                                player.playNext();
                                console.log("First");
                                console.log( player.currentSongIndex );
                                
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

//                });
            });

            //ERROR Handler
            audioItem.addEventListener('error', function(e) {
                 switch (e.target.error.code) {
                    case e.target.error.MEDIA_ERR_ABORTED:
                      player.currentScope.error( "You aborted the audio playback." );
                      break;
                    case e.target.error.MEDIA_ERR_NETWORK:
                      player.currentScope.error( "A network error caused the audio download to fail." );
                      break;
                    case e.target.error.MEDIA_ERR_DECODE:
                      player.currentScope.error( "The audio playback was aborted due to a corruption problem or because your browser did not support." );
                      break;
                    case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:              
                      player.currentScope.error( "Either because the server or network failed or format not support." );
                      break;
                    default:
                      player.currentScope.error( "An unknown error occurred." );
                      break;
                 }
            });
            //Return after add all event;
  			return audioItem;
        }
        
    };

    
    return player;
}]);


