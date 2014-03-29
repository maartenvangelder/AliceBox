/**
 * GoogleController
 *
 */
module.exports = {

	login: function (req,res)
	{
		res.view();
	},
        
        authDropbox2: function( req,res ){
                res.redirect('/home');
        }

};
