module.exports = {

    getMyAllSongs: function ( req, res )
    {
        sails.log("======> getMyAllSongs");
        Song.find().where({ userId : req.session.user.id }).exec( function( err, songs ){
            res.json( songs );
        });
    }
    
};