/**
* Allow any authenticated user.
*/
var Dropbox = require("dropbox");
var async = require("async");

module.exports = function(req, res, next){
   
    //Authenticated User
    if (req.session.user){
     return next();
    }


    // Server-side applications use both the API key and secret.
    var client = new Dropbox.Client({
             key: sails.config.AliceBox.DROPBOX_KEY,
             secret: sails.config.AliceBox.DROPBOX_SECRET
             //token: 'XUKR5BpjukcAAAAAAAAAAUd9UC1GrtkghGP1Bms32BwsqRImsemIzMt4EZszuZNS',
             //uid: '181841728' 
             //token: 'XUKR5BpjukcAAAAAAAAAAUd9UC1GrtkghGP1Bms32BwsqRImsemIzMt4EZszuZNS',
             //uid: '239328658' 
    });
    
    

    //var server = new Dropbox.AuthDriver.NodeServer(8191);
    var server = sails.config.AliceBox.DROPBOX_AUTH_DRIVER ;
    
    
    client.authDriver( server );
    
    client.authenticate( false ,function(error, user) {
        if (error) {
          sails.log(error);
          return res.redirect('/login');
        }
      
        if (user) {
//        sails.log("===============CREDENTIALS");
//        sails.log( user );
//        sails.log(user.credentials());
//        sails.log("===============");
        client.getAccountInfo(true, function(err, dropboxUser , userInfo ){

//        sails.log( dropboxUser );
        var credentials = user.credentials();
        
        async.waterfall([
            function(callback){
                Member.find()
                    .where( { "dropBoxUserId" : credentials.uid } )
                    .exec( function( err, users ){
                        if( err ){ console.log(err); }
                        callback(null, users);
                 } );
            },
            function( users, callback){
                if( !users || users.length == 0 ){
                    Member.create( { name :  userInfo.display_name , dropBoxUserId : credentials.uid , dropBoxToken: credentials.token , memberAuthenType : "dropbox" , loginUser : userInfo }, function( err , model ){
                      if( err ){ 
                          sails.log( "ERROR:" + err );
                          sails.log( model ) 
                      };
                      
                      callback(null, model );
                    });
                }else{
                    
                    Member.update( { "dropBoxUserId" : credentials.uid } , { dropBoxToken: credentials.token } ,
                         function( err, model ){
                         
                         if( err ){ 
                             sails.log( "ERROR:" + err );
                             sails.log( model ) 
                         };
                         
                         callback(null, model[0] );
                         
                    });
                }
            }
        ], 
        function (err, user) {
            //Authenticate OK go to home
            sails.log( "=====> USER IS AUTHENTICATED : " + user );
            
            //Authenticate OK go to home
            if( user instanceof Array ){
                req.session.user = user[0];
            }
            else{
                req.session.user = user;
            }
            //server.closeServer();
            return res.redirect('/home');  
        });
        
          
      });

    }
    else{
        console.log("===redirect");
        //server.closeServer();
        return res.redirect('/login');
    }
      
   });
  
}
