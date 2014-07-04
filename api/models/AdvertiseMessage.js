/**
 * Advertise Message
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
		      type : 'string'
		    },

		    link: {
		      type : 'string' //The url to other page
		    },

		    imgSource: {
		      type : 'string'
		    },
            
            clickCount: {
		      type : 'integer' //Count when user click
		    },

		    type: {
		      type : 'integer' //SystemMessage = 1, Notification = 2 ( In future maybe have Advertising Msg )
		      ,index : true
		    },

		    startDate: {
		      type : 'datetime' //Count when user click
		      ,required : true
		      ,index : true
		    },

		    endDate: {
		      type : 'datetime' //Count when user click
		      ,required : true
		      ,index : true
		    }

	  }

};