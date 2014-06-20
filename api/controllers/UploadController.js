/**
 * AuthController
 *
 */
var Dropbox = require("dropbox");
var id3js = require("id3js");
var fs = require("fs");
var utf8 = require('utf8');

module.exports = {
    
    upload: function (req,res)
    {   
        if( req.session.user.dropBoxUserId && req.session.user.dropBoxToken  ){
            res.view({ message:"" , layout: "upload_layout"});
        }else{
            res.view('auth/login', { message : "Please Login by Dropbox to upload your song !!" });
        }
        
    },
    
    flowUpload: function (req,res)
    {   
//        sails.log("====> flowUpload");
//        sails.log( req.body );
//        sails.log("====> ALL");
//        sails.log( req.files );
        
        // Server-side applications use both the API key and secret.
        var client = new Dropbox.Client({
            key: sails.config.AliceBox.DROPBOX_KEY ,
            secret: sails.config.AliceBox.DROPBOX_SECRET ,
            token: req.session.user.dropBoxToken ,
            uid: req.session.user.dropBoxUserId
        });

        //var server = new Dropbox.AuthDriver.NodeServer(8191);
        var server = sails.config.AliceBox.DROPBOX_AUTH_DRIVER ;
        sails.log("=====>BEFORE AUTHENTICATE");
        client.authDriver( server );
        sails.log("=====>AFTER DROPBOX AUTHENTICATE");

        client.authenticate( false ,function(error, clientA) {
            if (error) {
             sails.log("=====>DROPBOX AUTHENTICATE ERROR");
             sails.log(error);
            }

            //sails.log("===============");
            sails.log( clientA );


            id3js({ file: req.files.file.path , type: id3js.OPEN_LOCAL }, function(err, tags) {
                if(err){ 
                    sails.log("=====> TAGS ERROR :");
                    sails.log( err );
                }
             
                
                fs.readFile( req.files.file.path , function read( err, data ){
                    if( err )console.log( err );

                    sails.log("=====> READFILE ....");

                    //Write fiel
                    client.writeFile( req.files.file.name , data , function(error, status ) {

                        if(error) console.log(error);

                        console.log( "---> WRITTING FILE :...." );

                        client.makeUrl( req.files.file.name , { downloadHack : true, longUrl : true }, function( err, url ){
                            if(err) console.log(err);
                            
                            
                            //TODO -> This bad code to remove null unicode \u0000
                            if( tags.title ){
                                var arrayStr = tags.title.split( "\u0000");
                                var strTitle = '';
                                arrayStr.forEach( function(item){
                                    strTitle += item;
                                });
                                if( arrayStr.length > 0 ){
                                    tags.title = strTitle;
                                }    
                            }
                            if( tags.artist ){
                                var arrayStr = tags.artist.split( "\u0000");
                                var strTitle = '';
                                arrayStr.forEach( function(item){
                                    strTitle += item;
                                });
                                if( arrayStr.length > 0 ){
                                    tags.artist = strTitle;
                                }    
                            }
                            if( tags.album ){
                                var arrayStr = tags.album.split( "\u0000");
                                var strTitle = '';
                                arrayStr.forEach( function(item){
                                    strTitle += item;
                                });
                                if( arrayStr.length > 0 ){
                                    tags.album = strTitle;
                                }    
                            }
                            
                            sails.log( tags.title );
                            
                            
                            if( !tags.title || typeof tags.title == 'undefined' || tags.title.trim() == ''  ) tags.title = req.files.file.name ;
                            if( !tags.artist || typeof tags.artist == 'undefined' || tags.artist.trim() == "" ) tags.artist = "Unknown" ;
                            if( !tags.album || typeof tags.album == 'undefined' || tags.album.trim() == "" ) tags.album = "Unknown" ;
                            if( !tags.year || typeof tags.year == 'undefined' || tags.year.trim() == "" ) tags.year = "Unknown" ;
                            
                            //Replace unnecessary text
                            tags.title = tags.title.replace(/\_/g,' ');
                            tags.title = tags.title.replace(/\.mp3/g,' ');
                            
                            //SAVE SONG INFO TO DATABASE
                            Song.create( { userId : req.session.user.id , name : req.files.file.name , 
                                           size : req.files.file.size , title: tags.title , album : tags.album  ,
                                           artist : tags.artist , year : tags.year ,fileType : req.files.file.headers , 
                                           url : url.url , permission : req.body.shareTo , shareWith : [] , deleted : false }, function( err , model ){
                                if( err ){ 
                                    sails.log( "ERROR:" + err );
                                    sails.log( err ) 
                                };
                                
                                SongLifeInfo.create( { songId : model.id , listenCnt : 0 , addCnt : 1  } , function( err , songInfo ){
                                    //sails.log.debug( songInfo );
                                });
//                              sails.log( "---> CREATE SONG SUCCESS" + model );

                                if( req.body.playlist ){
                                    if( Array.isArray(req.body.playlist) ){
                                        req.body.playlist.forEach( function( playlistId ){
                                            Playlist.findOne( { id : playlistId } )
                                                    .exec( function( err, playlist ){
                                                     playlist.songs.push( model.id );
                                                        playlist.save( function( err, rs ){
                                                            
                                                        });
                                            }); //End Update Songs
                                        });
                                    }
                                    else{
                                        Playlist.findOne( { id : req.body.playlist } )
                                                .exec( function( err, playlist ){
                                                 playlist.songs.push( model.id );
                                                    playlist.save( function( err, rs ){

                                                    });
                                        }); //End Update Songs
                                    }
                                }
                            });
                        } );

                    });

                });//MkFile
                
//                client.mkdir( "ALICEBOX" , function( dirErr, dirStat ) {
//                    if( dirErr ) { console.log(dirErr); } 
//                });//MakeDir
                
            });
          
        });//END Authenticate
        
        res.json("");
    },
    /**
     * UPLOAD SONG TO DROPBOX 
     * ( the song file format should be mp3, wav, m4a )
     */
    upload_files: function (req,res)
    {
        // Server-side applications use both the API key and secret.
        var client = new Dropbox.Client({
            key: sails.config.AliceBox.DROPBOX_KEY ,
            secret: sails.config.AliceBox.DROPBOX_SECRET ,
            token: req.session.user.dropBoxToken ,
            uid: req.session.user.dropBoxUserId
        });

        //var server = new Dropbox.AuthDriver.NodeServer(8191);
        var server = sails.config.AliceBox.DROPBOX_AUTH_DRIVER ;
        
        client.authDriver( server );
        client.authenticate( false ,function(error, clientA) {
            if (error) {
             sails.log("=====>DROPBOX AUTHENTICATE ERROR");
             sails.log(error);
            }

            //sails.log("===============");
            //sails.log( clientA );

            id3js({ file: req.files.file.path , type: id3js.OPEN_LOCAL }, function(err, tags) {
                if(err){ 
                    sails.log("=====> TAGS ERROR :");
                    sails.log( err );
                }
                // tags now contains your ID3 tags
                //sails.log( "====> FILE TAGS:" );
                //sails.log( tags );
                fs.readFile( req.files.file.path , function read( err, data ){
                    if( err )console.log( err );

                    //Write fiel
                    client.writeFile( req.files.file.name , data , function(error, stat) {

                        if(error) console.log(error);

                        //console.log(stat);

                        client.makeUrl( req.files.file.name , { downloadHack : true, longUrl : true }, function( err, url ){
                            if(err) console.log(err);
                            sails.log( "====> FILE URL:" );
                            sails.log( url );
                            
                            //SAVE SONG INFO TO DATABASE
                            Song.create( { userId : req.session.user.id , name : req.files.file.name , size : req.files.file.size , title: tags.title , album : tags.album  , artist : tags.artist , year : tags.year ,fileType : req.files.file.type , url : url.url }, function( err , model ){
                                if( err ){ 
                                    sails.log( "ERROR:" + err );
                                    sails.log( err ) 
                                };
                                sails.log( "---> CREATE SONG SUCCESS" + model );
                            });
                        } );

                    });

                });//MkFile
                
//                client.mkdir( "ALICEBOX" , function( dirErr, dirStat ) {
//                    if( dirErr ) { console.log(dirErr); } 
//                });//MakeDir
                
            });
          
        });//END Authenticate
        
//        res.view({ layout: "login_layout"});
        res.redirect('/upload');
    }
};
