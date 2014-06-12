/**
 * SongDetails
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
            
            songId: {
	      type : 'string',
              required : true,
              index : true
	    },
                    
	    listenCnt: {
	      type : 'integer',
	      required: true
	    },
                    
            addcnt: {
	      type : 'integer',
	      required: false
	    },
            
            /*
             * Vote type : { note_1 : 1 , note_2 : 1 , note_3 :1 , note_4 : 1, note_5 : 1 }
             */
            rating: {
	      type : 'json',
	      required: false
	    },
            
            rateCnt: {
	      type : 'integer',
	      required: false
	    }
            
//            ,nodeCnt: {
//	      type : 'integer',
//	      required: false
//	    }
            
        }

};