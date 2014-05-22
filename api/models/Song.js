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
              required : true,
              index: true
            },

            name: {
              type : 'string',
              required: true,
              index : true
            },

            size: {
              type : 'string',
              required: true
            },


            title: {
              type: 'string',
              index : true
            },

            album: {
              type: 'string',
              index : true
            },

            artist: {
              type: 'string',
              index : true
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