/**
 * GoogleController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authDropbox: function( req,res ){
                res.redirect('/home');
        }

};
