/**
 * Playlist
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
	
	    userId: {
	      type: 'string'
	    },
            
            songs:{
              type: 'array'
            },
            
            playingMethod:{
              type: 'string'
            },
            
            isSelected :{
              type: 'boolean'
            },
            
            permission: {
              type: 'json'
            },
            //Check new song exists in list
            hasThisSong : function( thisSong ) {
                var value;
                songs.forEach( function( song ) {
                    if( song.id == thisSong.is ){
                       value = true;
                    }
                });
                return value;
            }
            
        }

};