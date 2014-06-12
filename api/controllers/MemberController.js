/**
 * MemberController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  
  updateReadSystemMessage : function( req, res ){
      Member.find().where( { id :  req.session.user.id } ).exec( function( err, users ){
            users[0].readMessageTime = new Date(req.body.readMessageTime) ;
            users[0].save( function( err, model ){
                        if( err ){ 
                            sails.log( "ERROR:" + err );
                        };
                sails.log.debug( "====> Update readMessageTime: " + model );
                req.session.user = model;
                
                res.json( model );
            });
        });
  },
  
  /**
   * Action blueprints:
   *    `/member/find`
   */
   find: function (req, res) {
    Member.find()
          .where( { "loginUser.emails.value" : 'nam@cocone.co.jp' } )
          .exec( function( err, users ){
              if( err ){ console.log(err); }
              console.log( users );
          } );
    // Send a JSON response
    return res.json({
      hello: 'world find'
    });
  },


  /**
   * Action blueprints:
   *    `/member/findAll`
   */
   findAll: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world findAll'
    });
  },

  /**
   * Action blueprints:
   *    `/member/createMe`
   */
   createMe: function (req, res) {
    Member.create( { name :  "nam" , memberAuthenType : "google" }, function( err , model ){
    	if( err ){ console.log(model) };
        console.log( model );
    	// Send a JSON response
        return res.json({
          hello: 'world findMe',
          member: model
        });
    })
  },

  /**
   * Action blueprints:
   *    `/member/create`
   */
   create: function (req, res) {
	
    // Send a JSON response
    return res.json({
      hello: 'world create'
    });
  },


  /**
   * Action blueprints:
   *    `/member/update`
   */
   update: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world update'
    });
  },


  /**
   * Action blueprints:
   *    `/member/destroy`
   */
   destroy: function (req, res) {
    
    // Send a JSON response
    return res.json({
      hello: 'world destroy'
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MemberController)
   */
  _config: {}

  
};
