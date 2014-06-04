/**
* Allow any authenticated user.
*/
var passport = require('passport');

module.exports = function(req, res, next){
   
   if (req.session.user){
    console.log("=========Authenticated Twitter Account");
    return next();
   }
   
   passport.authenticate('twitter', { successRedirect: '/',
                                    failureRedirect: '/login' } , function( err, user, info ){
                                    
   console.log("---> authenticate twitter");
   
   if (user) {
//      console.log("=====> user");
//      sails.log(user);
      
//      req.session.user = user;
//      return res.redirect('/home');
      
      async.waterfall([
            function(callback){
                Member.find()
                    .where( { "loginUser.id" : user.id , memberAuthenType : "twitter" } )
                    .exec( function( err, users ){
                        if( err ){ console.log(err); }
                        callback(null, users);
                 } );
            },
            function( users, callback){
                if( !users || users.length == 0 ){
                    Member.create( { name :  "AliceBoxTest" , memberAuthenType : "twitter" , loginUser : user }, function( err , model ){
                      if( err ){ 
                          sails.log( "ERROR:" );
                          sails.log( err ); 
                      };
//                      sails.log( "---> CREATE USER SUCCESS" + model );
                      callback(null, model );
                    });
                }else{
                    callback(null, users );
                }
            }
        ], 
        function (err, user) {
//            sails.log( "=====> USER: " + user );
            //Authenticate OK go to home
            req.session.user = user;
            return res.redirect('/home');
        });
        
   }
   else{
       console.log("===redirect");
    return res.redirect('/login');
   }
   
   })(req, res, next);
};
