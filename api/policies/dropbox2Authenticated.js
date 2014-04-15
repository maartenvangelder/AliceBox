/**
* Allow any authenticated user.
*/
var passport = require('passport');

module.exports = function(req, res, next){
   
   if( req.session.user ){
       
        if( req.session.user.accessToken && req.session.user.provider == "dropbox" ){
            sails.log("=========Authenticated");
            return next();
        }
        else { //RELOGIN WITH PROVIDER DROPBOX

            passport.authenticate('dropbox-oauth2', { successRedirect: '/', failureRedirect: '/login' } , function( err, user, info ){
                Member.find().where( { id :  req.session.user.id } ).exec( function( err, users ){
                    if( err ){ console.log(err); }
                    sails.log( "==================> USER FIND" );
                    sails.log( users.length );

                    //SET DROPBOX Basic info
                    users[0].dropBoxUserId = req.session.user.dropBoxUserId = user.id;
                    users[0].dropBoxToken = user.accessToken;
                    users[0].loginUser.accessToken = req.session.user.accessToken  = user.accessToken;
                    users[0].dropBoxQuota = user._json.quota_info;
                    users[0].loginUser.provider = req.session.user.provider = "dropbox";

                    users[0].save( function( err, model ){
                        if( err ){ 
                            sails.log( "ERROR:" + err );
                        };
                        sails.log( model );
                        return res.redirect('/home');
                    });
                } );
            })(req, res, next);
        }
    
   }
   
   else{ //FIST LOGIN BY DROPBOX
       
        passport.authenticate('dropbox-oauth2', { successRedirect: '/',
                                         failureRedirect: '/login' } , function( err, user, info ){

        if (user) {
             
             sails.log("===> dropbox info");
             sails.log(user._json.quota_info);
             
             async.waterfall([
                 function(callback){
                     Member.find()
                         .where( { dropBoxUserId : user.id } )
                         .exec( function( err, users ){
                             if( err ){ console.log(err); }
                             callback(null, users);
        //                        sails.log( "==================> USER FIND" );
        //                        sails.log( users.length );
                      } );
                 },
                 function( users, callback){
                     if( !users || users.length == 0 ){

                         sails.log( "=====> NO USER ");
                         Member.create( { name :  user.displayName , dropBoxUserId : user.id , 
                                          dropBoxToken: user.accessToken , dropBoxQuota : user._json.quota_info ,
                                          memberAuthenType : "dropbox" ,  loginUser : user , themeType : "default" } , 
                                      function( err , model ){
                           if( err ){ 
                               sails.log( "ERROR:" );
                               sails.log( err ); 
                           };
                           sails.log( "=====> CREATED USER ok ");
        //                      sails.log(  model );
                           callback(null, model );
                         });
                     }else{
                         sails.log( "=====> HAVE USER ");
                         sails.log( users );
                         Member.update( { "dropBoxUserId" : user.id } , { dropBoxToken: user.accessToken , dropBoxQuota : user._json.quota_info } ,
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

         }
         else{
             console.log("===redirect");
             //server.closeServer();
             return res.redirect('/login');
         }

        })(req, res, next);
   
   }
}
