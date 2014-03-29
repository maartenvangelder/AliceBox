
/**
 * Playlist Controller
 */
module.exports = {
    
   addPlaylist: function (req, res) {
       if( req.body.playlistName != "" ){
           Playlist.create( { name : req.body.playlistName , userId : req.session.user.id ,songs : [] , playingMethod : "arrow-right", isSelected : false } ).done( function( err, playlist ){
                if( err ){ sails.log( err ); }
                else{
                    Playlist.find().where({ userId : req.session.user.id })
                                   .sort({ createdAt: 'asc' })
                                   .exec( function( err, rs ){ 
                                   if(err){ sails.log(err); }
                                   res.json( rs );
                    }); //End Find
                }
           }); //End create
       }
       else{
           res.json("");
       }
   },
   
   getPlaylist: function ( req , res ){
//       sails.log( "===> getPlayList " );
       Playlist.find()
               .where({ userId : req.session.user.id })
               .sort({ createdAt: 'asc' })
               .exec( function( err, rs ){ 
                        if(err){ sails.log(err); }
                        res.json( rs );
       });//End Find
   },
   
   
   addSongsToPlaylist: function ( req , res ){
       Playlist.findOne( { id : req.body.playlistId } )
               .exec( function( err, playlist ){
                playlist.songs.push( req.body.songsToPlayList );
                   playlist.save( function( err, rs ){
                       sails.log(rs);
                       res.json( rs );
                   });
       }); //End Update Songs
   },
   
   removeASongFromPlaylist: function ( req , res ){
       Playlist.findOne( { id : req.body.playlistId } )
               .exec( function( err, playlist ){
                
                //Remove the song on
                playlist.songs.splice(req.body.songIndex,1);
                
                playlist.save( function( err, rs ){
                    res.json( rs );
                });
       }); //End Update Songs
   },
   
   updatePlayingMethod: function ( req , res ){
       Playlist.update( { id : req.body.playlistId } , { playingMethod : req.body.playingMethod } 
                        , function( err, rs ){
                            if( err ){ sails.log( err ); }
                            res.json( rs[0] );
       });
   },
   
   changeSelectPlaylist: function ( req , res ){
       Playlist.update( { id : req.body.playlistId } , { isSelected : false } , function( err, rs ){ //Update old to false
                            if( err ){ sails.log( err ); }
                            Playlist.update( { id : req.body.changedPlaylistId }, { isSelected : true } , function( err, rs ){ //Update new to true
                                res.json( rs[0] );
                       } );
       });
   }
   
};
