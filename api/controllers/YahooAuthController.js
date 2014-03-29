/**
 * GoogleController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authYahoo: function( req,res ){
                res.redirect('/home');
        }
	
};
