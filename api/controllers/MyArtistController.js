module.exports = {

    getMyArtist : function ( req, res )
    {
        sails.log("======> getMyArtist");
        Song.find().where( { or : [ { userId : req.session.user.id } , { 'shareWith.userId' : req.session.user.id }  ] } )
                   .groupBy('artist').sum('artist').sort({ album : 'asc' }).exec( function( err, artist ){
            if( err ){
                sails.log( err );
            }
            
            sails.log(artist);
            res.json( artist );
            
        });
    },
    
    getSongByArtist : function ( req, res )
    {
        sails.log(req.body);
        sails.log("======> getSongByArtist");
        Song.find().where( { or : [ { userId : req.session.user.id , artist : req.body.artist } , 
                                    { 'shareWith.userId' : req.session.user.id , artist : req.body.artist }  
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