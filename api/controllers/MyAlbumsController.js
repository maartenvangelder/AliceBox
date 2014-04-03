module.exports = {

    getMyAlbums : function ( req, res )
    {
        sails.log("======> searchSongAdvance");
        Song.find().where( { or : [ { userId : req.session.user.id } , { 'shareWith.userId' : req.session.user.id }  ] } )
                   .groupBy('album').sum('album').sort({ album : 'asc' }).exec( function( err, albums ){
            if( err ){
                sails.log( err );
            }
            
            sails.log(albums);
            res.json( albums );
            
        });
    },
    
    getSongByAlbum : function ( req, res )
    {
        sails.log(req.body);
        sails.log("======> searchSongAdvance");
        Song.find().where( { or : [ { userId : req.session.user.id , album : req.body.album } , 
                                    { 'shareWith.userId' : req.session.user.id , album : req.body.album }  
                                  ] } )
                   .exec( function( err, songs ){
            if( err ){
                sails.log( err );
            }
            
            sails.log(songs);
            res.json( songs );
            
        });
    }
    
};