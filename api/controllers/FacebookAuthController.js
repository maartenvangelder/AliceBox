/**
 * FacebookController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authFacebook: function( req,res ){
                res.redirect('/home');
        }

};

