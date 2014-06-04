var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy,
  YahooStrategy = require('passport-yahoo').Strategy,
  DropboxStrategy = require('passport-dropbox').Strategy,
  DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy;

var sails = require('sails');
var SERVER_HOST = sails.config.AliceBox.SERVER_HOST.IP ;


// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  console.log("---> serializeUser");
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("---> deserializeUser");
    done(null, user);
});


//GOOGLE
passport.use(new GoogleStrategy({
    //returnURL: 'http://192.168.0.12:1337/auth/google/return',
    //realm: 'http://192.168.0.12:1337/'
    returnURL: SERVER_HOST +'/auth/google/return',
    realm: SERVER_HOST
  },
  function(identifier, profile, done) {
   console.log("---> used");
   console.log( identifier );
   console.log( profile );
   var user = profile;
   done(null, user);
   ///CREATE USER
  }
));


passport.use(new DropboxOAuth2Strategy({
    clientID: "h6zidp1y35hwif0",
    clientSecret: "gnmor3foz0vp7t8",
    //callbackURL: "http://54.213.237.201:1338/auth/dropbox2/callback"
    callbackURL: SERVER_HOST + "/auth/dropbox2/callback"

  },
  function(accessToken, refreshToken, profile, done) {
    console.log("---> used");
        
        console.log( profile );
        var user = profile;
        done(null, user);
    
  }
));

//FACEBOOK
/*
 *FACEBOOK APP KEY
 *
 * App ID:	1434399070110229
 * App Secret:	90de139a9165521ff69b7e14a74dc263(reset)
 * https://developers.facebook.com/apps/1434399070110229/summary
 * On Production need update the url for facebook app
 **/
passport.use(new FacebookStrategy({
    clientID: "626761510746336",
    clientSecret: "6ea8b441ad506a231421eaffc1d1955d" ,
    callbackURL: SERVER_HOST +'/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
   
   console.log("---> used");
   console.log( profile );
   var user = profile;

   done(null, user);
  }
));
  

/*
 *YAHOO APP KEY
 *
 **/
passport.use(new YahooStrategy({
    returnURL: SERVER_HOST + '/auth/yahoo/return',
    realm: SERVER_HOST + '/'
  },
  function(error, identifier ,done) {
    console.log("---> used");
    console.log( identifier );
    var user = identifier;
    done(null, user);
    ///CREATE USER
  }
));


//TWITTER
passport.use(new TwitterStrategy({
    consumerKey: "XKYGDgq03Gq3taigw3SjwQ",
    consumerSecret: "l8HVMjazzXaCMcO5rToKP6RCVnq7ZCGtesHMXrcCWg",
    callbackURL: SERVER_HOST + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    console.log("---> used");
    console.log( profile );
    var user = profile;
    done(null, user);
  }
));