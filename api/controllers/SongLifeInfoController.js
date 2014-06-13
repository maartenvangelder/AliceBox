module.exports = {

    updateListenCnt : function ( req, res )
    {
        SongLifeInfo.findOne( { songId : req.body.songId } , function( err , songInfo ){
            sails.log.debug( songInfo );
            songInfo.listenCnt++;
            songInfo.save( function( err , obj ){ 
                if( err ){
                    saisl.log.debug( err );
                }
                res.json( obj );
            });
        });
    },
    updateAddCnt : function ( req, res )
    {
        SongLifeInfo.findOne( { songId : req.body.songId } ).done( function( err , songInfo ){
            sails.log.debug( songInfo );
            songInfo.addCnt++;
            sails.log.debug(  "songInfo ====>");
            sails.log.debug(  songInfo );
            songInfo.save( function( err , obj ){ 
                if( err ){
                    saisl.log.debug( err );
                }
                res.json( obj );
            });
        });
    }
    
};