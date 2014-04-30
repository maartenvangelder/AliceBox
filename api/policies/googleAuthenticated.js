/**
* Allow any authenticated user.
*/
var passport = require('passport');

module.exports = function(req, res, next){
   
   if (req.session.user){
    sails.log("=========Authenticated");
    return next();
   }
   
   sails.log("=========Authenticated Google");
   passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' } , function( err, user, info ){
                                    
   sails.log("---> authenticate");
   
   if (user) {
      sails.log("=====> user: ");
      sails.log(user);
      
      
      async.waterfall([
            function(callback){
                Member.find()
                    .where( { "loginUser.emails.value" : user.emails[0].value } )
                    .exec( function( err, users ){
                        if( err ){ console.log(err); }
                        callback(null, users);
                 } );
            },
            function( users, callback){
                if( !users || users.length == 0 ){
                    Member.create( { name :  user.displayName , memberAuthenType : "google" , loginUser : user , themeType : "default" }, function( err , model ){
                      if( err ){ 
                          sails.log( "ERROR:" + err );
                          sails.log( model ) 
                      };
                      sails.log( "---> CREATE USER SUCCESS" + model );
                      callback(null, model );
                    });
                }else{
                    callback(null, users );
                }
            }
        ], 
        function (err, user) {
            sails.log( "=====> USER: " + user );
            //Authenticate OK go to home
            if( user instanceof Array ){
                req.session.user = user[0];
            }
            else{
                req.session.user = user;
            }
            return res.redirect('/home');  
        });
   }
   else{
       sails.log("===redirect");
    return res.redirect('/login');
   }
   
   })(req, res, next);
}
