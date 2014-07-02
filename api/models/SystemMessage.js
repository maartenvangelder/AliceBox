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
		      type : 'json',// { jp : "Japanese" , vn : "Vietnamese", en : "English" }
	          required : true
		    },

		    title: {
		      type : 'string' //The url to other page
		    },

		    link: {
		      type : 'string' //The url to other page
		    },
            
            type: {
		      type : 'integer' //SystemMessage = 1, Notification = 2 ( In future maybe have Advertising Msg )
		    }
	  }

};