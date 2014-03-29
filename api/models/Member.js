/**
 * Member
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
            
	    name: {
	      type: 'string',
	      required: true
	    },
	
	    dropBoxUserId: {
	      type: 'integer'
	    },
            
            dropBoxToken: {
              type: 'string'  
            },
            
            memberAuthenType:{
              type: "string",
              required : true
            },
            
            //Login User
            loginUser:{
              type: 'json',
              required : true
            }
            
	  }

};
