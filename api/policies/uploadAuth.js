/**
* Allow any authenticated upload file.
*/
var passport = require('passport')
  , DropboxStrategy = require('passport-dropbox').Strategy;

var DROPBOX_APP_KEY = "70jpyh60yh3d8oa"
var DROPBOX_APP_SECRET = "cvqmas9puryggxx";
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new DropboxStrategy({
    consumerKey: DROPBOX_APP_KEY,
    consumerSecret: DROPBOX_APP_SECRET,
    callbackURL: "http://192.168.0.12:1337/member"
  },
  function(token, tokenSecret, profile, done) {
    console.log( "=====> TOKEN"  );
    console.log( token  );
    console.log( tokenSecret  );
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Dropbox profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Dropbox account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


module.exports = function(req, res, next){
   
   if (req.session.user){
    console.log("=========Dropbox Authenticated");
    return next();
   }
   
   passport.authenticate('dropbox', { failureRedirect: '/login' } , function( err, user, info ){
                                    
   console.log("--->dropbox authenticate");
   
   if (user) {
      console.log("=====> dropbox user");
      console.log("====> dropbox" + req.query );
      sails.log(user);
      req.session.user = user;
      return res.redirect('/');
   }
   else{
       console.log("===redirect");
    return res.redirect('/auth/login');
   }
   
   })(req, res, next);
}
