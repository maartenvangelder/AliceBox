/**
 * GoogleController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authTwitter: function( req,res ){
                res.redirect('/home');
        }
	
};
