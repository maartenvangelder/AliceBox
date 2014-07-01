module.exports = {
    
    dailySystemMessage : function ( req, res )
    {	
    	//Hardcode : only get lastest 5 message
        SystemMessage.find( { type : 1 } ).sort( { updatedAt : 'desc' }).limit(5).done( function( err, msgs ){
            //sails.log.debug( "GET SYSTEM MESSAGE ---> : " );
            //sails.log.debug( msgs );
            res.json( msgs );
        });
    },

	dailyNotifyMessage : function ( req, res )
    {	
    	//Hardcode : only get lastest 5 message
      	SystemMessage.find({ type : 2 }).sort( { updatedAt : 'desc' }).limit(5).done( function( err, msgs ){
            //sails.log.debug( "GET SYSTEM MESSAGE ---> : " );
            //sails.log.debug( msgs );
            res.json( msgs );
        });
    },
    
};