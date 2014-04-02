module.exports = {

    searchSongAdvance: function ( req, res )
    {
        sails.log("======> searchSongAdvance");
        Song.find({ or : [ { name : { contains : req.body.songName } } , { album : { contains : req.body.albumName } } , { artist : { contains : req.body.artistName }  } ] } ,  function( err, songs ){
            res.json( songs );
        });
    }
    
};