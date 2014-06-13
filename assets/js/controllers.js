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


mainPageController.controller('mainController', ['$rootScope' ,'$scope', '$log', '$http' ,'player', '$detection', 'aliceBootbox',
  function($rootScope, $scope, $log ,$http , player , $detection , aliceBootbox ) {
    $rootScope.location = 'home';
    
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
                $http.post('/getSelectPlaylist', { playlistId : playlist.id } ).success(function(data, status, headers, config){
                    $scope.currentPlaylist = data;
                    /****INIT PLAYER*******/
                    player.init( $scope );
                });
            }
        });
    });
    
    
    $http.post('/getUserInfo', {} ).success(function(data, status, headers, config){
        $scope.User = data;
    });
   
   
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
           aliceBootbox.dialog( "Warning, Can not add more than " + maxListPlaylist + " playlists!!",
                                "Have too much playlist." );
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
    };
    
    $scope.selectPlaylist = function( playlist ){
        $scope.currentPlayList = playlist ;
    };
    
    $scope.addSongsToPlaylist = function( songsToPlayList ){
        //Check number of song
        if($scope.currentPlaylist && $scope.currentPlaylist.songs.length >= maxListSongs ){
           aliceBootbox.dialog( "Warning, Can not add more than " + maxListSongs + " songs!!" 
                                , "Have too much song in this playlist." );           
           return;
        }
        
        $('#loading_modal').modal('show');
        $http.post('/addSongsToPlaylist', { songsToPlayList : songsToPlayList, playlistId : $scope.currentPlaylist.id  } )
             .success(function(data, status, headers, config){
                    $scope.currentPlaylist = data;
                    player.init( $scope );
                    $('#loading_modal').modal('hide');
            $http.post('/songLifeInfo/updateAddCnt',{ songId : songsToPlayList.id }).success( function( data, status, headers, config ){

            } );
        });
    };
    
    $scope.removeASongFromPlaylist = function( songId ){
        $('#loading_modal').modal('show');
        $http.post('/removeASongFromPlaylist', { songId : songId , playlistId : $scope.currentPlaylist.id } )
             .success(function(data, status, headers, config){
                    $scope.currentPlaylist = data;
                    player.init( $scope );
                    $('#loading_modal').modal('hide');
        });
    };
    
    $scope.updatePlayMethod = function( playingMethod ){
        if( playingMethod !== $scope.currentPlaylist.playingMethod ){
            $http.post('/updatePlayingMethod', { playingMethod : playingMethod , playlistId : $scope.currentPlaylist.id } )
                 .success(function(data, status, headers, config){
                        player.updatePlaylist( data );
            });
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
    
}]);

