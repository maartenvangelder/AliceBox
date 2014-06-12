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
      	      type: 'integer',
                    index: true
      	    },
            
            dropBoxToken: {
              type: 'string'  
            },
            
            dropBoxQuota : {
              type: "json"  
            },
            
            memberAuthenType:{
              type: "string",
              required : true
            },
            
            //Login User
            loginUser:{
              type: 'json',
              required : true,
              index : true
            },
            
            /****** PESONALITY******/
            themeType:{
              type: "string",
              required : false
            },
            
            myLocale:{
              type: "string"
            },

            readMessageTime: {
              type: "datetime"
            }
            
	  }

};
