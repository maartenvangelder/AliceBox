/**
 * AuthController
 *
 */
var Dropbox = require("dropbox");
var id3js = require("id3js");
var fs = require("fs");

module.exports = {

    index: function (req,res)
    {
        sails.log("======> HOME");
        //Create Default Playlist when user first login
        Playlist.find().where({ userId : req.session.user.id }).limit(1)
                .exec( function( err, rs ){ 
                    if( err ){ sails.log( err ); }
                    if( !rs || rs.length == 0 ){
                       Playlist.create( { name : "My Default" , userId : req.session.user.id , songs : [] , playingMethod : "arrow-right", isSelected : true } ).done( function( err, playlist ){
                           if( err ){ sails.log( err ); }
                           else{
                               sails.log("Created default playlist");
                           }
                       }); //End create
                    }
                } //End find
        );
        
        res.view();
    },
    
    searchSong: function (req,res)
    {
        var songIds = [];
        if( req.body.songs ){
            req.body.songs.forEach( function( song ){
                songIds.push( song.id );
            } );
        }
        
        if(req.body.word != ""){
            Song.find( { title : { contains : req.body.word.trim() } , permission : { contains: req.body.permission } } ).limit(25).done( function( err, songs ){
                  if( err ){
                      sails.log(err); 
                  }

                  //sails.log( song?s );
                  res.json( songs );
            } );
        }
        else{
            res.json( "" );
        }
        
    },

    getUserInfo: function ( req, res )
    {   
        res.json( req.session.user );
    },
    
    updateThemes: function( req, res ){
        Member.find().where( { id :  req.session.user.id } ).exec( function( err, users ){
            users[0].themeType = req.body.themesName ;
            users[0].save( function( err, model ){
                        if( err ){ 
                            sails.log( "ERROR:" + err );
                        };
                sails.log( "====> Update theme : " + model );
                req.session.user = model;
                
                res.json( model );
            });
        });
    },
    
    updateLocale : function( req, res ){
        Member.find().where( { id :  req.session.user.id } ).exec( function( err, users ){
            users[0].myLocale = req.body.myLocale ;
            users[0].save( function( err, model ){
                        if( err ){ 
                            sails.log( "ERROR:" + err );
                        };
                sails.log( "====> Update theme : " + model );
                req.session.user = model;
                res.json( model );
            });
        });
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
