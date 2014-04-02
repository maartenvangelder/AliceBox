module.exports = {

    getMyAllSongs: function ( req, res )
    {
        sails.log("======> getMyAllSongs");
        Song.find({ or : [ { userId : req.session.user.id } , { 'shareWith.userId' : req.session.user.id }  ] } ,  function( err, songs ){
            res.json( songs );
        });
    }
    
};