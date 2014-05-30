/**
 * GoogleController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authGoogle: function( req,res ){
                res.redirect('/home');
        }
	
};
