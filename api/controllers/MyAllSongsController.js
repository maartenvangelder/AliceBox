module.exports = {

    getMyAllSongs: function ( req, res )
    {
        sails.log.debug("======> getMyAllSongs");
        Song.find( { deleted : false , or : [ { userId : req.session.user.id } , { 'shareWith.userId' : req.session.user.id }] } ,  function( err, songs ){
            sails.log.debug();
            res.json( songs );
        });
    },
    
    updateMySong: function ( req, res ){
       sails.log.debug("======> updateMySong");
 
       Song.findOne({ id : req.body.song.id , deleted : false }).done( function(err, song){
           if( song ){
                song.title = req.body.song.title;
                song.artist = req.body.song.artist;
                song.album = req.body.song.album;
                song.permission = req.body.song.permission;
                song.save( function( error , rs ){ 
                    res.json( rs );
                });
           }
       });
    },

    removeMySong: function( req, res ){
        sails.log.debug( "======>first: removeSong in playlists" );
        Playlist.find().where( { userId : req.session.user.id } ).exec( function( err, playlists ){
            for( var i=0 ; i < playlists.length ; i++ ){
              var index = playlists[i].songs.indexOf( req.body.song.id );
              if( index >= 0 ){
                //Remove the song in playlist
                playlists[i].songs.splice( index ,1);
                
                playlists[i].save( function( err, rs ){
                  if( err ){
                    sails.log.error( err );
                  }    
                });
              }
            }
       }); 

        sails.log.debug( "======>second: removeSong " );

        Song.findOne({ id : req.body.song.id , deleted : false } ).done( function(err, song){
           if( song ){
                if( song.userId == req.session.user.id ){
                  song.deleted = true;
                }
                else{
                  var index = 0;
                  for( var i = 0 ; i < song.shareWith.length ; i++ ){
                      if( song.shareWith[i].userId == req.session.user.id ){
                          index = i;
                          break;
                      }
                  }
                  song.shareWith.splice( index , 1 );
                }
                song.save( function( error , rs ){ 
                    sails.log.debug( rs );
                    res.json( rs );
                });
           }
       });
    }
    
};