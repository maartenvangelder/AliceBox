module.exports = {

    countMySongs: function ( req, res )
    {
        Song.count( { userId : req.session.user.id }).done(function( err, songs ){
//            sails.log(songs);
            res.json( songs );
        });
    },
    
    countMyAlbum: function ( req, res )
    {
        Song.count().where( { userId : req.session.user.id } )
                   .groupBy('album').sum('album').exec( function( err, cnt ){
            if( err ){
                sails.log( err );
            }
            res.json(cnt);
            
        });
    },
    
    countMyArtist: function ( req, res )
    {
        Song.count().where( { userId : req.session.user.id } )
                   .groupBy('artist').sum('artist').exec( function( err, cnt ){
            if( err ){
                sails.log( err );
            }            
            res.json( cnt );
            
        });
    },
    
    countMyPlaylist: function ( req, res )
    {
        Playlist.count().where({ userId : req.session.user.id }).exec( function( err, cnt ){ 
            if(err){ sails.log(err); }
            res.json( cnt );
        });
    }
        
};