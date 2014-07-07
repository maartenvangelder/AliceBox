module.exports = {

    searchSongAdvance: function ( req, res )
    {
        // sails.log("======> searchSongAdvance");
        
        var query = { deleted : false };
        if( req.body.songName && req.body.songName.trim() != "" ){
            query.name = { contains : req.body.songName } ;
        }
        if( req.body.albumName && req.body.albumName.trim() != "" ){
            query.album = { contains : req.body.albumName } ;
        }
        if( req.body.artistName && req.body.artistName.trim() != "" ){
            query.artist = { contains : req.body.artistName } ;
        }

        // Song.find( { deleted : false, or : [ { name : { contains : req.body.songName } } , { album : { contains : req.body.albumName } } , { artist : { contains : req.body.artistName }  } ] } ,  function( err, songs ){
        Song.find( query ,  function( err, songs ){
            res.json( songs );
        });
    },
    
    updateMyPlaylist: function ( req, res )
    {
        if( req.body.editedPlaylist ){
            sails.log("======> updateMyPlaylist");
            Playlist.findOne( { id : req.body.editedPlaylist.id }).done( function( err, playlist ){
                playlist.name = req.body.editedPlaylist.name;
                playlist.save();
                Song.find( { id : playlist.songs , deleted : false } , function( err, songs ){
                                    if( songs && songs.length > 0){
                                       playlist.songs = songs;
                                    }
                                    res.json( playlist );
                          });
            });
        }
    },
    
    removePlaylist: function ( req, res )
    {
        if( req.body.removePlaylist.userId == req.session.user.id ){
            sails.log("======> updateMyPlaylist");
            Playlist.findOne( { id : req.body.removePlaylist.id , userId : req.body.removePlaylist.userId }).done( function( err, playlist ){
                playlist.destroy( function( err ){
                    if(!err){ res.json( { rs : true } ); }
                });
            });
        }
    }
    
};