module.exports = {
    
    dailySystemMessage : function ( req, res )
    {
        SystemMessage.find().sort({updatedAt : 'desc'}).limit(3).done( function( err, msgs ){
            sails.log.debug( "GET SYSTEM MESSAGE ---> : " );
            sails.log.debug( msgs );
            res.json( msgs );
        });
    }
    
};