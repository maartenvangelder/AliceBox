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

    dailyAdvertiseMessage : function ( req, res )
    {   
        //Hardcode : only get lastest 5 message
        AdvertiseMessage.find({ startDate : { lessThan : new Date() } , endDate : { greaterThan : new Date() } }).sort( { updatedAt : 'desc' }).limit(5).done( function( err, msgs ){
            //sails.log.debug( "GET SYSTEM MESSAGE ---> : " );
            sails.log.debug( msgs );
            res.json( msgs );
        });
    }
    
    // insertAdvertiseMessage : function ( req, res )
    // {   
    //     sails.log.debug("insertAdvertiseMessage");
    //     //Hardcode : only get lastest 5 message
    //     AdvertiseMessage.create( { content : { en : "For Advertisement", vn : "Quảng cáo" , jp : "広告募集", }, title : "For Advertisement", startDate :  new Date() , endDate : new Date() }
    //                              , function( err, msgs ){
    //         //sails.log.debug( "GET SYSTEM MESSAGE ---> : " );
    //         sails.log.debug( msgs );
    //         res.json( msgs );
    //     });
    // }
    
};