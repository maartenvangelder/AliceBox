module.exports = {

    getMyAllSongs: function ( req, res )
    {
        sails.log("======> getMyAllSongs");
        Song.find({ or : [ { userId : req.session.user.id } , { 'shareWith.userId' : req.session.user.id }  ] } ,  function( err, songs ){
            res.json( songs );
        });
    },
    
    updateMySong: function ( req, res ){
       sails.log("======> updateMySong");
 
       Song.findOne({ id : req.body.song.id }).done( function(err, song){
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
    }
    
};