/**
* Allow any authenticated user.
*/
var passport = require('passport');

module.exports = function(req, res, next){
   
   if (req.session.user){
        console.log("=====> Authenticated" + req.session.user );
        return next();
   }
   
   else{
        console.log("=====>False Authenticate");
        return res.redirect('/login');
   }
  
}
