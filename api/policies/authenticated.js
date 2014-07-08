/**
* Allow any authenticated user.
*/
// var passport = require('passport');


module.exports = function(req, res, next){
   
   if (req.session.user){
        sails.log.debug("=====> Authenticated" + req.session.user );

        //CHECK APP CONFIG
        if( !sails.config.AliceBox.MAINTENANCE ){
        	return next();	
        }
        else{
        	return res.render('maintainance');
        }
        
   }
   
   else{
        sails.log.debug("=====>False Authenticate");
        return res.redirect('/login');
   }
  
}
