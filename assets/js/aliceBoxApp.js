'use strict';

/* App Module */

var aliceBoxApp = angular.module('aliceBoxApp', [
  'ngRoute', 'localization', 'ngSanitize',
  'mainPageController','flowUploadPageController','myAllSongsController' , 'myPlaylistController' , 'myAlbumController' , 'myArtistController' ,  'myProfileController'
]).run( function( $rootScope, $location, $http ,$window , localize ) {
    $rootScope.location = '';
    
    
    $rootScope.unreadCnt = 0 ;

    $http.post('/getUserInfo', {} ).success(function( user , status, headers, config){
        $rootScope.userInfo = user;

        //Set last time read message
        if( !$rootScope.userInfo.readMessageTime ){
          var yesterday = new Date();
          $rootScope.showWelcome = true;
          $rootScope.readMessageTime = yesterday.setDate( yesterday.getDate() - 365 );
        }
        else{
          $rootScope.readMessageTime = new Date( $rootScope.userInfo.readMessageTime );
        }

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

    $http.post('/systemMessage/dailySystemMessage', {} ).success(function( msgs , status, headers, config){
        $rootScope.sysemMessage = msgs; 
        msgs.forEach( function(item) {
          var dateInt =  new Date(item.updatedAt);
          if( $rootScope.readMessageTime < dateInt ){
            $rootScope.unreadCnt++;
          }
        });
    });

    $http.post('/systemMessage/dailyNotifyMessage', {} ).success(function( msgs , status, headers, config){
        $rootScope.notifyMessage = msgs;
        msgs.forEach( function(item) {
          var dateInt =  new Date(item.updatedAt);
          if( $rootScope.readMessageTime < dateInt ){
            $rootScope.unreadCnt++;
          }
        });
    });

    $http.post('/systemMessage/dailyAdvertiseMessage', {} ).success(function( msgs , status, headers, config){
        $rootScope.advertiseMsg = msgs;
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
    
    /***** UPDATE READMESSAGE TIME *****/
    $rootScope.updateReadMessageTime = function(){
        
        var lastMsg  = new Date( $rootScope.sysemMessage[0].updatedAt ).getTime();
        var lastNotify = new Date( $rootScope.notifyMessage[0].updatedAt ).getTime();
        var nowInt = ( lastMsg >  lastNotify ) ? lastMsg : lastNotify ;

        $http.post('/member/updateReadSystemMessage', { readMessageTime : nowInt } ).success(function( user , status, headers, config){
            $rootScope.userInfo = user;
            $rootScope.unreadCnt = 0;
        });
    }

    /******* OPEN ADVERTISEMENT LINK ******/
    $rootScope.openAdwindown = function( ){
        $window.open( 'https://alicebox.mobi' );
    }
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

aliceBoxApp.factory('player', ['audio' , '$rootScope', '$http' , function(audio , $rootScope , $http ) {
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
                audio.src = player.currentSong.url ;
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
            player.playing = true;
            player.play();
        },

        currentTime: function() {
            player.currentScope.currentSong = player.currentSong;
            player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
            if( audio.currentTime && audio.currentTime > 0 ){
                return audio.currentTime;
            }else{
                return 0 ;
            }
        },
        currentDuration: function() {
            return parseInt(audio.duration);
        },
        
        buffered: function(){
            if( audio.buffered.length > 0 && audio.buffered.end(0) && audio.duration >= 0 ){
                return parseInt( (audio.buffered.end(0)/audio.duration) * 100 );
            }
            return 0;
        },

        updateSongListenCnt : function(){
            console.log("==========> Play : ");
            $http.post('/songLifeInfo/updateListenCnt',{ songId : player.currentSong.id }).success( function( data, status, headers, config ){
            } );
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
    
    //Update the songs Listen Count when play
    audio.addEventListener('play', function() {
        $rootScope.$apply( function(){
            player.updateSongListenCnt();
        });
        
    });
    
    audio.addEventListener('canplay', function() {
        $rootScope.$apply( function(){
            player.currentScope.wait( false );
            player.currentScope.duration = player.currentDuration();
            player.currentScope.currentSong = player.currentSong;
            player.currentScope.durationMinutes = player.currentScope.convertToMinute( player.currentScope.duration );
        });

        // $http.post('/songLifeInfo/updateAddCnt',{ songId : songsToPlayList.id }).success( function( data, status, headers, config ){

        // } );
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

    //ERROR Handler
    audio.addEventListener('error', function(e) {
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
    
    return player;
}]);


