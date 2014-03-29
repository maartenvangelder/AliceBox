/**
 * AuthController
 *
 */
var passport = require('passport');

module.exports = {

        login: function (req,res)
        {
                res.view({ message:"" , layout: "login_layout"});
        },

        process: function(req, res)
        {
                console.log("==================");
                passport.authenticate('local', function(err, user, info)
                {
                        console.log( err );
                        if ((err) || (!user))
                        {
                                res.redirect('/login');
                                return;
                        }

                        req.logIn(user, function(err)
                        {
                                if (err)
                                {
                                        res.view();
                                        return;
                                }
                                return;
                        });
                })(req, res);
        },

        logout: function (req,res)
        {
//                req.logout();
                delete req.session.user;
                res.redirect('/login');
        },

        authGoogle: function( req,res ){                
                res.redirect('/');
        },
                
        isHasDropboxId: function (req, res)
        {
                if( req.session.user.dropBoxUserId ){
                    res.json({ isHas : true });
                }
                else{
                    res.json({ isHas : false });
                }
                
        }

};



/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 *		REST and CRUD shortcut blueprints are only enabled if a matching model file
 *		(`models/Auth.js`) exists.
 *
 * NOTE:
 *		You may also override the logic and leave the routes intact by creating your own
 *		custom middleware for AuthController's `find`, `create`, `update`, and/or
 *		`destroy` actions.
 */

module.exports.blueprints = {

        // Expose a route for every method,
        // e.g.
        //	`/auth/foo` => `foo: function (req, res) {}`
        actions: true,


        // Expose a RESTful API, e.g.
        //	`post /auth` => `create: function (req, res) {}`
        rest: true,


        // Expose simple CRUD shortcuts, e.g.
        //	`/auth/create` => `create: function (req, res) {}`
        // (useful for prototyping)
        shortcuts: true

};
