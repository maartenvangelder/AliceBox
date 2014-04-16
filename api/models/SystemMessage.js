/**
 * SystemMessage
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
            
            content: {
	      type : 'string',
              required : true
	    },
            
            type: {
	      type : 'integer' //SystemMessage = 1, Notification = 2 ( In future maybe have Advertising Msg )
	    }
	  }

};