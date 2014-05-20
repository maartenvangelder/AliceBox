/**
 * Song
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

        attributes: {

            userId: {
              type : 'string',
              required : true
            },

            name: {
              type : 'string',
              required: true
            },

            size: {
              type : 'string',
              required: true
            },


            title: {
              type: 'string'
            },

            album: {
              type: 'string'
            },

            artist: {
              type: 'string'
            },

            year: {
              type: 'string'
            },

            fileType: {
              type: 'string'
            },

            url:{
              type: 'string',
              required: true
            },
            permission: {
              type: 'string'
            },

            shareWith: {
               type: 'array'
            }

          }

};