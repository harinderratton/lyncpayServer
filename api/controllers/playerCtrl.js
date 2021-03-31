'use strict';

var mongoose = require('mongoose'),
//fcm
FCM = require('fcm-node'),

serverKey = 'AAAAZp5VeyQ:APA91bH51G2KdemsEY4HLLHRVKTLcWbb2XLqW5mTsxqVZQsMB80N896a7baXDkfR8PmHScvTjFaZZE-1pBAGXYx_OeBbkT2JpfL_nO-oZlMwh-_I-ryYULj-JSiI8EWGZJRddhEP1qND',
arraySort = require('array-sort'),
fcm = new FCM(serverKey),
//fcm
errors = ['',null,undefined,'null','undefined',0],
Calendar = mongoose.model('Calendar'),
SavedCard = mongoose.model('SavedCard'),
User = mongoose.model('User'),
LocationAlert = mongoose.model('LocationAlert'),
chat = mongoose.model('chat'),
Match = mongoose.model('Match'),
captainPayments = mongoose.model('captainPayments'),
Joinmatch = mongoose.model('Joinmatch'),
Followers = mongoose.model('Followers'),
paymentToOwner = mongoose.model('paymentToOwner'),
Confirmation = mongoose.model('Confirmation'),
vote = mongoose.model('votes'), 
team = mongoose.model('team'),
teamInvitation = mongoose.model('teamInvitation'),
customerId = mongoose.model('customerId'),
Notifications = mongoose.model('Notifications'),
RequestField = mongoose.model('RequestField'),
MatchResults = mongoose.model('MatchResults'),
AdminDeposits = mongoose.model('AdminDeposits'),
requestFieldPayments = mongoose.model('requestFieldPayments'),
bookingPayment = mongoose.model('bookingPayment'),
Otp =  mongoose.model('Otp'),
Addfav =  mongoose.model('Addfav'),
Player =  mongoose.model('Player'),
path = require('path'),
Property = mongoose.model('Property'),
NodeGeocoder = require('node-geocoder'),
fs = require('fs');
var sg = require('sendgrid')('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');
//----hashing password
var passwordHash = require('password-hash');
//----
var otpGenerator = require('otp-generator');
var multer  = require('multer');
var stripe = require('stripe')('sk_test_oDnJiczBF5W5NtF4gphJ2YPT00A5wasqym');


var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/p_pics/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

//multer for property
var uploadTeamPic = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/team/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

const cron = require("node-cron");

//chron player location

//   cron.schedule("* * * * *", function() {
 
// var d = new Date(); 
// var date = d.getDate();
// var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
// var year = d.getFullYear();
//  if(date<10){
//    date= '0'+date;
//  }
//  if(month<10){
//    month= '0'+month;
//  }
//  var hours= d.getHours();
//  var mins =  d.getMinutes();
//  var stime= hours+':'+mins;
// var dateStr = year + "-" + month + "-" + date;
              
//             Match.find({date:dateStr,status:1, stime:{$gt:String(stime)}, is_near:0}, function(err, match) { 
          
//             if(match.length!=0){

//               for(let key of match){
//                Joinmatch.findOne({match_id:key._id},function(err, joinExists){
//                   if(joinExists!=null){

//                     var players= joinExists.player_id

//                     if(players.length!=0){
//                        for(let key1 of players){


//                             Property.findOne({owner_id:key.owner_id},function(err, propertyRes){
               

//                Player.findOne({_id:key1,cords: {
//                                          $near: {
//                                            $minDistance: 0,
//                                            $maxDistance:5*1.609*1000,
//                                            $geometry: {
//                                              type: "Point",
//                                              coordinates: [Number(propertyRes.lng), Number(propertyRes.lat)]
//                                            }
//                                         }
//                                       }
//                                     },function(err, playerExists){

//                                       if(playerExists!=null){

//                                         User.findOne({_id:key.owner_id},function(err, ownerDetails){

//                                                       if(ownerDetails!=null){
//                                                           fcmToOwner(playerExists.fname+' is less than 5 miles away from property', ownerDetails.uid)

//                                                         }
                                    
//                                                     })

//                                                  }
                    
//                                               });

//                                             });
   
//                              }

//                     }
//                   }


//                });


//                Match.update({_id: key._id} , {$set: {is_near:1}}, {new:  true}, function(){


//                });


//               }          

//             }



//             })


//   });


  cron.schedule("* * * * *", function () {
   
    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    if (date < 10) {
        date = '0' + date;
    }
    if (month < 10) {
        month = '0' + month;
    }

    var hours = d.getHours();
    var mins = d.getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }

    var stime = hours + ':' + mins;
    var dateStr = year + "-" + month + "-" + date;

    Match.find({isCancelled:2, date: dateStr,status:1, stime: {$gt:String(stime)}}, function(err, match) { 
    
        if (match.length != 0) {

            for (let key of match) {

                var current_time = hours * 60 + mins;

                var match_hour = key.stime.slice(0, 2);

                var match_min = key.stime.slice(-2);

                var match_time = Number(match_hour) * 60 + Number(match_min)

                var diff = match_time - current_time;
        

                if (diff <= 60) {

                  Joinmatch.findOne({match_id: key._id}, function(err, joinedIds){

                    if(joinedIds!=null){

                      if(joinedIds.player_id.length!=0){
                      
                        for(let key1 of joinedIds.player_id){
  
                            LocationAlert.findOne({matchId: key._id, playerId: key1}, function(err, locationIdRes){
  
                            if(locationIdRes==null){
                             
                              Property.findOne({owner_id: key.owner_id},function(err, propertyRes){
                               
                                Player.findOne({_id:key1, cords: {
                                                          $near: {
                                                            $minDistance: 0,
                                                            $maxDistance:5*1.609*1000,
                                                            $geometry: {
                                                              type: "Point",
                                                              coordinates: [Number(propertyRes.lng), Number(propertyRes.lat)]
                                                            }
                                                         }
                                                       }
                               },function(err, playerExists){
                 
                                                       if(playerExists!=null){
                                                        console.log('6666')
                 
                                                         User.findOne({_id: key.owner_id},function(err, ownerDetails){
                                                          console.log('yes reaching')
                                                                       if(ownerDetails!=null){
                                                                           fcmToOwner(playerExists.fname+' is less than 5 miles away from property', ownerDetails.uid)
                 
                                                                         }
                                                     
                                                                    })
  
                                          var newLocationAlert = new LocationAlert({
                                            matchId: key._id,
                                            playerId: key1
                                          })
  
                                          newLocationAlert.save(function(err, response){
  
                                          })
  
  
  
                 
                                           }
                                     
                                      });
                 
                                });
                                }
  
                            })
  
                           }
   
                       }

                    }
                   
                  })
                }
             }

         }

    })


});



exports.location_update = function(req, res) {

var data = {};

if(errors.indexOf(req.body.lat)==-1){

              data['cords']= {
              type: "Point",
              coordinates: [req.body.lng, req.body.lat],
              }

  }

          Player.update({_id:  req.body._id},{$set: data},{new:true},function(err, result){
                          
                    if(result!=null){
                        res.send({
                            msg: 'updated',
                            status: 1,
                            data: result
                        });            
                    }else{
                          res.send({
                            msg: 'error',
                            status: 0,
                            data: null
                        });

                    } 

              }); 
    

}


exports.p_signup = function(req, res) {
 
      const data= {
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.pnumber,
      gender: req.body.gender,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      dob: req.body.dob,
      position:req.body.position,
      address:req.body.address,
      status:5,
      state: req.body.state,
      country: req.body.country,
      cords: {
        type: "Point",
        coordinates: [76.7794, 30.7333],
        }


    }

     if(errors.indexOf(req.body.uid)==-1){

              Player.update({uid:req.body.uid},{$set:{uid:0}},{new:true},function(){   }); 
              data['uid']= req.body.uid
            }
            
  //check email availability
    Player.findOne({email: req.body.email}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 0,
          data: null
    });
      }else{
        savenewuser();
      }
     
    });    

      function savenewuser(){
        var new_user = new Player(data);
              new_user.save(function(err, user) {
                console.log(err);
              if (user == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              }else{
                sendEmail(user); 
              }
              });
            }

            function sendEmail(user){
              var handlebars = require('handlebars');
              var fs = require('fs');
                var readHTMLFile = function(path, callback) {
                  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                      if (err) {
                          throw err;
                          callback(err);
                      }
                      else {
                          callback(null, html);
                      }
                  });
              };
            var nodemailer = require('nodemailer');
            var smtpTransport = require('nodemailer-smtp-transport');
          
            var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
              user: 'team.centercircle@gmail.com',
              pass: 'pro@cc.com'
            }
            }));
          
            readHTMLFile(__dirname + '/../templates/confirm-email.html', function(err, html) {
              var template = handlebars.compile(html);
              var replacements = {
                "OTP": 'http://centercircleapp.com:3002/confirmPlayerEmail/'+user._id,
                "USER": user.fname,
                "IMAGES_URL": 'http://centercircleapp.com:3002/server/data/logo.png'
              };
              var htmlToSend = template(replacements);
              var mailOptions = {
                from: 'Center Circle <centercircleteam@gmail.com>',
                  to: req.body.email,
                  subject: 'Email Account Confirmation',
                  html : htmlToSend
               };
               transporter.sendMail(mailOptions, function (error, response) {
                  if (error) {
                    console.log('email eror', error)
                    res.send({
                      msg: 'Internal Server Error, Try again',
                      status: 2,
                      data: null
                      });
                  }else{
                    res.send({
                      msg: 'Your account has been registered',
                      status: 1
                      });

                  }
              });
          });
          

            }

};


exports.confirmPlayerEmail= function(req, res){
  console.log(req.params._id);
          Player.update({_id:req.params._id},{$set:{status:1}},{new:true},function(err, user){
       
          if(user!=null){
            
            res.sendFile(path.join(__dirname, '../templates') + '/confirmed.html', 'utf8'); 
          }


          });


          }


//user login

exports.p_login = (req, res)=> { 


    Player.findOne({email: req.body.email}, function(err, user) {
      if(user==null){
          res.send({
          msg: 'Account does not exist for this email',
          status: 2,
          data: null
    });
      }else{
      if(passwordHash.verify(req.body.password,user.password)){   
        
        if(user.status==2){
          res.send({
             msg: 'You account is deactivated',
             status: 3,
             data: null
          });
          } 
        else if(user.status==5){
          res.send({
              msg: 'Your email verification is pending',
              status: 3,
              data: null
          });

          }
        else if(user.status==1){
          if(errors.indexOf(req.body.uid)==-1){
              
            Player.update({uid:String(req.body.uid)},{$set:{uid:0}}, {multi:true},function(err, empty_all){
                console.log(empty_all); 
                 console.log(err);       

              Player.update({_id:user._id},{$set:{uid:req.body.uid}},{new:true},function(err, settled){
               console.log(settled); 
               console.log(err); 

              }); 

             }); 
           }
               
            res.send({
               msg: 'You are logged in',
               status: 1,
               data: user
            });


        }

     

      }else{
         res.send({
                msg: 'Wrong credentials provided',
                status: 0,
                data: null
             });
      }

      }
     
    });     

};

exports.p_updateinfo = function(req, res) { 

      Player.findOne({email: req.params.email,_id: { $not: req.params._id}}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 0,
          data: null
    });
      }else{
        savenewuser();
      }
     
    });    

    
   function savenewuser(){
             var upload = multer({ storage: storage }).single('file');
  upload(req,res,function(err){

        var querydata = {
              fname: req.body.fname,
              lname: req.body.lname,
              gender: req.body.gender,
              phone: req.body.phone,
              email: req.body.email,
              state: req.body.state,
              city: req.body.city,
              country: req.body.country,
              zip: req.body.zip,
              address: req.body.address,
              weight: req.body.weight,
              height: req.body.height,
              position: req.body.position,
              dob: req.body.dob,

          }

          if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }

          if(errors.indexOf(req.body.lat)==-1){
              querydata['cords']= {
              type: "Point",
              coordinates: [req.body.lng,req.body.lat],
            }
            }
      
            Player.update({_id: req.body._id},{$set:querydata},{new:true}, function(err, user) {
         if(user==null){
            res.send({
            msg: 'Internal Server Error, Try again',
            status: 0}); 
         }else{

         Player.findOne({_id:req.body._id}, function(err, user) {           

              if(user==null){
              res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
              });
              }else{             
              res.send({
            msg: 'Data has been updated',
            status: 1,
            data:user

            }); 
          
             }

        });

          
              }   
              });
                                   
  });



   }



  }



    exports.p_updatepassword =function(req, res){


        Player.findOne({_id:req.body._id}, function(err, user) {
                      
           if(user==null){
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          }else{             
            
          if(passwordHash.verify(req.body.opassword,user.password)){
                 
           chnagepass();

      }else{
         res.send({
                msg: 'Old password is wrong',
                status: 2,
                data: null
             });
      }



                }

      });


      
      function chnagepass(){  Player.update({_id: req.body._id},{$set:{'password':passwordHash.generate(req.body.npassword)}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Password has been reset',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })}

  }

      exports.p_addfav =function(req, res){

       
        Addfav.findOne({player_id:req.body._id,match_id:req.body.match_id}, function(err, user) {
                      
           if(user==null){
             var data= {player_id:req.body._id,match_id:req.body.match_id,status:1}
              var newAddfav = new Addfav(data);
              newAddfav.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Added to favourite',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })
          }else{             
            
    Addfav.update({player_id:req.body._id,match_id:req.body.match_id},{$set:{'status':req.body.status}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{
                  res.send({
                  msg: 'Updated',
                  status: 1,
                  data:user      
                  });        
                 }   
               })

             }
          });
         }

  exports.p_getfav = (req, res)=>{
                 
             Addfav.find({player_id:req.body._id,status:1}, function(err, match) {           
            
              if(match.length==0){
              res.send({
              msg: 'Internal Server Error, Try again',  
              status: 0,
              data: null
              });
              }else{

                  var favlist=[];
                  var cont=0;
      for(let key of match){

            Match.findOne({_id:key.match_id,status:1}, function(err, matchlist){
                 
              if(matchlist!=null){

          Joinmatch.findOne({match_id:key.match_id}, function(err, result) {
          

                if(result!=null)  matchlist['players']= result.player_id.length
                 else  matchlist['players']= 0;
                  favlist.push(matchlist);
                  cont++;
                 
                    if(match.length==cont){

                 res.send({
              msg: 'fav list',  
              status: 1,
              data:favlist
              }); 
                  }               
                  });

              }else{
                      cont++;


              }       
              
            });         

            }                 
          
             }

        });            

}


exports.p_srchfav = function(req, res){

                      Addfav.find({player_id:req.body._id,status:1}, function(err, match) {          
          
              if(match.length==0){
                  res.send({
                  msg: 'no matches',  
                  status: 0,
                  data: null
                  });
              }else{

                  var ids=[];
                  var cont=0;
      for(let key of match){ 
               ids.push(key.match_id);      
          
                cont++;
                    if(match.length==cont){


                        Match.find({ 
                  "name": {'$regex' : req.body.keyword, '$options' : 'i'},
                     "_id": {"$in": ids},
                     status:1

                        }, function(err, matchlist){

                     if(matchlist.length==0){
                      res.send({
                      msg: 'no result found',  
                      status: 0,
                      data: null
                      });
                      }else{   
                          var i =0;
                          var newarray=[];
                      for(let findmatch of matchlist){
                 

                      Joinmatch.findOne({match_id:findmatch._id}, function(err, result) { 
                      if(result!=null) findmatch['players']= result.player_id.length;
                      else   findmatch['players']= 0;
                      newarray.push(findmatch);
                      i++;
                      if(i==matchlist.length){
                    
                      res.send({
                      msg: 'myupcoming messages',
                      status: 1,
                      data:newarray
                      }); 

                      }                
                      });
                     



                      }          
                    //   res.send({
                    // msg: 'match list',
                    // status: 1,
                    // data:matchlist

                    // }); 
                  
                     }
         
                     });
            }  
          

          

            }                
          
             }

        }); ///
            

}


exports.p_matchdetails = async function(req, res){  
               var is_calendar = await Calendar.findOne({player_id: req.body._id, match_id: req.body.match_id})  

              var results = await MatchResults.findOne({match_id:req.body.match_id});

                            
               Match.findOne({_id:req.body.match_id,status:1}, function(err, match) { 

               var joinedWithTeam =  (match.team1_team_id == req.body.team_id || match.team2_team_id == req.body.team_id) ? 1 : 0                      
               
                if(match==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',  
                    status: 0,
                    data: null
                    });
                }else{

            
           
                var present_time = new Date();
                var presentTime =  present_time.getTime()


                console.log('presentTime', presentTime)

                var date = match.date
                var start_time = match.stime+ ':00';
                var start_time_value = new Date(date+' '+start_time);
                start_time_value.setDate(start_time_value.getDate() - 1);
                var one_day_before = start_time_value.getTime();

               var join_enabled =  presentTime  >=  one_day_before ? 1 : 0
               console.log('one_day_before', one_day_before)
                User.findOne({_id:match.owner_id}, function(err, owner)   { 

                Property.findOne({owner_id:match.owner_id},function(err, location){

                        res.send({
                        msg: 'match list',
                        status: 1,
                        match:match,
                        owner:owner,
                        location:location,
                        results:results,
                        join_enabled: join_enabled,
                        is_calendar: is_calendar!=null ? 1 :0,
                        joinedWithTeam: joinedWithTeam
                         });

                 });                              

                 

                 });    
            
               }

          }); 

     }



exports.Joinmatch = async function(req, res){

        var joined = await  Match.findOne({_id:req.body.match_id});

       var total = await Joinmatch.findOne({match_id: req.body.match_id})

       var date =  new Date();
       var currentTime =  date.getTime();

       var matchDate = new Date(joined.date+' '+joined.stime );

       var matchTime  = matchDate.getTime();

       if(currentTime <  matchTime){
        var total_number = 0;
        if(total!=null){
           total_number = joined.players - total.player_id.length
        }
  
         if(total_number >= 0 || req.body.status==0){
 
        var d = new Date(); 

        var hours = d.getHours();
        var mins  =  d.getMinutes();

        var match_details= await Match.findOne({_id:req.body.match_id});
        var current_time= hours*60+mins;

        var match_hour= match_details.stime.slice(0,2);

        var match_min= match_details.stime.slice(-2);

        var match_time= Number(match_hour)*60+Number(match_min)

        var diff= match_time-current_time;
 ////
 
  
 var date = d.getDate();
 var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
 var year = d.getFullYear();
 if (date < 10) {
   date = '0' + date;
 }
 if (month < 10) {
   month = '0' + month;
 }
 
 var dateStr = year + "-" + month + "-" + date;
  
         Joinmatch.findOne({match_id:req.body.match_id}, function(err, match) {
                       
            if(match==null){
              var data= {
                   match_id:req.body.match_id ,
                   player_id: req.body._id,
                 }
 
               var Joinnewmatch = new Joinmatch(data);
               Joinnewmatch.save(function(err, user) {  
       
                if(user==null){
                   res.send({
                   msg: 'Internal Server Error, Try again',
                   status: 3}); 
                }else{
 
                 var setdata= {$push:{team3_player_ids:req.body._id}}
                 Match.update({_id:req.body.match_id},setdata, {new:true},function(err,matchDetails){})
 
                  var toId;
                  Match.findOne({_id:req.body.match_id},function(err,matchDetails){
 
                  if(matchDetails!=null){
 
                   var toId= matchDetails.owner_id;                    
                   var fromId= req.body._id;
                   var params= {match_id:String(req.body.match_id)}
                   add_notification(fromId,toId,2,params);
 
                    User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                       if(errors.indexOf(owner_uid.uid)==-1){
 
                             fcmToOwner('A new player has joined your match', owner_uid.uid)
 
                       }
              
 
 
                    });
 
 
                  }

                  });
             
 
                  res.send({
                   msg: 'joined',
                   status: 1,
                   data:user,
                   time: calcRemainingTodayMatchTime(joined.matchDate, joined.start_day)
       
                   }); 
 
                     }   
                           })
           }else{   
             
               if(req.body.status==1){
                 var setdata1 = {$push:{team3_player_ids:req.body._id}}
                 var setdata= {$push:{player_id:req.body._id}}
                  setquery();
                  var  notification_message = {
                                         title: 'Match joined', 
                                         body: 'A player has joined your match',
                                          sound:'sound.mp3',
                                     }
     
               }else if(req.body.status==0){
              
                  var setdata= {$pull:{player_id:req.body._id}}

                  if(req.body.joinedTeamId==1){

                    var setdata1 = {$pull:{team1_player_ids: req.body._id}}
                  

                  }
                  if(req.body.joinedTeamId==2){
                    var setdata1 = {$pull:{team2_player_ids:req.body._id}}

                  }
                  if(req.body.joinedTeamId==3){
                    var setdata1 = {$pull:{team3_player_ids:req.body._id}}
                  }

                  
                  setquery();
                          var  notification_message= {
                                         title: 'Match left', 
                                         body: 'A player has left your match',
                                          sound:'sound.mp3',
                                     }

                                        
                                     Match.findOne({_id:req.body.match_id},function(err,matchDetails){

                                            if(matchDetails!=null){
                                            var toId= matchDetails.owner_id;                    
                                            var fromId= req.body._id;
                                            var params= {match_id:String(req.body.match_id)}
                                            add_notification(fromId,toId, 5, params);
                                            }
                                      
                                      });
               }
     
            function setquery(){
 
                  Match.update({_id:req.body.match_id},setdata1, {new:true},function(err,matchDetails){})
                  Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {
     
                 
     
     
                    console.log(user);
           
                    if(user==null){
                       res.send({
                       msg: 'Internal Server Error, Try again',
                       status: 3}); 
                    }else{
     
                            var toId;
                      Match.findOne({_id:req.body.match_id},function(err,matchDetails){
     
                      if(matchDetails!=null){
                          var type;
                    if(req.body.status==0){
                       
     
                                   
                    }else if(req.body.status==1){
                       type=2;                 
     
                    }
                        
 
 
                      }
     
                                  //fcm 
                        User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                           if(errors.indexOf(owner_uid.uid)==-1){
     
                          fcmToOwner(notification_message.body, owner_uid.uid)
                               }
                             });
                      //fcm

                      
     
     
                    });



                    if(diff <= 30 && dateStr == joined.date){
                      deduct_50_Percent();
                    }
                         
                       res.send({
                       msg: 'Match joined successfully',
                       status: 1,
                       data:user,
                       matchLeft: (diff<=120 && req.body.status==0) ? 1 : 0,
                       time: calcRemainingTodayMatchTime(joined.matchDate, joined.start_day),
                       isTransaction: (diff <= 30 && dateStr == joined.date) ? true: false
                       
                           });    
     
     
                         }   
                               })
             }
 
                 }
 
       });
 
 
 
          
         }else{
 
             res.send({
                 msg: 'No more seats available',
             status: 11}); 
 
         }
 


       }else{

        res.send({
          msg: 'Match has been already started',
        status: 12}); 
       }


       function deduct_50_Percent(){
        SavedCard.findOne({userID: req.body._id, matchId: String(req.body.match_id)}, function(err, cardDetails){
    
          if(cardDetails!=null){
    
              User.findOne({_id: match_details.owner_id}, function(err, userStrieId){
    
                  if(userStrieId!=null){
                      if(errors.indexOf(userStrieId.stripe_id) == -1){
               
                     if(errors.indexOf(cardDetails.customerId)==-1){
                         var adminMoney =  (90/100) * Number(cardDetails.amount/2)
                         var userMoney =  Number(cardDetails.amount/2)
                         stripe.charges.create(
                             {
                                 'currency' :'USD',
                                 'amount' : adminMoney*100,
                                 'description' : 'Match commison to admin',
                                 'customer' : cardDetails.customerId,
                                 
                             },
                             function(err, charge) {  
               
                                 if(errors.indexOf(charge)==-1){
               
                                     stripe.charges.create(
                                         {
                                             "amount" : userMoney*100,
                                             "currency" : 'USD',
                                             "description" : "Trip amount to user",
                                             "source" : charge.source.id,
                                             "customer" : charge.source.customer,
                                             "application_fee" : 0,
                                             transfer_data: {
                                             destination: userStrieId.stripe_id,
                                             },
                                             'capture' :  true
                                         },
                                         function(err, charge) {
                     
                                           if(errors.indexOf(charge)==-1){
                                            
                                          add_notification(req.body._id, match_details.owner_id, 7, {amount: adminMoney, match_id: String(req.body.match_id)});
               
                                           var AdminDepositData = {
                                             match_id: String(req.body.match_id),
                                             amount: adminMoney,
                                             player_id: req.body._id
                                            
                                           }
    
                                           var newAdminDeposit = new AdminDeposits(AdminDepositData);
                                              newAdminDeposit.save(function (err, paymentOutput) {
                                                console.log(paymentOutput);
                                             
                                           });
                                                
                                      var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                                      var type = 1;
                                      var data = {
                                                  payId: OTP,
                                                  transaction_id: charge.id,
                                                  owner_id: match_details.owner_id,
                                                  player_id: req.body._id,
                                                  amount: adminMoney,
                                                  type: 1,
                                                  matchId: String(req.body.match_id)
                                              }
                                          var newpayment = new paymentToOwner(data);
          
                                          newpayment.save(function (err, paymentOutput) {
                                            
                                              
                                          });
                           
                                          var data = {
                                              payId: OTP,
                                              transaction_id: charge.id,
                                              owner_id: match_details.owner_id,
                                              match_id:String(req.body.match_id),
                                              player_id: req.body._id,
                                              amount: userMoney,
                                          }
          
                                          var newpayment= new bookingPayment(data);
               
                                              newpayment.save();                                                      
                     
    
                                              console.log("Payment successfull");
                                            }else{
                                             console.log("Error while paying to owner.");
                                        
                                           }
                                         }
                                       );
                         
                                 }else{
                                     console.log("Error while paying to owner.");
                                 }
                               }
                           );
               
                     }else{
                       console.log("Error while paying to owner.");
                     }
               
    
                      }
                      else{
                         console.log("Owner has not connected with stripe.");
                
                      }
               
                   }else{
                     console.log("Owner's account is unreachable.");
                   }
    
    
                });
                                                       
    
        
        
              }else{
       
              }
    
      });
       }
    

  }




  exports.checkAvailability = async function(req, res){

    var myIdAsArray = [req.body._id];

    var isAlreadyJoined = await Joinmatch.findOne({match_id: req.body.match_id, player_id: {$in: myIdAsArray}});

    if(isAlreadyJoined==null){


      var joined = await  Match.findOne({_id:req.body.match_id});

      var total = await Joinmatch.findOne({match_id: req.body.match_id})
   
      var date =  new Date();
      var currentTime =  date.getTime();
   
      var matchDate = new Date(joined.date+' '+joined.stime );
   
      var matchTime  = matchDate.getTime();
   
      if(currentTime <  matchTime){
       var total_number = 0;
       if(total!=null){
          total_number = joined.players - total.player_id.length
       }
   
        if(total_number >= 0 || req.body.status==0){
   
             res.send({
             status: 1}); 
          
         
        }else{
   
            res.send({
                msg: 'No more seats available',
            status: 0}); 
   
        }
   
   
   
      }else{
   
       res.send({
         msg: 'Match has been already started',
       status: 2}); 
      }



    }else{
      res.send({
        msg: 'You have already joined the match',
      status: 2}); 
    }

}

exports.checkIfAlreadyJoined = async function(req, res){

  var joined = await  Match.findOne({_id: req.body.match_id});
  if(joined.team1_team_id == req.body.team_id || joined.team2_team_id == req.body.team_id){

    console.log('You have already joined the match');
    res.send({
      msg: 'You have already joined the match',
      status: 0
     }); 
 
  }else{
    console.log('You can join the match');
    res.send({
      msg: 'You can join the match',
      status: 1
     }); 
  }

}


  exports.JoinWithTeam = async function(req, res){

      var joined = await  Match.findOne({_id: req.body.match_id});  

      var teamAllDetails = await team.findOne({_id: req.body.team_id});
      var allIds = [req.body._id];
      var i = 0;

      if(teamAllDetails.players.length==0){
       
        tryJoin()

      }else{
      
        for(let singleId of teamAllDetails.players){
         
            if(allIds.length < req.body.totalPlayers){

              if(allIds.indexOf(singleId)==-1){
                allIds.push(singleId)
              }
            
            }

          i++;

          if(i==teamAllDetails.players.length){

            tryJoin()


          }
  
        }

      
      }


      async function tryJoin(){
      var joined = await  Match.findOne({_id: req.body.match_id});    

      var date =  new Date();
      var currentTime =  date.getTime();

      var matchDate = new Date(joined.date+' '+joined.stime );

      var matchTime  = matchDate.getTime();

      if(currentTime <  matchTime){
         
      // if((joined.team1_player_ids.length==0 || joined.team2_player_ids.length==0) && joined.team3_player_ids.length==0 ){

        if(joined.team1_player_ids.length==0 || joined.team2_player_ids.length==0){
        var setters = {};

        if(joined.team1_player_ids.length==0){
        setters['team1_player_ids'] = allIds;
        setters['team1_team_id'] = req.body.team_id;
        setters['isCaptain1'] =  req.body._id,
        setters['team_1_type'] = '1';
        }
        else{
        setters['team2_player_ids'] = allIds;
        setters['team2_team_id'] = req.body.team_id;
        setters['isCaptain2'] =  req.body._id;
        setters['team_2_type'] = '1';
        }
  
  
        if(joined.team1_player_ids.length==0){
        setters['team1'] = req.body.team_name;
        setters['name'] =  req.body.team_name+' VS '+ joined.team2
        setters['isCaptain1'] =  req.body._id;
        setters['team_1_type'] = '1';
        }
        else{
        setters['team2'] = req.body.team_name;
        setters['name'] =  joined.team1+' VS '+ req.body.team_name
        setters['isCaptain2'] =  req.body._id;
        setters['team_2_type'] = '1';
        }
      
  
     Match.update({_id: req.body.match_id},{$set: setters}, {new:true},function(err, matchOutput){
  
       ///////
           var ids = allIds;
          
           var players_list = [];
  
             Joinmatch.findOne({match_id: req.body.match_id}, function(err, joinExists) {                      
             if(joinExists==null){
               var data= {
                    match_id:req.body.match_id ,
                    player_id: ids
                  }
  
                var Joinnewmatch = new Joinmatch(data);
                Joinnewmatch.save(function(err, user) { 
                             res.send({
                                      msg: 'Joined',
                                      status: 1,
                                      time: calcRemainingTodayMatchTime(joined.date, joined.start_day)  
                                    }); 
                                 sendFcmNoti(); 
                                               }) 
              }else{
                 var i = 0 ;
                 for(let key of ids){
                  
                    Joinmatch.update({match_id: req.body.match_id}, {$set: {match_id: req.body.match_id}, $push:{player_id: key} } , {new: true},function(err, user) { 
                      i++;
  
                      if(i==ids.length){
                                  sendFcmNoti();         
                                 res.send({
                                      msg: 'Joined',
                                      status: 1,
                                      time: calcRemainingTodayMatchTime(joined.date, joined.start_day)    
                                    }); 
  
                                      
  
                         } 
                       })
                     }
  
  
  
              }
  
            });
  
  
                   });
  
  
        }else{
          res.send({
                  msg: 'No team joining available, Pls join individually',
                  status: 11
            }); 
          }
  
  
  
          function sendFcmNoti(){
  
               User.findOne({_id : joined.owner_id},function(err, owner_uid){
                        if(errors.indexOf(owner_uid.uid)==-1){   
                                fcmToOwner('A Team joined your match', owner_uid.uid)
                            } 
                          });
                       }

      }else{
        res.send({
          msg: 'Match has been already started',
        status: 12});
      }



      }
    
 
  }




  exports.checkAvailabilityForTeam = async function(req, res){
    var teamAllDetails = await team.findOne({_id: req.body.team_id});

    var allIds = [req.body._id];
    var i = 0;
    if(teamAllDetails.players.length==0){
     
      tryJoin()

    }else{
    
      for(let singleId of teamAllDetails.players){
       
          if(allIds.length < req.body.totalPlayers){

            if(allIds.indexOf(singleId)==-1){
              allIds.push(singleId)
            }
          
          }

        i++;

        if(i==teamAllDetails.players.length){

          tryJoin()


        }

      }
    }



    async function tryJoin(){
    var joined = await  Match.findOne({_id:req.body.match_id});    

    var date =  new Date();
    var currentTime =  date.getTime();

    var matchDate = new Date(joined.date+' '+joined.stime );

    var matchTime  = matchDate.getTime();

    if(currentTime <  matchTime){
       
    if((joined.team1_player_ids.length==0 || joined.team2_player_ids.length==0) && joined.team3_player_ids.length==0 ){
       
        res.send({
            status: 1
      });
      
             
      }else{
        res.send({
                msg: 'No team joining available, Pls join individually',
                status: 11
           }); 
        }


    }else{
      res.send({
        msg: 'Match has been already started',
      status: 12
     });
    }

    }
  
}


    exports.LeaveMatchWithTeam = async function(req, res){

    var joined = await  Match.findOne({_id: req.body.match_id});

    var d = new Date(); 

    var hours = d.getHours();
    var mins  =  d.getMinutes();

    var match_details= await Match.findOne({_id:req.body.match_id});
    var current_time= hours*60+mins;

    var match_hour= match_details.stime.slice(0,2);

    var match_min= match_details.stime.slice(-2);

    var match_time= Number(match_hour)*60+Number(match_min)

    var diff= match_time-current_time;

    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    if (date < 10) {
    date = '0' + date;
    }
    if (month < 10) {
    month = '0' + month;
    }

    var dateStr = year + "-" + month + "-" + date;

 
      var all_ids = req.body.team_id == joined.team1_team_id ? joined.team1_player_ids : joined.team2_player_ids

      var ids = all_ids;
         var i = 0 ;
         for(let key of ids){
 
                 var setdata = {$pull:{player_id: key}}
                  Joinmatch.update({match_id: req.body.match_id}, setdata, function(err, user) { 
                    i++;

                    if(i==ids.length){

                            
                   User.findOne({_id : joined.owner_id},function(err, owner_uid){
                      if(errors.indexOf(owner_uid.uid)==-1){         
                            fcmToOwner('A new Team has left your match', owner_uid.uid)
                          } 
                        });


            /////
                     Followers.findOne({owner_id: joined.owner_id}, function(err, followersInfo){
                      if(followersInfo!=null){
                        
                        for(let followerId of followersInfo.player_id){
                         Player.findOne({_id: followerId}, function(err, followerPlayerId){
                           if(followerPlayerId!=null){
                             var to=  followerPlayerId.uid;
                             var title= 'Spots are vacant for match'+ joined.name;
                             var body = 'Spots are vacant for match'+ joined.name;
                             sendpush(to, title, body, 1)

                           }
                           })
                        }
                      }
                    })

               //////

                  

                      var setters = {};

                      if(req.body.team_id == joined.team1_team_id ){
                      setters['team1_player_ids'] = [];
                      setters['team1_team_id'] = '';
                      setters['isCaptain1'] = '0';
                      setters['team_1_type'] = '0';


                      }
                      else{
                      setters['team2_player_ids'] = [];
                      setters['team2_team_id'] ='';
                      setters['isCaptain2'] = '0';
                      setters['team_2_type'] = '0';
                      }


                      if(req.body.team_id == joined.team1_team_id){
                      setters['team1'] = 'team 1';
                      setters['name'] =  'Team 1'+' VS '+ joined.team2
                      setters['isCaptain1'] = '0';
                      setters['team_1_type'] = '0';
                      }
                      else{
                      setters['team2'] = 'team 2';
                      setters['name'] =  joined.team1+' VS '+ 'Team 2'
                      setters['isCaptain2'] = '0';
                      setters['team_2_type'] = '0';
                      }


                      var toId = joined.owner_id;  

                      var fromId = req.body.team_id;

                      var params = { match_id: String(req.body.match_id), team_id: req.body.team_id }

                      add_notification(fromId,toId, 55, params);

                      Match.update({_id: req.body.match_id},{$set: setters}, {new:true},function(err, matchOutput){


                        if(diff <= 30 && dateStr==joined.date){
                          deduct_50_Percent();
                        }
                   
                           res.send({
                                    msg: 'left',
                                    status: 1,
                                    isTransaction: (diff <= 30 && dateStr == joined.date) ? true: false
                              }); 

                      });

                   
                       } 
                     })
                   }


                   function deduct_50_Percent(){
                    SavedCard.findOne({userID: req.body._id, matchId: String(req.body.match_id)}, function(err, cardDetails){

                      if(cardDetails!=null){
           
                          User.findOne({_id: match_details.owner_id}, function(err, userStrieId){

                              if(userStrieId!=null){
                                  if(errors.indexOf(userStrieId.stripe_id) == -1){
                           
                                 if(errors.indexOf(cardDetails.customerId)==-1){
                                     var adminMoney =  (90/100) * Number(cardDetails.amount/2)
                                     var userMoney =  Number(cardDetails.amount/2)
                                     stripe.charges.create(
                                         {
                                             'currency' :'USD',
                                             'amount' : adminMoney*100,
                                             'description' : 'Match commison to admin',
                                             'customer' : cardDetails.customerId,
                                             
                                         },
                                         function(err, charge) {  
                           
                                             if(errors.indexOf(charge)==-1){
                           
                                                 stripe.charges.create(
                                                     {
                                                         "amount" : userMoney*100,
                                                         "currency" : 'USD',
                                                         "description" : "Trip amount to user",
                                                         "source" : charge.source.id,
                                                         "customer" : charge.source.customer,
                                                         "application_fee" : 0,
                                                         transfer_data: {
                                                         destination: userStrieId.stripe_id,
                                                         },
                                                         'capture' :  true
                                                     },
                                                     function(err, charge) {
                                 
                                                       if(errors.indexOf(charge)==-1){
                                                        
                                                      add_notification(req.body._id, joined.owner_id, 7, {amount: adminMoney, match_id: String(joined._id)});
                           
                                                       var AdminDepositData = {
                                                         match_id: String(joined._id),
                                                         amount: adminMoney,
                                                         player_id: req.body._id
                                                        
                                                       }

                                                       var newAdminDeposit = new AdminDeposits(AdminDepositData);
                                                          newAdminDeposit.save(function (err, paymentOutput) {
                                                            console.log(paymentOutput);
                                                         
                                                       });
                                                            
                                                  var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                                                  var type = 1;
                                                  var data = {
                                                              payId: OTP,
                                                              transaction_id: charge.id,
                                                              owner_id: joined.owner_id,
                                                              player_id: req.body._id,
                                                              amount: adminMoney,
                                                              type: 1,
                                                              matchId: joined._id
                                                          }
                                                      var newpayment = new paymentToOwner(data);
                      
                                                      newpayment.save(function (err, paymentOutput) {
                                                        
                                                          
                                                      });
                                       
                                                      var data = {
                                                          payId: OTP,
                                                          transaction_id: charge.id,
                                                          owner_id: joined.owner_id,
                                                          match_id: String(joined._id),
                                                          player_id: req.body._id,
                                                          amount: userMoney,
                                                      }
                      
                                                      var newpayment= new bookingPayment(data);
                           
                                                          newpayment.save();                                                      
                                 
 
                                                          console.log("Payment successfull");
                                                        }else{
                                                         console.log("Error while paying to owner.");
                                                    
                                                       }
                                                     }
                                                   );
                                     
                                             }else{
                                                 console.log("Error while paying to owner.");
                                             }
                                           }
                                       );
                           
                                 }else{
                                   console.log("Error while paying to owner.");
                                 }
                           
              
                                  }
                                  else{
                                     console.log("Owner has not connected with stripe.");
                            
                                  }
                           
                               }else{
                                 console.log("Owner's account is unreachable.");
                               }


                            });
                                                                   
 
                    
                    
                          }else{
                   
                          }

                  });
                   }


}




exports.getJoinmatch =function(req, res){
  var ids=[req.body._id];
  Joinmatch.findOne({match_id:req.body.match_id}, function(err, match) {
            console.log(match);
                          
             if(match==null){
                    res.send({
                    msg: 'no data',
                    status: 2,
                    data:null
                    }); 

             }else{

              if(match.player_id.length==0){
                res.send({
                  msg: 'no data',
                  status: 2,
                  data:null
                  }); 

              }else{
                var players = [];
                var cont = 0;
           for(let key of match.player_id){     


              Player.findOne({_id:key}, function(err, player) {
              
                var dict = {
                  address: player.address,
                  points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
                  email: player.email,
                  fname: player.fname,
                  goals: player.goals,
                  lname: player.lname,
                  pic: player.pic,
                  position: player.position,
                  state: player.state,
                  status: player.status,
                  _id: player._id,

                }
            
               players.push(dict);
               cont++;                     
               console.log( match.player_id.length);

                  if(cont == match.player_id.length){
                
                     res.send({
                   msg: 'Updated',
                   status: 1,
                   playersList:players,
                   players: match.player_id              
                   }); 

              }
              });

          

           }


              }
               
 
                 


               
             }                

  });
}


exports.newGetJoinmatch =async function(req, res){
 
  Match.findOne({_id:req.body.match_id}, async function(err, match) {

   var team1Captain = await  Player.findOne({_id: match.isCaptain1 != '0' ? match.isCaptain1 : '5f97b232b0b5915f008364e5'});
   var team2Captain = await  Player.findOne({_id: match.isCaptain2 != '0' ? match.isCaptain2 : '5f97b232b0b5915f008364e5'});
                          
             if(match==null){
                    res.send({
                    msg: 'no data',
                    status: 2,
                    data:null
                    }); 

             }else{

              var team1_players = [];
              var team2_players = [];
              var team3_players = []
              var player_ids = [];

  if(match.team1_player_ids.length!=0 && errors.indexOf(match.team1_team_id)==-1){

    console.log('1111111111');

    if(match.team1_player_ids.length!=0){
      var cont = 0;
      for(let key of match.team1_player_ids){

        var friendID = key.slice(0, 7);
       if(friendID=='GUESTID'){

          var dict = {
            _id: 'GUESTID',
            player_ID: key.split('D')[1],
          }

          player_ids.push(key);
          team1_players.push(dict)

          cont++
          if(cont == match.team1_player_ids.length){
            query2()
  
          }
  
        }else if(friendID=='FRIENDS'){

          Player.findOne({_id: key.split('S')[1]}, function(err, player){
  
            var dict = {
              _id: 'FRIENDS',
              player_ID: key.split('S')[1],
              FRIEND_id: key,
              fname: player.fname,
              lname: player.lname,
            }
  
 

            player_ids.push(key);
            team1_players.push(dict)
  
            cont++
            if(cont == match.team1_player_ids.length){
              query2()
    
            }
  
          })
  
        }else{

          Player.findOne({_id: key}, function(err, player){
 
            var dict = {
              address: player.address,
              points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
              email: player.email,
              fname: player.fname,
              goals: player.goals,
              lname: player.lname,
              pic: player.pic,
              position: player.position,
              state: player.state,
              status: player.status,
              _id: player._id,
            }
            player_ids.push(key);
            team1_players.push(dict)
            cont++
            if(cont == match.team1_player_ids.length){
 
              query2()
            }
 
          })
 
         }
      } 

    }else{

      query2()
    }

   }else{

    query2()

   }


function query2(){
  
  if(match.team2_player_ids.length!=0 && errors.indexOf(match.team2_team_id)==-1){

    if(match.team2_player_ids.length!=0){
      var cont = 0;
      for(let key of match.team2_player_ids){


        var friendID = key.slice(0, 7);
    if(friendID=='GUESTID'){

          var dict = {
            _id: 'GUESTID',
            player_ID: key.split('D')[1],
          }

          player_ids.push(key);
          team2_players.push(dict)

          cont++
          if(cont == match.team2_player_ids.length){
            query3()
  
          }
  
        }else if(friendID=='FRIENDS'){

          Player.findOne({_id: key.split('S')[1]}, function(err, player){
  
            var dict = {
              _id: 'FRIENDS',
              player_ID: key.split('S')[1],
              FRIEND_id: key,
              fname: player.fname,
              lname: player.lname,
            }
  
            
            player_ids.push(key);
            team2_players.push(dict)
  
            cont++
            if(cont == match.team2_player_ids.length){
              query3()
    
            }
  
          })
  
        } else{

          Player.findOne({_id: key}, function(err, player){
 
            var dict = {
              address: player.address,
              points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
              email: player.email,
              fname: player.fname,
              goals: player.goals,
              lname: player.lname,
              pic: player.pic,
              position: player.position,
              state: player.state,
              status: player.status,
              _id: player._id,
            }
 
            if(player_ids.indexOf(key)==-1){
             player_ids.push(key);
             team2_players.push(dict)
            }
          
            cont++
            if(cont == match.team2_player_ids.length){
              query3()
            }
 
          })
 
         }
      }

     }else{
      query3()

     }

 
   }else{
    query3()


   }

}

 

function query3(){
  console.log('33333333');
  if(match.team1_player_ids.length!=0 && errors.indexOf(match.team1_team_id)>=0){
    var cont = 0;
    for(let key of match.team1_player_ids){

      var friendID = key.slice(0, 7);
     if(friendID=='GUESTID'){

      var dict = {
        _id: 'GUESTID',
        player_ID: key.split('D')[1],
      }

      player_ids.push(key);
      team1_players.push(dict)


      cont++
      if(cont == match.team1_player_ids.length){
        query4()

      }

    }else if(friendID=='FRIENDS'){

        Player.findOne({_id: key.split('S')[1]}, function(err, player){

          var dict = {
            _id: 'FRIENDS',
            player_ID: key.split('S')[1],
            FRIEND_id: key,
            fname: player.fname,
            lname: player.lname,
          }

         

          player_ids.push(key);
          team1_players.push(dict)


          cont++
          if(cont == match.team1_player_ids.length){
            query4()
  
          }

        })

      } else{

        Player.findOne({_id: key}, function(err, player){
  
          var dict = {
            address: player.address,
            points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
            email: player.email,
            fname: player.fname,
            goals: player.goals,
            lname: player.lname,
            pic: player.pic,
            position: player.position,
            state: player.state,
            status: player.status,
            _id: player._id,
  
          }
  
            if(player_ids.indexOf(key)==-1){
                  player_ids.push(key);
                  team1_players.push(dict)
               }
  
          cont++
          if(cont == match.team1_player_ids.length){
            query4()
  
          }
  
  
        }) 
      
      }

    }  
  
}else{
  query4()
}

}


function  query4(){
  console.log('match.team3_player_ids.lengthmatch.team3_player_ids.length', match.team3_player_ids.length);
  if(match.team3_player_ids.length!=0){
    console.log('44444444');
     var cont = 0;
    for(let key of match.team3_player_ids){

      var friendID = key.slice(0, 7);
      if(friendID=='GUESTID'){

        var dict = {
          _id: 'GUESTID',
          player_ID: key.split('D')[1],
        }
        
        player_ids.push(key);
        team3_players.push(dict)
        cont++
        if(cont == match.team3_player_ids.length){
          query5()

        }

    }else if(friendID=='FRIENDS'){


        Player.findOne({_id: key.split('S')[1]}, function(err, player){

          var dict = {
            _id: 'FRIENDS',
            player_ID: key.split('S')[1],
            FRIEND_id: key,
            fname: player.fname,
            lname: player.lname,
          }

      
          player_ids.push(key);
          team3_players.push(dict)
          cont++
          if(cont == match.team3_player_ids.length){
            query5()
  
          }

        })

      } else{

        Player.findOne({_id: key}, function(err, player){

          var dict = {
            address: player.address,
            points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
            email: player.email,
            fname: player.fname,
            goals: player.goals,
            lname: player.lname,
            pic: player.pic,
            position: player.position,
            state: player.state,
            status: player.status,
            _id: player._id,
  
          }
  
            if(player_ids.indexOf(key)==-1){
                 player_ids.push(key);
                 team3_players.push(dict)
               }
  
          cont++
          if(cont == match.team3_player_ids.length){
            query5()
  
          }
          
        })
 
      }

    }  
  
}else{
  query5() 


}

}

      function  query5(){
        console.log('555555555');
        if(match.team2_player_ids.length!=0 && errors.indexOf(match.team2_team_id)>=0){
           var cont = 0;
          for(let key of match.team2_player_ids){

            var friendID = key.slice(0, 7);
           if(friendID=='GUESTID'){


            var dict = {
              _id: 'GUESTID',
              player_ID: key.split('D')[1],
            }
  
          

            player_ids.push(key);
            team2_players.push(dict)
  
            cont++
            if(cont == match.team2_player_ids.length){
              res.send({
                msg: 'Updated',
                status: 1,
                players:player_ids,
                players1: team1_players,  
                players2: team2_players,
                players3: team3_players,
                limit:  match.players,  
                team1Captain: team1Captain,
                team2Captain: team2Captain        
                }); 
    
            }
    
          }else if(friendID=='FRIENDS'){


            Player.findOne({_id: key.split('S')[1]}, function(err, player){
    
              var dict = {
                _id: 'FRIENDS',
                player_ID: key.split('S')[1],
                FRIEND_id: key,
                fname: player.fname,
                lname: player.lname,
              }
    
            

              player_ids.push(key);
              team2_players.push(dict)
    
              cont++
              if(cont == match.team2_player_ids.length){
                res.send({
                  msg: 'Updated',
                  status: 1,
                  players:player_ids,
                  players1: team1_players,  
                  players2: team2_players,
                  players3: team3_players,
                  limit:  match.players,  
                  team1Captain: team1Captain,
                  team2Captain: team2Captain        
                  }); 
      
              }
    
            })
    
          }else{

            Player.findOne({_id: key}, function(err, player){

              var dict = {
                address: player.address,
                points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
                email: player.email,
                fname: player.fname,
                goals: player.goals,
                lname: player.lname,
                pic: player.pic,
                position: player.position,
                state: player.state,
                status: player.status,
                _id: player._id,

              }

                 if(player_ids.indexOf(key)==-1){
                  player_ids.push(key);
                  team2_players.push(dict)
             }

          
              cont++
              if(cont == match.team2_player_ids.length){
                res.send({
                  msg: 'Updated',
                  status: 1,
                  players:player_ids,
                  players1: team1_players,  
                  players2: team2_players,
                  players3: team3_players,
                  limit:  match.players,  
                  team1Captain: team1Captain,
                  team2Captain: team2Captain        
                  }); 
      
              }
              
            })

          }

          }  
        
      }else{
        res.send({
          msg: 'Updated',
          status: 1,
          players:player_ids,
          players1: team1_players,  
          players2: team2_players,
          players3: team3_players,
          limit:  match.players,
          team1Captain: team1Captain,
          team2Captain: team2Captain              
          }); 


      }

      }
  
             }                

  });
}



exports.ownerdetail = async function(req, res){  
  
             
 
               User.findOne({_id:req.body.owner_id}, function(err, match) {                        
               
                if(match==null){
                    res.send({
                    msg: 'no data',  
                    status: 0,
                    data: []
                    });
                }else{
                   
                    res.send({
                    msg: 'owner',  
                    status: 1,
                    data: match
                    });            
               }
          }); 

}




exports.followOwnerw =function(req, res){

       
        Followers.findOne({player_id:req.body._id, owner_id:req.body.owner_id,status:1}, function(err, user) {
                      
           if(user==null){
             var data= {player_id:req.body._id, owner_id:req.body.owner_id,status:1}
              var newAddfollower = new Followers(data);
              newAddfollower.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{


                  res.send({
                  msg: 'followed',
                  status: 1,
                  data:user      
                  });

                  fcm();

   
  
       
                    }   
                          })
          }else{             
            
    Followers.update({player_id:req.body._id, owner_id:req.body.owner_id},{$set:{'status':req.body.status}},{new:true}, function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3}); 
               }else{

                 if(req.body.status==1){
                  fcm();

                 }
                  res.send({
                  msg: 'Updated',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })

                }

      });



  }

     exports.followOwner =function(req, res){
       
        Followers.findOne({ owner_id:req.body.owner_id}, function(err, match) {
                      
           if(match==null){
             var data= {player_id:req.body._id, owner_id:req.body.owner_id,status:1}

              var newAddfollower = new Followers(data);
              newAddfollower.save(function(err, user) {
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0}); 
               }else{

                 
             User.findOne({_id:req.body.owner_id},function(err,admin_details){
              if(errors.indexOf(admin_details.uid)==-1){
                 fcmToOwner('A player has started following you', admin_details.uid)
              }
               
 
                });

                  res.send({
                  msg: 'follwed',
                  status: 1,
                  data:user
      
                  }); 
       
                    }   
                          })
          }else{             
            
          if(req.body.status==1){

            
            var setdata= {$push:{player_id:req.body._id}}

             setquery();

          }else if(req.body.status==0){
            console.log('pulling');

           var setdata= {$pull:{player_id:req.body._id}}

             setquery();
          }

       function setquery(){
             Followers.update({owner_id : req.body.owner_id},setdata,{new:true}, function(err, user) {
               console.log(user);
      
               if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0}); 
               }else{

                    if(req.body.status==1){
                     
             User.findOne({_id:req.body.owner_id},function(err,admin_details){

               if(errors.indexOf(admin_details.uid)==-1){
             
                 fcmToOwner('A player has started following you', admin_details.uid)

               }
               
               
 
                });
                      }

                  res.send({
                  msg: 'Updated  ',
                  status: 1  ,
                  data:user
      
                  }); 
       
                    }   
                          })
                        }

                }

      });    


  }

  exports.getfollowOwner = function(req, res){  
    var ids=[req.body._id]  
   Followers.find({player_id: { $in: ids}}, function(err, match) {  
                 
     
      if(match.length==0){
          res.send({
          msg: 'no data',  
          status: 0,
          data: []
          });
      }else{
              var owners=[];
              var cont= 0;
              for(let key of match)  {

                Property.findOne({owner_id: key.owner_id}, function(err, propertyOutput){

                   var dist ={
                     name: propertyOutput!=null? propertyOutput.name: 'Facility',
                     cover:  propertyOutput!=null? propertyOutput.cover: null, 
                     _id:  key.owner_id,
                     city:  propertyOutput!=null? propertyOutput.city: null, 
                   }

                 owners.push(dist)
                 cont++; 
                if(cont==match.length){
                        res.send({
                        msg: 'owner',  
                        status: owners.length!=0 ? 1 : 0,
                        data: owners
                        }); 
                        
                      }}) }             
            }
         }); 
  }


  exports.noOfFollowers = function(req, res){  
    var ids=[req.body._id]

    Followers.findOne({owner_id: req.body.owner_id}, function(err, match) { 

      if(match!=null){

        res.send({         
          status: 1,
          noOfPlayers: match.player_id.length,
          doIFollow: match.player_id.indexOf(req.body._id) >= 0 ? 1 : 0
          });
 

      }else{
        res.send({         
          status: 0      
          });

      }

     })
  }

  exports.getFollowingList = async function(req, res){ 

    var ids = [req.body._id]  
    Followers.find({player_id: { $in: ids}}, function(err, match) {
      if(match.length!=0){
        var ownerIds=[];
        var cont = 0;            
        for(let key of match)  {
          ownerIds.push(key.owner_id);
          cont++;
       if(cont==match.length){             
        res.send({         
          status: 1,
          data: ownerIds       
          });
       }            
         }

      }else{
        res.send({         
          status: 1,
          data: []        
          });

      }
              

  })

  }

  exports.getAllOwners = async function(req, res){ 

    var ids = [req.body._id]  
    Followers.find({player_id: { $in: ids}}, function(err, match) {
              
      if(match.length==0){
        User.find({state: req.body.state}, function(err, filtered){
          if(filtered.length!=0){
            var ownerIds1=[];
            var cont1 = 0;
          
            for(let key1 of filtered)  {

              ownerIds1.push(key1._id);
              cont1++;
           if(cont1==filtered.length){
            
            getowners(ownerIds1);
           }           
          
          }

          }else{
            res.send({
              msg: 'no owners',  
              status: 0,                 
              });

          }
            
            })
      }else{
              var ownerIds=[];
              var cont = 0;
            
              for(let key of match)  {

             ownerIds.push(key.owner_id);
             cont++;
             if(cont==match.length){

             User.find({_id: {$nin: ownerIds}, state: req.body.state}, function(err, filtered){
              if(filtered.length!=0){
                var ownerIds1=[];
                var cont1 = 0;
              
                for(let key1 of filtered)  {
  
                  ownerIds1.push(key1._id);
                  cont1++;
               if(cont1==filtered.length){
                
                getowners(ownerIds1);
               }           
              
              }

              }else{
                res.send({
                  msg: 'no owners',  
                  status: 0,                 
                  });

              }
                            
              })  
             
              
             }

    
            
               }             
            }

         }); 

 function getowners(ownerIds1){
   Property.find({owner_id: { $in: ownerIds1}}, function(err, p_output){

     if(p_output.length!=0){
       var valid_ids =[]
       var counting = 0;

       for(let key of p_output){
         valid_ids.push(
                     {
                     name: key.name,
                     cover:  key.cover,
                     _id:  key.owner_id,
                     city:  key.city,
                   })
         counting++;

         if(counting==p_output.length){
        res.send({         
         status: 1,
         data: valid_ids        
         });

  
         }

       

       }


     }else{

   res.send({
         msg: 'no owners',  
         status: 0,
        
         });

     }




   } )
 
 
 
 } 

  }

    exports.searchfollowOwner = function(req, res){      
              
    var ids = [req.body._id]  
    Followers.find({player_id: { $in: ids}}, function(err, match) {
    console.log(match);                     
     
      if(match.length==0){
          res.send({
          msg: 'no data',  
          status: 0,
          data: []
          });
      }else{
              var ownerIds=[];
              var cont = 0;
            
              for(let key of match)  {

           ownerIds.push(key.owner_id);
             cont++;
             if(cont==match.length){
             
               getowners(ownerIds);
             }

    
            
               }             
            }

         }); 




 function getowners(ownerIds){

   console.log('ownerIds', ownerIds)

   Property.find({owner_id: { $in: ownerIds}, name : { '$regex': req.body.keyword, $options: 'i' }}, function(err, p_output){

     if(p_output.length!=0){
       var valid_ids =[]
       var counting = 0;

       for(let key of p_output){
            

                   
         valid_ids.push(
                     {
                     name: key.name,
                     cover:  key.cover,
                     _id:  key.owner_id,
                     city:  key.city,
                   })
         counting++;

         if(counting==p_output.length){
        res.send({
         
         status: 1,
         data: valid_ids
        
         });

  
         }

       

       }


     }else{

   res.send({
         msg: 'no owners',  
         status: 0,
        
         });

     }




   } )
 
 
 
 } 
  }


    exports.searchPlayers = function(req, res){      
              
      Player.find({$or: [ {"fname" : { '$regex': req.body.keyword, $options: 'i' }}, { "lname": { '$regex': req.body.keyword, $options: 'i' } } ] }, function(err, owner)   {    
  
            if(owner.length!=null){
            
             
                  res.send({
                    msg: 'owner',  
                    status: 1,
                    data: owner
                    }); 
                
            }else{
                  res.send({
                    status: 0,
                    data: []
                    }); 

            }
       });       
  }

  exports.searchPlayers1 = function(req, res){      
              
    Player.find({_id: {$nin: JSON.parse(req.body.ids)}, $or: [ {"fname" : { '$regex': req.body.keyword, $options: 'i' }}, { "lname": { '$regex': req.body.keyword, $options: 'i' } } ] }, function(err, owner)   {    

          if(owner.length!=null){         
           
                res.send({
                  msg: 'owner',  
                  status: 1,
                  data: owner
                  }); 
              
          }else{
                res.send({
                  status: 0,
                  data: []
                  }); 

          }
     });       
}


  //join with friends function

  exports.JoinWithFriends = async function(req, res){
  
    var allIDS  = JSON.parse(req.body.allFriends);
    var joined = await  Match.findOne({_id:req.body.match_id});
    var JoinMatchCount = await Joinmatch.findOne({match_id: req.body.match_id});
    var total = JoinMatchCount != null ? JoinMatchCount.player_id.length : 0 ;
    var date =  new Date();
    var currentTime =  date.getTime();
    var matchDate = new Date(joined.date+' '+joined.stime );
    var matchTime  = matchDate.getTime();

    if(currentTime <  matchTime){

    var total_number = 0;

    total_number = joined.players - total

    console.log(total_number, allIDS.length);

    if(total_number >= allIDS.length){

    var d = new Date(); 

    var hours = d.getHours();
    var mins  =  d.getMinutes();

    var match_details= await Match.findOne({_id:req.body.match_id});
    var current_time= hours*60+mins;

    var match_hour= match_details.stime.slice(0,2);

    var match_min= match_details.stime.slice(-2);

    var match_time = Number(match_hour)*60+Number(match_min)

    var diff= match_time-current_time;

    var date = d.getDate();
    var month = d.getMonth() + 1;  
    var year = d.getFullYear();

    if (date < 10) {
    date = '0' + date;
    }

    if (month < 10) {
    month = '0' + month;
    }

        var dateStr = year + "-" + month + "-" + date;

        var match = await Joinmatch.findOne({match_id:req.body.match_id});
                   
        if(match == null){

            //this code will run when join doesn't exist in table.

            // for(let key of allIDS){


            var data = {
              match_id: req.body.match_id ,
              player_id: allIDS,
            }

            var Joinnewmatch = new Joinmatch(data);

            Joinnewmatch.save(function(err, user) {  
    
                          if(user == null) res.send({  msg: 'Internal Server Error, Try again', status: 3});  
                        
                          else{
              
                            var setdata = {team3_player_ids: allIDS}
                            Match.update({_id:req.body.match_id},setdata, {new:true},function(err,matchDetails){})
              
                            var toId;
                            Match.findOne({_id:req.body.match_id},function(err,matchDetails){
              
                            if( matchDetails!=null){
              
                              var toId = matchDetails.owner_id;                    
                              var fromId = matchDetails.owner_id;
                              var params = { match_id:String(req.body.match_id) }

                              add_notification(fromId, toId, 212 ,params);
              
                              User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                                  if(errors.indexOf(owner_uid.uid)==-1){
              
                                    fcmToOwner('A new player has joined your match with his friend(s)', owner_uid.uid);
              
                                  }
                      
                              });
                            }
              
                            });
              
                            res.send({
                              msg: 'joined',
                              status: 1,
                              data:user
                              });
                      
              
                                }   
                        }) 
                      //  }

 

          }else{  
         
            //this code will run when join is already exist in table.

            var count = 0;

            for(let key of allIDS){

              var setdata1 = {$push:{team3_player_ids:key}}
              var setdata= {$push:{player_id: key}}
              
               var  notification_message = { 
                                            title: 'Match joined', 
                                            body: 'A new player has joined your match with his friend(s)',
                                            sound:'sound.mp3',
                                           }


                Match.update({_id:req.body.match_id},setdata1, {new:true},function(err,matchDetails){})
                Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {
    
                  if(user==null){
                      res.send({
                      msg: 'Internal Server Error, Try again',
                      status: 3}); 
                  }
                  else{

                    Match.findOne({_id:req.body.match_id},function(err,matchDetails){
              
                      if(matchDetails!=null && key.slice(0, 7) !='FRIENDS'){
        
                        var toId = matchDetails.owner_id;                    
                        var fromId = key;
                        var params = { match_id:String(req.body.match_id) }
                        add_notification(fromId, toId, 212 ,params);
        
                        User.findOne({_id:matchDetails.owner_id},function(err, owner_uid){
                            if(errors.indexOf(owner_uid.uid)==-1){
        
                                  fcmToOwner('A new player has joined your match with his friend(s)', owner_uid.uid);
        
                                }
                              });
                              
                            }

                          });

                        } 

                      })

                              count++;
                              if(count == allIDS.length){
          
                                  res.send({
                                    msg: 'joined',
                                    status: 1
                                    });

                              }

            }


 
          
 

             }

   



      
     }else{

         res.send({
             msg: 'No more seats available',
         status: 11}); 

     }



   }else{

    res.send({
      msg: 'Match has been already started',
    status: 12}); 
   }

}


  //join with friends function

  exports.joinGuest = async function(req, res){

    var allIDS  = JSON.parse(req.body.allGuests);
    var joined = await  Match.findOne({_id:req.body.match_id});

    var removedIDS = [];
    for(let key of joined.team3_player_ids){
      var friendID = key.slice(0, 7);
      if(friendID == 'GUESTID'){
        if(allIDS.indexOf(key) == -1) removedIDS.push(key);
      }
    }


    var JoinMatchCount = await Joinmatch.findOne({match_id: req.body.match_id});
    var total = JoinMatchCount != null ? JoinMatchCount.player_id.length : 0 ;
    var date =  new Date();
    var currentTime =  date.getTime();
    var matchDate = new Date(joined.date+' '+joined.stime );
    var matchTime  = matchDate.getTime();

    if(currentTime <  matchTime){

    var total_number = 0;

    total_number = joined.players - total

    console.log(total_number, allIDS.length);

    if(total_number >= allIDS.length){

    var d = new Date(); 

    var hours = d.getHours();
    var mins  =  d.getMinutes();

    var match_details = await Match.findOne({_id:req.body.match_id});
    var current_time = hours*60+mins;

    var match_hour= match_details.stime.slice(0,2);

    var match_min= match_details.stime.slice(-2);

    var match_time = Number(match_hour)*60+Number(match_min)

    var diff= match_time-current_time;

    var date = d.getDate();
    var month = d.getMonth() + 1;  
    var year = d.getFullYear();

    if (date < 10) {
    date = '0' + date;
    }

    if (month < 10) {
    month = '0' + month;
    }

        var dateStr = year + "-" + month + "-" + date;

        var match = await Joinmatch.findOne({match_id:req.body.match_id});
        
        var newIDS = [];
       

        for(let key of allIDS){
         if( match_details.team3_player_ids.indexOf(key) == -1) newIDS.push(key);
      
        }

      
        if(match == null){

            var data = {
              match_id: req.body.match_id ,
              player_id: newIDS,
            }

            var Joinnewmatch = new Joinmatch(data);

            Joinnewmatch.save(function(err, user) {  
    
                          if(user == null) res.send({  msg: 'Internal Server Error, Try again', status: 3});  
                        
                          else{
              
                            var setdata = {team3_player_ids: newIDS}
                            Match.update({_id:req.body.match_id},setdata, {new:true},function(err,matchDetails){})
              
                            res.send({
                              msg: 'joined',
                              status: 1,
                              data:user
                              });
                      
              
                            }   
                        }) 
                      //  }

 

          }else{  
         
          
            if(newIDS.length!=0){
             firstFor();
             console.log('11111');
            }else{
              secondFor();
              console.log('2222');
            }
         

           function firstFor(){
            var count = 0;
        
            for(let key of newIDS){

                var setdata1 = {$push:{team3_player_ids:key}}
                var setdata= {$push:{player_id: key}}
              
                Match.update({_id:req.body.match_id},setdata1, {new:true},function(err,matchDetails){})
                Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {
    
                  if(user==null){
                      res.send({
                      msg: 'Internal Server Error, Try again',
                      status: 3}); 
                  }
  

                      })

                count++;
                if(count == newIDS.length){

                  secondFor()
                  console.log('3333331113333');
                }

            }
           }



            function secondFor(){
              if(removedIDS.length!=0){
                console.log('44411444');
                //////////////
                var count = 0;

                for(let key of removedIDS){

                 
    
                  var setdata1 = {$pull:{team3_player_ids:key}}
                  var setdata= {$pull:{player_id: key}}
                
                    Match.update({_id:req.body.match_id},setdata1, {new:true},function(err,matchDetails){})
                    Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {
        
                      if(user==null){
                          res.send({
                          msg: 'Internal Server Error, Try again',
                          status: 3}); 
                      }
                      else{
    
                        Match.findOne({_id:req.body.match_id},function(err,matchDetails){
                  
     
    
                              });
    
                            } 
    
                          })
    
                                  count++;
                                  if(count == removedIDS.length){
              
                                      res.send({
                                        msg: 'joined',
                                        status: 1
                                        });
    
                                  }
    
                } 




                //////////////

            }else{
              console.log('yes its coming 11');
              res.send({
                msg: 'joined',
                status: 1
                });

            }
            }


             }

   



      
     }else{

         res.send({
             msg: 'No more seats available',
         status: 11}); 

     }



   }else{

    res.send({
      msg: 'Match has been already started',
    status: 12}); 
   }

}



  //Leave with friends function

  exports.LeaveWithFriends = async function(req, res){
    
    var joined = await  Match.findOne({_id:req.body.match_id});
    var JoinMatchCount = await Joinmatch.findOne({match_id: req.body.match_id});
    var total = JoinMatchCount != null ? JoinMatchCount.player_id.length : 0 ;
    var date =  new Date();
    var currentTime =  date.getTime();
    var matchDate = new Date(joined.date+' '+joined.stime );
    var matchTime  = matchDate.getTime();
    

    //let's see the diffrence

    var d = new Date(); 
    var hours = d.getHours();
    var mins  =  d.getMinutes();
    var current_time= hours*60+mins;

    var match_hour= joined.stime.slice(0,2);

    var match_min= joined.stime.slice(-2);

    var match_time= Number(match_hour)*60+Number(match_min)

    var diff = match_time-current_time;


 
    var month = d.getMonth() + 1;  
    var year = d.getFullYear();

    if (date < 10) {
    date = '0' + date;
    }

    if (month < 10) {
    month = '0' + month;
    }

    var dateStr = year + "-" + month + "-" + date;

    if(currentTime <  matchTime){
      var notiType;

      if(req.body.status == 1){

        var setdata= {$pull:{player_id: req.body._id}}
        var setdata1= {$pull:{team3_player_ids: req.body._id}}
        notiType = 213;
        
      }else{

        var setdata= {$pull:{player_id:  { "$in": ['FRIENDS'+req.body._id, req.body._id] } }}
        var setdata1= {$pull:{team3_player_ids: { "$in": ['FRIENDS'+req.body._id, req.body._id] }}}
        notiType = 214;

      }

      Match.update({_id:req.body.match_id}, setdata1,function(err,matchDetails){});

      Joinmatch.update({match_id:req.body.match_id}, setdata, {"multi": true}, function(err, user) {

      })

      var toId = joined.owner_id;    

      var fromId = req.body._id;

      var params = { match_id: String(req.body.match_id) }

      add_notification(fromId, toId, notiType , params);

      var msg;
      if ( diff <= 120 && dateStr == joined.date) msg = 'If your slot has not been filled your credit card will be charged for the cost of the game.'
      else  msg = 'Match left, your card will not be charged.'


      if(diff <= 30 && dateStr==joined.date){
        deduct_50_Percent();
      }
     
      res.send({msg: 'Left', status: 1,  msg : msg,   isTransaction: (diff <= 30 && dateStr == joined.date) ? true: false});
   
   }else{

    res.send({
      msg: 'Match has been already started.',
    status: 12}); 
   }



   function deduct_50_Percent(){
    SavedCard.findOne({userID: req.body._id, matchId: String(req.body.match_id)}, function(err, cardDetails){

      if(cardDetails!=null){

          User.findOne({_id: joined.owner_id}, function(err, userStrieId){

              if(userStrieId!=null){
                  if(errors.indexOf(userStrieId.stripe_id) == -1){
           
                 if(errors.indexOf(cardDetails.customerId)==-1){
                     var adminMoney =  (90/100) * Number(cardDetails.amount/2)
                     var userMoney =  Number(cardDetails.amount/2)
                     stripe.charges.create(
                         {
                             'currency' :'USD',
                             'amount' : adminMoney*100,
                             'description' : 'Match commison to admin',
                             'customer' : cardDetails.customerId,
                             
                         },
                         function(err, charge) {  
           
                             if(errors.indexOf(charge)==-1){
           
                                 stripe.charges.create(
                                     {
                                         "amount" : userMoney*100,
                                         "currency" : 'USD',
                                         "description" : "Trip amount to user",
                                         "source" : charge.source.id,
                                         "customer" : charge.source.customer,
                                         "application_fee" : 0,
                                         transfer_data: {
                                         destination: userStrieId.stripe_id,
                                         },
                                         'capture' :  true
                                     },
                                     function(err, charge) {
                 
                                       if(errors.indexOf(charge)==-1){
                                        
                                      add_notification(req.body._id, joined.owner_id, 7, {amount: adminMoney, match_id: String(req.body.match_id)});
           
                                       var AdminDepositData = {
                                         match_id: String(req.body.match_id),
                                         amount: adminMoney,
                                         player_id: req.body._id                                        
                                       }

                                       var newAdminDeposit = new AdminDeposits(AdminDepositData);
                                          newAdminDeposit.save(function (err, paymentOutput) {
                                            console.log(paymentOutput);
                                         
                                       });
                                            
                                  var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                                  var type = 1;
                                  var data = {
                                              payId: OTP,
                                              transaction_id: charge.id,
                                              owner_id: joined.owner_id,
                                              player_id: req.body._id,
                                              amount: adminMoney,
                                              type: 1,
                                              matchId: String(req.body.match_id)
                                          }
                                      var newpayment = new paymentToOwner(data);
      
                                      newpayment.save(function (err, paymentOutput) {
                                        
                                          
                                      });
                       
                                      var data = {
                                          payId: OTP,
                                          transaction_id: charge.id,
                                          owner_id: joined.owner_id,
                                          match_id:String(req.body.match_id),
                                          player_id: req.body._id,
                                          amount: userMoney,
                                      }
      
                                      var newpayment= new bookingPayment(data);
           
                                          newpayment.save();                                                      
                 

                                          console.log("Payment successfull");
                                        }else{
                                         console.log("Error while paying to owner.");
                                    
                                       }
                                     }
                                   );
                     
                             }else{
                                 console.log("Error while paying to owner.");
                             }
                           }
                       );
           
                 }else{
                   console.log("Error while paying to owner.");
                 }
           

                  }
                  else{
                     console.log("Owner has not connected with stripe.");
            
                  }
           
               }else{
                 console.log("Owner's account is unreachable.");
               }


            });
                                                   

    
    
          }else{
   
          }

  });
   }

}


  //Leave with friends function

  exports.unJoinGuest = async function(req, res){
    
    var joined = await  Match.findOne({_id:req.body.match_id});
    var JoinMatchCount = await Joinmatch.findOne({match_id: req.body.match_id});
    var total = JoinMatchCount != null ? JoinMatchCount.player_id.length : 0 ;
    var date =  new Date();
    var currentTime =  date.getTime();
    var matchDate = new Date(joined.date+' '+joined.stime );
    var matchTime  = matchDate.getTime();
    

    //let's see the diffrence

    var d = new Date(); 
    var hours = d.getHours();
    var mins  =  d.getMinutes();
    var current_time= hours*60+mins;

    var match_hour = joined.stime.slice(0,2);

    var match_min = joined.stime.slice(-2);

    var match_time = Number(match_hour)*60+Number(match_min)

    var diff = match_time-current_time;

    var month = d.getMonth() + 1;  
    var year = d.getFullYear();

    if (date < 10) {
    date = '0' + date;
    }

    if (month < 10) {
    month = '0' + month;
    }

    
    if(currentTime <  matchTime){
      
      var setdata= {$pull:{player_id:  { "$in": [JSON.parse(req.body.selected_player_ids)] } }}
      var setdata1= {$pull:{team3_player_ids: { "$in": [JSON.parse(req.body.selected_player_ids)] }}}

      Match.update({_id:req.body.match_id}, setdata1, {new:true}, {"multi": true},function(err,matchDetails){});

      Joinmatch.update({match_id:req.body.match_id}, setdata, {new:true},{"multi": true}, function(err, user) {

      })

      res.send({status: 1});

   }else{

    res.send({
      msg: 'Match has been already started.',
    status: 12}); 
   }

}


  exports.searchNonfollowOwner =async  function(req, res){   
    
    var ids = [req.body._id]  
    Followers.find({player_id: { $in: ids}}, function(err, match) {
              
      if(match.length==0){
        User.find({state: req.body.state}, function(err, filtered){
          if(filtered.length!=0){
            var ownerIds1=[];
            var cont1 = 0;
          
            for(let key1 of filtered)  {

              ownerIds1.push(key1._id);
              cont1++;
           if(cont1==filtered.length){
            
            getowners(ownerIds1);
           }           
          
          }

          }else{
            res.send({
              msg: 'no owners',  
              status: 0,                 
              });

          }
            
            })
      }else{
              var ownerIds=[];
              var cont = 0;
            
              for(let key of match)  {

             ownerIds.push(key.owner_id);
             cont++;
             if(cont==match.length){

             User.find({_id: {$nin: ownerIds}, state: req.body.state}, function(err, filtered){
              if(filtered.length!=0){
                var ownerIds1=[];
                var cont1 = 0;
              
                for(let key1 of filtered)  {
  
                  ownerIds1.push(key1._id);
                  cont1++;
               if(cont1==filtered.length){
                
                getowners(ownerIds1);
               }           
              
              }

              }else{
                res.send({
                  msg: 'no owners',  
                  status: 0,                 
                  });

              }
                            
              })  
             
              
             }

    
            
               }             
            }

         }); 

 function getowners(ownerIds1){
   Property.find({owner_id: { $in: ownerIds1}, name : { '$regex': req.body.keyword, $options: 'i' }}, function(err, p_output){

     if(p_output.length!=0){
       var valid_ids =[]
       var counting = 0;

       for(let key of p_output){
         valid_ids.push(
                     {
                     name: key.name,
                     cover:  key.cover,
                     _id:  key.owner_id,
                     city:  key.city,
                   })
         counting++;

         if(counting==p_output.length){
        res.send({         
         status: 1,
         data: valid_ids        
         });

  
         }

       

       }


     }else{

   res.send({
         msg: 'no owners',  
         status: 0,
        
         });

     }




   } )
 
 
 
 } 
              
//     var ids=[req.body._id]  
//     var owners  = await Followers.find({player_id: { $in: ids}}); 
 
//          if(owners.length!=0){
//            var ownerIds = [];
//            var cont = 0;
//            for(let key of owners){
 
//              ownerIds.push(key.owner_id);
//              cont++;
//              if(cont==owners.length){
             
//                getowners(ownerIds);
//              }
           
//            }
 
//          }else{
//            getowners([]);
 
//          }
 
//  function getowners(ownerIds){




//    Property.find({owner_id: { $nin: ownerIds}, name : { '$regex': req.body.keyword, $options: 'i' }}, function(err, p_output){

//      if(p_output.length!=0){
//        var valid_ids =[]
//        var counting = 0;

//        for(let key of p_output){
            

                   
//          valid_ids.push(
//                      {
//                      name: key.name,
//                      cover:  key.cover,
//                      _id:  key.owner_id,
//                      city:  key.city,
//                    })
//          counting++;

//          if(counting==p_output.length){
//         res.send({
         
//          status: 1,
//          data: valid_ids
        
//          });

  
//          }

       

//        }


//      }else{

//    res.send({
//          msg: 'no owners',  
//          status: 0,
        
//          });

//      }




//    } )
 
 
 
//  } 
  }

  exports.playerUpMatches = function(req, res){

                var d = new Date();
                var date = d.getDate();
                var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                var year = d.getFullYear();
                if(date<10){
                date= '0'+date;
                }
                if(month<10){
                month= '0'+month;
                }
                var dateStr = year + "-" + month + "-" + date;


            var ids=[req.body._id]
            Joinmatch.find( {"player_id": {"$in": ids}}, function(err, user) {
             
      
               if(user.length==0){
                  res.send({
                  msg: 'no data found',
                  status: 0}); 
               }else{
                    

                  var myupmatches=[];
                  var cont=0;
               for(let key of user){
                 
                Match.findOne({_id:key.match_id,date:{$gt:dateStr},status:1}, function(err, match) {           

                if(match!=null){
                     
                   Joinmatch.findOne({match_id:match._id}, function(err, result) { 
             


                  var dist = {

                        alert_sent: match.alert_sent,
                        createdAt: match.createdAt,
                        date: match.date,
                        duration: match.duration,
                        end_day: match.end_day,
                        etime: match.etime,
                        fullday: match.fullday,
                        gender: match.gender,
                        is_near: match.is_near,
                        joined: match.joined,
                        location: match.location,
                        name: match.name,
                        owner_id: match.owner_id,
                        paid: match.paid,
                        players: result.player_id.length,
                        request_match: match.request_match,
                        slotted: match.slotted,
                        start_day: match.start_day,
                        status: match.status,
                        stime: match.stime,
                        displayTime:  convert24to12(match.stime),
                        team1: match.team1,
                        team1_player_ids: match.team1_player_ids,
                        team1_team_id: match.team1_team_id,
                        team2: match.team2,
                        team2_player_ids: match.team2_player_ids,
                        team2_team_id: match.team2_team_id,
                        team3_player_ids: match.team3_player_ids,
                        team_1_type: match.team_1_type,
                        team_2_type: match.team_2_type,
                        updatedAt: match.updatedAt,
                        _id: match._id,
                  }

                myupmatches.push(dist);

                  cont++;
                  console.log(user.length);
                  console.log(cont);
                if(cont==user.length){
                
                  res.send({
                  msg: 'myupcoming messages',
                  status: 1,
                  data: myupmatches
                 }); 

                }                
                   });
               
                }else{
                    cont++;
                if(cont==user.length){
           
                res.send({
                msg: 'myupcoming messages',
                status: 1,
                data:myupmatches
                 }); 

                }


                }
           

                });  

               }       
                    }   
                  })                     

}



exports.fieldRequest = async function(req, res) {

    var matchExists = await Match.find(
                          {$and : [                              
                          {
                          date : req.body.date,
                          }
                          ,{
                    status:1
                          },
                          {
                            owner_id:req.body.owner_id
                          }
                          ]}
                              );

if(matchExists.length!=0){
  res.send({
    msg: 'match already exists',
    status: 2,
});



}else{
  const data= {
    player_id:req.body._id,
    owner_id:req.body.owner_id,
    date:req.body.date,
    time:req.body.time,
    comment:req.body.comment,
    stime:req.body.stime,
    etime:req.body.etime,
    players_ids: req.body.selected_player_id,
    team_id: req.body.team_id,
    duration : req.body.duration,
  }

var newRequest= new RequestField(data);

newRequest.save(function(err, user) {
if(user!=null){

   User.findOne({_id:req.body.owner_id},function(err, ownerUid){

        if(errors.indexOf(ownerUid.uid)==-1){
        console.log(ownerUid);

              fcmToOwner('You got a field request by a player', ownerUid.uid)
        }

   });

         



  res.send({
        msg: 'request sent',
        status: 1,
        data: user
    });
}else{
  res.send({
        msg: 'failed',
        status: 0,
        data: null
    });

}
 

}); 



}

     
}

exports.playerGetOtp = (req, res)=>{
      Player.findOne({email: req.body.email, status:1}, function(err, user) {
      if(user==null){
          res.send({
          msg: 'Account does not exist',
          status: 0,
          data: null
    });
      }else{
         generateOtp(req.body.email);        
      }
     
    });
  


        function generateOtp(email){
    var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
        var new_otp = new Otp({email:email, otp:OTP,type:2});
       new_otp.save(function(err, otp) {
              if (otp == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3,
                  data: null
                });
              }else{
                  sendotp(otp.otp);              
              }
              }); 
           }


           function sendotp(otp){
            var handlebars = require('handlebars');
            var fs = require('fs');
              var readHTMLFile = function(path, callback) {
                fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    else {
                        callback(null, html);
                    }
                });
            };
          var nodemailer = require('nodemailer');
          var smtpTransport = require('nodemailer-smtp-transport');

          var transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          auth: {
            user: 'team.centercircle@gmail.com',
            pass: 'pro@cc.com'
          }
          }));

          readHTMLFile(__dirname + '/../templates/forget.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
              "OTP": otp
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'Center Circle <centercircleteam@gmail.com>',
                to: req.body.email,
                subject: 'Email Account Confirmation',
                html : htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                  res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 2,
                    data: null
                    });
                }else{
                  res.send({
                    msg: 'An OTP is sent to your email, Please check your inbox',
                    status: 1,
                    data: otp
                    });

                }
            });
         });
     }

//       function sendotp(otp){

//           var readStream = fs.createReadStream(path.join(__dirname, '../templates') + '/forget.html', 'utf8');
//           let email_content = ''
//           readStream.on('data', function(chunk) {
//             email_content += chunk;
//           }).on('end', function() {
//             var helper = require('sendgrid').mail;
//             var fromEmail = new helper.Email('noreply@match.com');
//             var toEmail = new helper.Email(req.body.email);

//             var subject = 'Password Reset';
//             email_content = email_content.replace("#OTP#", otp.otp);
//             var content = new helper.Content('text/html', email_content);

//             var mail = new helper.Mail(fromEmail, subject, toEmail, content);
//             var request = sg.emptyRequest({
//               method: 'POST',
//               path: '/v3/mail/send',
//               body: mail.toJSON()
//             });

//             sg.API(request, function (error, response) {         
//                if(error==null){
                  
//                 res.send({
//                 msg: 'An OTP is sent to your email, Please check your inbox',
//                 status: 1,
//                 data: otp
//                 });

//                }else{
//                 res.send({
//                 msg: 'Internal Server Error, Try again',
//                 status: 2,
//                 data: null
//                 });
//                }
//                console.log(response);
//                  console.log(error);

//             });  
//         });   
// }

 

}

exports.playerResetPassword =function(req, res){
        console.log(req.body.npassword);
      Otp.findOne({email:req.body.email,type:2}, null, {sort:{'_id': -1}}, function(err, user) {
          console.log('otp'+user);
              
           if(user==null){
            res.send({
              msg: 'Internal Server Error, Try again',
              status: 0,
              data: null
            });
          }else{             
             confirmOtp(req.body.otp,user.otp);          }

      });

      function confirmOtp(frontOtp,backOtp){
        if(frontOtp==backOtp){
           changePassword();

        }else{
              res.send({
              msg: 'Provided OTP is wrong',
              status: 2,
              data: null
            });
        }

      }

      function changePassword(){
            
         Player.update({ email: req.body.email}, { $set: { password : passwordHash.generate(req.body.npassword) }}, {new: true}, function(err, user) {
             console.log('coming');
             console.log(user);
             if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3,
                  data: user
                  });
          
             }else{
              res.send({
              msg: 'password changed successfully',
              status: 1,
              data: user
              });
            }

         });
      }
}


exports.bookMatchPayment = (req, res)=>{

  (async () => {
    // Create a Customer:
    const customer = await stripe.customers.create({
      source: req.body.token,
      email: 'paying.user@example.com',
    });

    if(errors.indexOf(customer.id)==-1){

           customerId.update({player_id:req.body.player_id,
            match_id:req.body.match_id},{$set:{status:2}},{new:true},function(){
              
              var data= {
                id:customer.id,
                player_id:req.body.player_id,
                match_id:req.body.match_id
              }
              var newcustomerId= new customerId(data);
              newcustomerId.save(function(err, savedId){
                if(savedId!=null){
                 res.send({
                   msg: 'Payment successfull',
                   status: 1,
                 
               });
   
                }
            
   
   
              });


            });
         
        
    }else{
            res.send({
                  msg: 'Payment failed',
                  status: 0,
                    
              });

    }
    console.log(customer);
  
  
  })();

   }


   exports.transaction_details = async (req, res)=>{ 


    var paymentOutput = await bookingPayment.find({player_id:req.body._id},null,{sort:{createdAt:-1}});

    var fieldRequestPayents = await requestFieldPayments.find({player_id:req.body._id},null,{sort:{createdAt:-1}});

    var captainPaymentsList = await captainPayments.find({player_id:req.body._id},null,{sort:{createdAt:-1}});

    var foreArray =  paymentOutput.concat(fieldRequestPayents);
    var final =  foreArray.concat(captainPaymentsList);
   

   if(final.length!=0){
     const sortedActivities = await final.sort((a, b) => b.createdAt - a.createdAt);
     makeArray();

   }else{
     res.send({
              msg: 'Internal server error, Try again',
              status: 0            
              });
   }
            async function makeArray(){
            var cont=0;
            var all_data= [];
            for(let key of final){

              if(key.type=='33'){
                var owner_details= await  Player.findOne({_id:key.captain_id});
                var team_details= await  team.findOne({_id:key.team_id});
      
                var dist= await{
                  id: key.transaction_id,
                  name: team_details.name,
                  date: key.createdAt,
                  ownerfname: owner_details !=null ? owner_details.fname : '',
                  ownerlname: owner_details !=null ? owner_details.lname : '',
                  amount: key.amount,
                  type: key.type
                }
                all_data.push(dist);
                cont++;
                if(cont==final.length){
                  console.log(all_data);
                    res.send({
                      msg: 'Payment details',
                      status: 1,
                      data: all_data            
                });
              }

              }else{
                var owner_details= await  User.findOne({_id:key.owner_id});
                var match_name = await  Match.findOne({_id:key.match_id});
                var dist= await{
                  id: key.payId,
                  name: match_name !=null ?  match_name.name : '',
                  date: key.createdAt,
                  ownerfname: owner_details !=null ? owner_details.fname : '',
                  ownerlname: owner_details !=null ? owner_details.lname : '',
                  amount: key.amount,
                  type: key.type,
                  matchTime: match_name !=null ? match_name.stime : '',
                  matchDate: match_name !=null ? match_name.date : '',
                }
                all_data.push(dist);
                cont++;
                if(cont==final.length){
                  console.log(all_data);
  
                    res.send({
                      msg: 'Payment details',
                      status: 1,
                      data: arraySort(all_data, 'date', {reverse: true})
                });
              }


              }
            }

          }

   }


   exports.credits_details = async (req, res)=>{
    var captainPaymentsList = await captainPayments.find({captain_id:req.body._id},null,{sort:{createdAt:-1}});
    if(captainPaymentsList.length!=0){
      var cont=0;
      var all_data= [];
      for(let key of captainPaymentsList){  
  
          var owner_details= await  Player.findOne({_id:key.player_id});
          var team_details= await  team.findOne({_id:key.team_id});
  
          var dist= await{
            id: key.transaction_id,
            name: team_details.name,
            date: key.createdAt,
            ownerfname: owner_details !=null ? owner_details.fname : '',
            ownerlname: owner_details !=null ? owner_details.lname : '',
            amount: key.amount,
            type: key.type
          }
          all_data.push(dist);
          cont++;
          if(cont==captainPaymentsList.length){
            console.log(all_data);
              res.send({
                msg: 'Payment details',
                status: 1,
                data: arraySort(all_data, 'date', {reverse: true})          
          });
        }
  
    
      }

    }else{
      res.send({
        status: 0            
        });
    }

 
         

  }



 exports.requestFieldPaymentFun = async (req, res)=>{   


    if(req.body.amount==10){

        var matchExists = await Match.find(
              {$and : [
              {
                $or : [
                {stime: { $gte: req.body.stime, $lte: req.body.stime } },
                {stime: { $gte: req.body.etime, $lte: req.body.etime } },
                {etime: { $gte: req.body.stime, $lte: req.body.stime } },
                {etime: { $gte: req.body.etime, $lte: req.body.etime } }
                ]
              },
              {
                 date : req.body.date,
              }
              ,{
        status:1
              },
              {
                 owner_id:req.body.owner_id
              }
              ]}
                  );



    }else{

         var matchExists = await Match.find(
                              {$and : [                              
                              {
                              date : req.body.date,
                              }
                              ,{
                        status:1
                              },
                              {
                                owner_id:req.body.owner_id
                              }
                              ]}
                                  );


    }


   if(matchExists.length==0){


    (async () => {
      // Create a Customer:
      const customer = await stripe.customers.create({
        source: req.body.token,
        email: 'paying.user@example.com',
      });
  
      if(errors.indexOf(customer.id)==-1){
  
        var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });

        var data = {

             payId:OTP,
             transaction_id:customer.id,
             owner_id:req.body.owner_id,
             player_id:req.body.player_id,
             amount:req.body.amount,
             type:1
        }

        var newpayment= new requestFieldPayments(data);

        newpayment.save(function(err, paymentOutput){
          console.log(paymentOutput);
         if(paymentOutput!=null){

             res.send({
                 msg: 'Payment successfull',
                 status: 1,
                 data: {transaction_id:customer.id}         
             });

         }else{
           res.send({
                 msg: 'Internal server error, Try again',
                 status: 0            
             });


         }





        });

                

              
           
          
      }else{
              res.send({
                    msg: 'Payment failed',
                    status: 0,
                      
                });
  
      }
      console.log(customer);
    
    
    })();
    ////

 



   }else{

             res.send({
                  msg: 'This time slot is already taken',
                  status: 4,
                  data: null
                });

       }


   }



exports.get_player_notifications = async function(req, res) {

  var ids=[req.body._id];
  const notifQuery=  await Notifications.find({toId : { $in: ids}, isRead: 0});
  console.log(notifQuery);

 if(notifQuery.length==0){      

                res.send({
                status:0,
                msg: 'No notifications',
                });

   }else{

    var notifications_array=[];
  
    var i=0;
     for(let key of notifQuery){

      if(key.type==1){ 

       var joinedplayersQuery= await User.findOne({_id :key.fromId});
     
         var joinmatchDist= await {
            noti_id: String(key._id),  
            fname: joinedplayersQuery.fname,
            lname:joinedplayersQuery.lname,
            pic:joinedplayersQuery.pic,
            _id: key.data_params.match_id,
            type: 1,
            createdAt : key.createdAt
       }

       notifications_array.push(joinmatchDist);

      }

      if(key.type==50){ 

        var joinedplayersQuery = await team.findOne({_id : key.data_params.teamId});

        if(joinedplayersQuery!=null){

          var joinmatchDist= await {

            noti_id: String(key._id),  
            teamName:  joinedplayersQuery.name,
            teamId: key.data_params.teamId,
            type: 50,
            createdAt : key.createdAt,
            pic : joinedplayersQuery.cover
            }
     
            notifications_array.push(joinmatchDist);

        }
       }

       if(key.type==51){ 

        var joinedplayersQuery = await Player.findOne({_id : key.fromId});

        var joinmatchDist= await {
        noti_id: String(key._id),  
        playerName: joinedplayersQuery.fname,
        teamId: key.data_params.teamId,
        type: 51,
        createdAt : key.createdAt,
        pic : joinedplayersQuery.pic,
        }
 
        notifications_array.push(joinmatchDist);
 
       }


      if(key.type==10){ 

       var joinedplayersQuery = await User.findOne({_id :key.fromId});
       var matchdetails = await Match.findOne({_id :key.data_params.match_id});
      
       var joinmatchDist= await {
        noti_id: String(key._id),  
        fname: joinedplayersQuery.fname,
        lname:joinedplayersQuery.lname,
        pic:joinedplayersQuery.pic,
        _id:key.data_params.match_id,
        type: 10,
        match_name: matchdetails.name,
        fullday: matchdetails.fullday,
        owner_id :  matchdetails.owner_id,
        createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }

      if(key.type==9){ 

        var joinedplayersQuery= await Match.findOne({_id : key.data_params.match_id});
      
          var votingReq= await {
              noti_id: String(key._id),  
              fname:'',
              lname: '',
              gender: joinedplayersQuery.gender,
              name: joinedplayersQuery.name,
              _id : key.data_params.match_id,
              type: 9,
              createdAt : key.createdAt,
              matchDate: joinedplayersQuery.start_day
        }
 
        notifications_array.push(votingReq);
 
       }


      //     if(key.type==4){      
      //  var field_requestsQuery= await User.findOne({_id :key.fromId});
     
      //    var field_requestsDist= await {
      //       noti_id: String(key._id),  
      //  fname: field_requestsQuery.fname,
      //  lname:field_requestsQuery.lname,
      //  pic:field_requestsQuery.pic,
      //  _id:key.data_params.field_id,
      //  type: 3
      //  }

      //  notifications_array.push(field_requestsDist);

      // }



      if(key.type==6){      
         
          var leave_matchQyery = await User.findOne({_id :key.fromId});
          var matchDetails =  await Match.findOne({_id: key.data_params.match_id});
          if(matchDetails!=null){

            var leave_matchDist= await {
              noti_id: String(key._id),  
              fname: leave_matchQyery.fname,
              lname:leave_matchQyery.lname,
              pic:leave_matchQyery.pic,
              _id:key.data_params.match_id,
              type: 6,
              createdAt: key.createdAt,
              matchFees: matchDetails.matchFees
           }
    
           notifications_array.push(leave_matchDist);

          }
      }


      if(key.type==333){   

        var leave_matchQyery = await User.findOne({_id :key.fromId});
        var matchDetails =  await Match.findOne({_id: key.data_params.match_id});
        if(matchDetails!=null){

          var leave_matchDist = await {
            pic: errors.indexOf(leave_matchQyery.pic)==-1 ? leave_matchQyery.pic: null,
            noti_id: String(key._id),  
            _id:key.data_params.match_id,
            type: 333,
            createdAt: key.createdAt,
            matchFees: matchDetails.matchFees,
            noOfPlayers: matchDetails.players,

         }
  
         notifications_array.push(leave_matchDist);

        }
    }



      i++;
      if(i==notifQuery.length){

                  res.send({
                    status:1,
                    msg: 'Owner notifications',
                    data:   arraySort(notifications_array, 'createdAt', {reverse: true})
                    });
                  }
                }      
             }
            }


  exports.clear_player_notifications = async function(req, res) {
    
    
      Notifications.update({_id: req.body._id},{$set:{isRead:1}},{new: true},function(err, match) {

                   if(match!=null){

                  res.send({
                    status:1,
                    msg: 'Cleared'                  

                    });

                  }else{

                   res.send({
                      status:0,
                       msg: 'Internal Server Error, Try again',
                         });

                  }
 
       });

      } 
      
      
  exports.checkSavedCard = async function(req, res) {

        SavedCard.findOne({matchId: req.body.match_id, userID: req.body._id},function(err, match) {
  
                if(match!=null){
                    res.send({
                      status:1,
                      msg: 'Cleared'                  
                      });

                    }else{
  
                     res.send({
                        status:0,
                         
                           });
                    }
   
         });
  
        } 
      
      
    exports.getConfirmations = async function(req, res) {

      var confirmationsData = await Confirmation.find({player_id:req.body._id,status:0});

      if(confirmationsData.length!=0){

      var data=[];
      var cont =0; 
      for(let key of confirmationsData){

      Match.findOne({_id:key.match_id},function(err, matchdetails){
        if(matchdetails!=null){

          var dist =  {
            _id: key._id,
            match_id: key.match_id,
            match_name: matchdetails.name,
            match_pic: matchdetails.cover,
            location: matchdetails.location,
            date: matchdetails.date,
            displayDate: convert24to12(matchdetails.stime),
            stime: matchdetails.stime,
            owner_id: matchdetails.owner_id,
            matchFees: matchdetails.matchFees
           }

           data.push(dist);
           cont++;
           if(cont==confirmationsData.length){
            res.send({
              status:1,
              msg: '',
              data:data
                });
           }

        }else{

           cont++;
           if(cont==confirmationsData.length){
            res.send({
              status:1,
              msg: '',
              data:data
                });
           }
        }
  


      });


      }




       

      }else{

        res.send({
          status:0,
           msg: 'no record',
             });
      }
      }


      //confirm

      exports.ConfirmAvailabilty = async function(req, res) {

        var ownerid = await Match.findOne({_id:req.body.match_id});
        var date =  new Date();
        var currentTime =  date.getTime();
        var matchDate = new Date(ownerid.date+' '+ownerid.stime );  
        var matchTime  = matchDate.getTime();  
        if(currentTime <  matchTime){
          var owner=  await User.findOne({_id:ownerid.owner_id}); 
          Confirmation.update({_id:req.body.confirm_id},{$set:{status:2}},{new:true},function(err, confirmed){  
            if(confirmed!=null){  
              var setdata= {$pull:{player_id:req.body._id}}
              Joinmatch.update({match_id:req.body.match_id},setdata,{new:true}, function(err, user) {                       //fcm 
                Match.update({_id:req.body.match_id}, {$pull:{team1_player_ids: req.body._id, team2_player_ids: req.body._id, team3_player_ids: req.body._id}},{multi: true},function(){
                  
                  if(errors.indexOf(owner.uid)==-1){
                                    
                           fcmToOwner('A player has left your match', owner.uid)

                         }
                    });
                          
                }) 

                /////

                     Followers.findOne({owner_id: ownerid.owner_id}, function(err, followersInfo){
                       if(followersInfo!=null){
                         
                         for(let followerId of followersInfo.player_id){
                           if(followerId!=req.body._id){
                            Player.findOne({_id: followerId}, function(err, followerPlayerId){
                              if(followerPlayerId!=null){
                                var to=  followerPlayerId.uid;
                                var title= 'A spot is vacant for match'+ ownerid.name;
                                var body = 'A spot is vacant for match'+ ownerid.name;
                                sendpush(to, title, body, 1)
  
                              }
                              })

                           }
                        
                         }
                       }
                     })



                //////
  
             res.send({
               status:1,
                msg: 'Declined',
                  });
  
            }else{
              res.send({
                status:0,
                 msg: 'error',
                   });  
            }
  
           });
        }else{
          res.send({
          msg: 'Match has been already started',
          status: 12}); 
         }       
        }


        //get all players

              
    exports.getPlayersForMatch = async function(req, res) {
 
    Player.find({status:1, _id: { $ne: req.body._id  }},function(err,players){

      if(players.length!=0){
        res.send({
          status:1,
           data: players,
             });
   
      }else{
        res.send({
          status:0,
           msg: 'no record',
             });

            }
         })        
      }



         exports.getSelectedPlayers = async function(req, res) {
 
    Player.find({status:1, _id: { $in: JSON.parse(req.body.ids)}},function(err,players){

      if(players.length!=0){
        res.send({
          status:1,
           data: players,
             });
   
      }else{
        res.send({
          status:0,
           msg: 'no record',
             });

            }
         })        
      }


  //make a team
    exports.createTeam = async function(req, res) {

      var upload = multer({ storage: uploadTeamPic }).single('file');

      upload(req, res, function (err) {

      var data= {
            player_id: req.body._id,
            name: req.body.name,
            cover: req.file.filename,
            players: [req.body._id]
                                 }
      var newTeam= new team(data);

      newTeam.save(function(err, teamCreated){
        if(teamCreated!=null){
 
            var cont=0;

            for(let key of JSON.parse(req.body.ids)){

              var invitationData = {
                team_id: teamCreated._id,
                team_owner_id: req.body._id,
                player_id: key,
                status: key==  req.body._id ? 1 : 0
              }

              var newteamInvitation= new teamInvitation(invitationData);
              newteamInvitation.save();

              Player.findOne({_id: key},function(err, player){

                if(key!=req.body._id){
                  var toId= key;     

                  var fromId= req.body._id;
  
                  var params= {teamId: teamCreated._id}
  
                  add_notification(fromId, toId, 50, params);

                  if(errors.indexOf(player)==-1){
                    if(errors.indexOf(player.uid)==-1){
                      
                      var to=  player.uid;
                      var title= 'Got team invitation';
                      var body = "You got an invitation to become a team member";
                      sendpush(to, title, body, 1)
                     }
  
                  }
                }

             
               
              });
              cont++;
              if(cont==JSON.parse(req.body.ids).length){

                Player.update({_id: req.body._id}, {$set:{ hasTeam:1}}, {new: true}, function(err, haveTeam){
                      res.send({
                        status:1,
                        team: teamCreated
                          });
                })

              }
             }

        }else{

          res.send({
            status:0,
             msg: 'error',
               });
             }
           });
         });        
        }


        
    exports.changeTeamPic = async function(req, res) {

      var upload = multer({ storage: uploadTeamPic }).single('file');

      upload(req, res, function (err) {
 
      team.update({_id: req.body.id}, {$set: {cover: req.file.filename}}, function(err, teamCreated){
        if(teamCreated!=null){
          res.send({
            status:1,
             msg: null,
               });
            
        }else{

          res.send({
            status:0,
             msg: 'error',
             error: err
               });
             }
           });
         });        
        }

    exports.updateTeamName = async function(req, res) {

      team.update({_id: req.body.id}, {$set: {name: req.body.name}}, function(err, teamCreated){
        if(teamCreated!=null){
          res.send({
            status:1,
             msg: null,
               });
            
        }else{

          res.send({
            status:0,
             msg: 'error',
             error: err
               });
             }
           }); 

            }


          //make a team
    exports.add_players_to_team = async function(req, res) {


      var teamDetail = await team.findOne({player_id: req.body._id});
      if(teamDetail.players.length>=15){
        res.send({
          status:0
             });
      }else{
        var ids = JSON.parse(req.body.ids)
        var i = 0;
        for(let key of ids){

          teamInvitation.find({team_id: teamDetail._id, player_id: key}, function(err, invitationExists){
  
           if(invitationExists.length==0){
            var invitationData = {
              team_id: teamDetail._id,
              team_owner_id: req.body._id,
              player_id: key,
              status: key ==  req.body._id ? 1 : 0
            }
  
            var newteamInvitation= new teamInvitation(invitationData);
            newteamInvitation.save(function(err, SaveInvitation){
                  i++
                  if(i==ids.length){
                    res.send({
                      status:1
                         });
                  }
              
            });

            callNotification();
  
           }else{
  
            if(teamDetail.players.indexOf(key)==-1){
              teamInvitation.updateMany({team_id: teamDetail._id, player_id: key}, {$set: {status:0}}, {new: true}, function(err, invitationExists){
                i++
                if(i==ids.length){
                  res.send({
                    status:1
                       });
                }
    
              });

              callNotification()

            }else{
              i++

              if(i==ids.length){
                res.send({
                  status:1
                     });
              }
  
            }  
            
           }
  
  
          });



          function callNotification(){
            if(key!=req.body._id){
              var toId = key;     
  
              var fromId= req.body._id;
    
              var params= {teamId: teamDetail._id}
    
              add_notification(fromId, toId, 50, params);
  
              Player.findOne({_id: key},function(err, player){
  
                if(key!=req.body._id){
                  var toId= key;     
  
                  var fromId= req.body._id;
  
                  var params= {teamId: teamDetail._id}
  
                  add_notification(fromId, toId, 50, params);
                }
  
                if(errors.indexOf(player)==-1){
                  if(errors.indexOf(player.uid)==-1){
                    
                    var to=  player.uid;
                    var title= 'Got team invitation';
                    var body = "You got an invitation to become a team member";
                    sendpush(to, title, body, 1)
                   }
  
                }
               
              });
            }
          }
  
   
          
          }

      }
   
      
      }


  exports.getAllInvitations = function(req, res){

    teamInvitation.find({player_id:req.body._id, status:0},function(err, invitations){

       if(invitations.length!=0){



           var resData = [];
           var cont = 0;
          for(let key of invitations){
            team.findOne({_id: key.team_id}, function(err, teamOutput){

            
             
              if(teamOutput!=null){

                Player.findOne({_id: key.player_id}, function(err, PlayerDetails){

                  Player.findOne({_id: key.team_owner_id}, function(err, captain){
                    if(captain!=null){

                      var dist= {
                        _id: key._id,
                        team_id: teamOutput._id,
                        player_id: key.player_id,
                        cover: teamOutput.cover,
                        name: teamOutput.name,
                        player_fname: captain.fname,
                        player_lname: captain.lname,
                        dateTime: key.createdAt
                       }
      
                       resData.push(dist);
                       cont++;
                       if(cont==invitations.length){
                        res.send({
                                status:1,
                                data: resData,
                                });
                              }
     
                    }else{
                      res.send({
                        status:0,
                         msg: 'Something went wrong',
                           });
      
                    }


                  })

                 
   
                 })

             
              }else{
                res.send({
                  status:0,
                   msg: 'Something went wrong',
                     });

              }

                  
                           });

            
          }

    

       }else{

        res.send({
          status:0,
           msg: 'no data',
             });
            }
        });
      }

exports.actionOnTeaminvitation = async (req, res)=>{
 var teamDetails = await team.findOne({_id: req.body.t_id});
 if(teamDetails.players.length>=15){
  res.send({
    status:5
       });

 }else{
  if(req.body.status==1){   
    teamInvitation.update({_id:req.body.i_id},{$set:{status:1}},{new:true},function(err, invitations){
      console.log('1');
      if(invitations!=null){
        console.log('2');
        var setdata= {$push:{players:req.body._id}};
        team.update({_id: req.body.t_id},setdata,{new:true}, function(err, teamOutput){
          console.log('3');
          console.log(teamOutput);
          if(teamOutput!=null){


            var toId = teamDetails.player_id;     

            var fromId = req.body._id;

            var params = {teamId: req.body.t_id}

            add_notification(fromId, toId, 51, params);

                  res.send({
                    status:1,
                    msg: 'Invitation has been accepted',
                      });


          }else{
            res.send({
              status:0,
              msg: 'Something went wrong',
                 });

          }



        });
 
 
      }else{
 
       res.send({
         status:0,
         msg: 'Something went wrong',
            });
      }
 
 
     });



  }else{
    teamInvitation.update({_id:req.body.i_id},{$set:{status:2}},{new:true},function(err, invitations){

     if(invitations!=null){
      res.send({
        status:1,
         msg: 'Invitation has been declined',
           });


     }else{

      res.send({
        status:0,
        msg: 'Something went wrong',
           });
     }


    });


  }

 }


}


exports.remove_player_from_team = async (req, res)=>{

  teamInvitation.deleteMany({team_id: req.body.team_id, player_id: req.body._id },function(err, invitations){
    if(invitations!=null){

      team.update({_id: req.body.team_id},{$pull:{players: req.body._id}},{new:true}, function(err, teamOutput){
        res.send({
          status:1,
          msg: 'Removed',
            });

      }); 

        }else{
        res.send({
          status:0,
          msg: 'Something went wrong',
            });
        }


   });

}

exports.getPlayerInfo = async (req, res)=>{

  var player  = await Player.findOne({_id: req.body._id})

  team.find({player_id: req.body._id}, function(err, teamOutput){

    if(teamOutput.length!=0){
      res.send({
        status:1,
        msg: 'has team',
        team_id: teamOutput._id,
        points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5))
           });

    }else{
      
      res.send({
        status:0,
        msg: 'has no team',
        points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5))
           });


    }



  })

}

//get players for vote//

exports.getJoinedPlayers = async (req, res)=>{

  var joinedPlayers = await Joinmatch.findOne({match_id: req.body.match_id});

  if(joinedPlayers!=null){
      var players = [];
      var cont = 0;
     for(let key of joinedPlayers.player_id){
         Player.findOne({_id: key}, function(err, player){
            if(player!=null){
              players.push(player);
              cont++;
       
            }else{

              cont++;

            }
        
          if(cont== joinedPlayers.player_id.length){
            res.send({
              status:1,
              msg: 'joined players',
              data: players
                 });
          }



         });

     }




  }else{
    res.send({
      status:0,
      msg: 'No player found',
     
         });
    


  }


}


//get players for vote//

exports.voteForMOTM = async (req, res)=>{

  var recordExists = await vote.findOne({match_id : req.body.match_id, fromId : req.body.fromId });
  
  if(recordExists==null){ 
    var voteData = {
      match_id : req.body.match_id,  
      toId : req.body.toId,
      fromId : req.body.fromId,
      comment : req.body.comment,
     }
  
    var newVote= new vote(voteData);
    newVote.save(function(err, voteRes){
  
      if(voteRes!=null){
  
            Player.update({ _id: req.body.toId }, { $inc: { points: 1 } }, {new: true },function(err, response) {
  
              if(response!=null){
                res.send({
                  status:1,
                  msg: 'Voted successfully',
                  });
  
  
              }else{
  
                res.send({
                  status:0,
                  msg: 'error',
                  });
              }
  
  
            })
  
      }else{
  
        res.send({
          status:0,
          msg: 'error',
          });
  
      }
  
    });


  }else{
    res.send({
      status:2,
      msg: 'already voted',
      });


  }

}

    
//get my votes//

exports.getMyVotes = async (req, res)=>{

  var recordExists = await vote.find({toId : req.body.toId});
  
  if(recordExists.length!=0){
      var cont = 0;
      var resData= [];
      for(let key of recordExists){
          Player.findOne({_id: key.fromId}, function(err, playerDetails){

            if(playerDetails!=null){

             Match.findById(key.match_id,function(err, matchDetails){

              if(matchDetails!=null){
                  var dist = {
                  fromFName : playerDetails.fname,
                  fromLName : playerDetails.lname,
                  matchName : matchDetails.name,
                  _id : key._id,
                  pic: playerDetails.pic,
                  comment:  key.comment,
                  matchDate:  matchDetails.date

                  }

                  resData.push(dist);
                  cont++;
                  if(cont==recordExists.length){
                    res.send({
                      status:1,
                      msg: 'votes',
                      data:  resData
                      });

                  }

              }else{
                res.send({
                  status:2,
                  msg: 'Internal server error',
                  });
              }


             })


            }else{

              res.send({
                status:2,
                msg: 'Internal server error',
                });

            }


          });


      }
   
  

  }else{
    res.send({
      status:0,
      msg: 'No votes',
      });


  }

}

  //get my votes//

  exports.getHoursOfPlay = async (req, res) => {

        var ids = [req.body._id];

        var recordExists = await Joinmatch.find({"player_id": {"$in": ids}, status:1});


        if(recordExists.length!=0){
          var counter = 0, total_hours = 0;
          for(let key of recordExists){

          
            Match.findOne({_id : String(key.match_id), isCancelled: 2, paid: 1}, function(err, match){
             
                if(match!=null){

                  console.log('recordExists recordExists recordExists)', match.stime, match.team1, match.isCaptain1)

                var date1, date2;
                date1 = makeRequiredDateFormat(match.start_day);
                date2 = makeRequiredDateFormat(match.end_day);

             
                total_hours = total_hours + diff_hours(date1, date2); 
                counter = counter + 1;
              
                if(counter == recordExists.length){
                  
                  res.send({
                    hours : Math.abs(total_hours)
                  })
                }
      //==========
          }
          else{
             counter = counter + 1;
            
            if(counter == recordExists.length){
              res.send({
                hours : Math.abs(total_hours)
              })
            }
          }
      });
    }
  }
  else{
    res.send({
      hours : 0
    })
  }


  function diff_hours(dateA, dateB) 
  {
    var dt1, dt2;
    dt1 = new Date(dateA);
    dt2 = new Date(dateB);

    console.log('dateA' , dateA);
    console.log('dateB' , dateB);
    console.log('dt2.getTime()' , dt2.getTime());
    console.log('dt2.getTime()' , dt2.getTime());

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    console.log('diff' ,diff);
    // return Math.abs(Math.round(diff));
    return diff;
    
  }

  function makeRequiredDateFormat(date){

    var month = date.split('-')[1]
    var day_temp =  date.split('-')[2]
    var day  = day_temp.split(' ')[0]
    var year = date.split('-')[0]
    var time = date.split(' ')[1]
    
    
    var monthName;
    
    if(month=='1'){
        monthName = 'January';
    }
    
    if(month=='2'){
        monthName = 'February';
    }
    
    if(month=='3'){
        monthName = 'March';
    }
    
    if(month=='4'){
        monthName = 'April';
    }
    
    if(month=='5'){
        monthName = 'May';
    }
    
    if(month=='6'){
        monthName = 'June';
    }
    
    if(month=='7'){
        monthName = 'July';
    }
    
    if(month=='8'){
        monthName = 'August';
    }
    
    if(month=='9'){
        monthName = 'September';
    }
    
    if(month=='10'){
        monthName = 'October';
    }
    
    if(month=='11'){
        monthName = 'November';
    }
    
    if(month=='12'){
        monthName = 'December';
    }
    
    
    var dateString = monthName+' '+day+', '+year+' '+time

    return dateString;

  }
};

// get players for request match

exports.getPlayersForRequestField = async function(req, res){

  team.findOne({player_id: req.body._id}, function(err, teamOutput){

    console.log(teamOutput);

    if(teamOutput!=null){
      var resData= [];
      var cont = 0; 
      if(teamOutput.players.length!=0){
        for(let key of teamOutput.players){
          console.log('11111');
  
          Player.findOne({_id: key}, function(err, playerDetails){
             if(playerDetails!=null){
               resData.push(playerDetails);
             }
             cont++;
             console.log('22222');
             if(cont==teamOutput.players.length){
              console.log(resData);
              res.send({
                status:1,
                msg: 'Players',
                data : resData,
                team_id: teamOutput._id
                });
  
             }
  
          });
  
  
        }

      }else{
        res.send({
          status : 3,
          msg : 'No players'
          });

      }
  
    }else{

      res.send({
        status : 0,
        msg : 'No team'
        });
    }
  })
}


exports.getTeamData = async (req, res)=>{

  team.findOne({_id: req.body._id}, function(err, teamOutput){

    if(teamOutput!=null){
      res.send({
        status: 1,
        data: teamOutput
           });
    }else{

      res.send({
        status:0,
           });

    }

  })

}


exports.getTeamInfo = async (req, res)=>{

  team.findOne({player_id: req.body._id}, function(err, teamOutput){

    if(teamOutput!=null){

     teamInvitation.find({team_id: teamOutput._id}, function(err, invitedPlayers){

      if(invitedPlayers.length!=0){
        var resData= [];
        var cont = 0;
         for(let key of invitedPlayers){
            Player.findOne({_id : key.player_id}, function(err, playerRes){
              if(playerRes!=null){
                 var dict = {
                   player_id : playerRes._id,
                   fname: playerRes.fname,
                   lname: playerRes.lname,
                   pic: playerRes.pic,
                   status : key.status,
                   _id : key._id,
                   team_id : teamOutput._id,
                   createdAt : key.createdAt
                 }
                 resData.push(dict)
 
                 cont++
                 if(cont==invitedPlayers.length){
                   res.send({
                     status:1,
                     msg: 'Team',
                     data: arraySort(resData, 'createdAt', {reverse: true}),
                     team_name: teamOutput.name,
                     _id :  teamOutput._id,
                     cover: teamOutput.cover,
                     ids: teamOutput.players
                        });
 
 
                 }
 
 
              }else{
                 cont++
                 if(cont==invitedPlayers.length){
                   res.send({
                     status:1,
                     msg: 'Team',
                     data: arraySort(resData, 'createdAt', {reverse: true}),
                     team_name: teamOutput.name,
                     cover: teamOutput.cover,
                     ids: teamOutput.players
                        });
                 }

              }
 
 
            })
 
 
         }

      }else{
        res.send({
          status:0,
          msg: 'error',
             });
      }
     })
     
    }else{
      
      res.send({
        status:0,
        msg: 'has no team',
           });
    }
  })

}


exports.getTeamPlayerIds = async (req, res)=>{

  team.findOne({_id: req.body.team_id}, function(err, teamOutput){

      res.send({
          ids:teamOutput!=null? teamOutput.players : [],
          captain_id: teamOutput!=null? teamOutput.player_id : 0, 
      });
    })
}

exports.confirmPayment = async function (req, res) {  
 
      var joined = await Match.findOne({_id: req.body.match_id});

      var cardDetails = await SavedCard.findOne({userID: req.body._id, matchId: req.body.match_id});
      
      if(cardDetails!=null){

      var date =  new Date();
      var currentTime =  date.getTime();

      var matchDate = new Date(joined.date+' '+joined.stime );

      var matchTime  = matchDate.getTime();

      if(currentTime <  matchTime){
        var userStrieId = await User.findOne({_id: req.body.owner_id});

        if(userStrieId!=null){
           if(errors.indexOf(userStrieId.stripe_id) == -1){
    
          if(errors.indexOf(cardDetails.customerId)==-1){
              var adminMoney =  (10/100) * Number(cardDetails.amount)
              var userMoney =  (90/100) * Number(cardDetails.amount)
              stripe.charges.create(
                  {
                      'currency' :'USD',
                      'amount' : adminMoney*100,
                      'description' : 'Match commison to admin',
                      'customer' : cardDetails.customerId,
                      
                  },
                  function(err, charge) {  
    
                      if(errors.indexOf(charge)==-1){
    
                          stripe.charges.create(
                              {
                                  "amount" : userMoney*100,
                                  "currency" : 'USD',
                                  "description" : "Trip amount to user",
                                  "source" : charge.source.id,
                                  "customer" : charge.source.customer,
                                  "application_fee" : 0,
                                  transfer_data: {
                                  destination: userStrieId.stripe_id,
                                  },
                               
                                  'capture' :  true
                              },
                              function(err, charge) {
          
                                if(errors.indexOf(charge)==-1){
    
                                var AdminDepositData = {
                                  match_id: req.body.match_id,
                                  amount: adminMoney,
                                  player_id: req.body._id
                                 
                                }
                                var newAdminDeposit = new AdminDeposits(AdminDepositData);
                                   newAdminDeposit.save(function (err, paymentOutput) {
                                  console.log(paymentOutput);
                                  
                                });
                                     
                                  var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                                  var type = Number(req.body.type)
                                  var data = {
                                            payId: OTP,
                                            transaction_id: charge.id,
                                            owner_id: req.body.owner_id,
                                            player_id: req.body._id,
                                            amount: adminMoney,
                                             type: type==1 ? 3 : 1,
                                             matchId: req.body.match_id
                                          }
                                      var newpayment = new paymentToOwner(data);
    
                                      newpayment.save(function (err, paymentOutput) {
                                        console.log(paymentOutput);
                                        
                                      });
                
                                    var data= {
                                        payId: OTP,
                                        transaction_id: charge.id,
                                        owner_id: req.body.owner_id,
                                        match_id: req.body.match_id,
                                        player_id: req.body._id,
                                        amount: userMoney,
                                    }
    
                                    var newpayment= new bookingPayment(data);
    
                                   newpayment.save();
                                
                                    Match.update({_id: String(req.body.match_id)},{$set:{status:1}},{new:true}, function(){
                                      });
    
                                    if(type==1){
                                       
                                      Notifications.update({_id:req.body.confirmation_id},{$set:{isRead:1}},{new:true},function(){
                                      });
    
                                    }else{
    
                                      var toId = req.body.owner_id;
                                      var fromId = req.body._id;
                                      var params = {match_id:req.body.match_id, coming_status: Number(req.body.coming_status)}
                  
                                      add_notification(fromId,toId,13,params);
    
                                      Confirmation.update({_id:req.body.confirmation_id},{$set:{status:1}}, {new:true}, function(err, output){
                                        
                                      });
                                    }
    
                        
                                res.send({
                                  msg: 'Payment successfull',
                                  status: 1,
                                  data: null
                                });
                                 }else{
    
                                  res.send({
                                    msg: "Error while paying to owner.",
                                    status: 0,
                                    data: null
                                  });
    
    
                                }
                              }
                            );
              
                      }else{
                        res.send({
                          msg: "Error while paying to owner.",
                          status: 0,
                          data: null
                        });      
              
                      }
                    }
                );
    
          }else{
            res.send({
              msg: "Error while paying to owner.",
              status: 0,
              data: null
            });
    
          }
    
 
    
    
    /////this
           }
           else{
              res.send({
                msg: 'Owner has not connected with stripe.',
                status: 0,
                data: null
              });
           }
    
        }else{
             res.send({
                msg: "Owner's account is unreachable.",
                status: 0,
                data: null
              });
    
        }
    
        function send_error(msg){
              res.send({
                msg: msg,
                status: 0,
                data: null
              });
        }



      }else{
        res.send({
        msg: 'Match has been already started',
        status: 12}); 
       }


      }else{
        res.send({
          status: 0}); 
      }

}



exports.confirmPayment_1 = async function (req, res) {
  
  const customer = await stripe.customers.create({
    source: req.body.token,
    email: 'harinderorg@gmail.com',
  });

 
  var joined = await Match.findOne({_id: req.body.match_id});

  if(errors.indexOf(customer.id)==-1){

  var date =  new Date();
  var currentTime =  date.getTime();

  var matchDate = new Date(joined.date+' '+joined.stime );

  var matchTime  = matchDate.getTime();

  if(currentTime <  matchTime){
    var userStrieId = await User.findOne({_id: req.body.owner_id});

    if(userStrieId!=null){
       if(errors.indexOf(userStrieId.stripe_id) == -1){

      if(errors.indexOf(customer.id)==-1){
          var adminMoney = Number(req.body.commission)
          var userMoney = Number(req.body.amount)
          stripe.charges.create(
              {
                  'currency' :'USD',
                  'amount' : adminMoney*100,
                  'description' : 'Match commison to admin',
                  'customer' : customer.id,
                  
              },
              function(err, charge) {  

                  if(errors.indexOf(charge)==-1){

                      stripe.charges.create(
                          {
                              "amount" : userMoney*100,
                              "currency" : 'USD',
                              "description" : "Trip amount to user",
                              "source" : charge.source.id,
                              "customer" : charge.source.customer,
                              "application_fee" : 0,
                              transfer_data: {
                              destination: userStrieId.stripe_id,
                              },
                           
                              'capture' :  true
                          },
                          function(err, charge) {
       console.log('err',err)
     
    console.log('charge',charge)
                            if(errors.indexOf(charge)==-1){

                            var AdminDepositData = {
                              match_id: req.body.match_id,
                              amount: adminMoney,
                              player_id: req.body._id
                             
                            }
                            var newAdminDeposit = new AdminDeposits(AdminDepositData);
                               newAdminDeposit.save(function (err, paymentOutput) {
                              console.log(paymentOutput);
                              
                            });
                                 
                              var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
                              var type = Number(req.body.type)
                              var data = {
                                        payId: OTP,
                                        transaction_id: charge.id,
                                        owner_id: req.body.owner_id,
                                        player_id: req.body._id,
                                        amount: adminMoney,
                                        type: type==1 ? 3 : 1,
                                        matchId: req.body.match_id
                                      }
                                  var newpayment = new paymentToOwner(data);

                                  newpayment.save(function (err, paymentOutput) {
                                    console.log(paymentOutput);
                                    
                                  });
            
                                var data= {
                                    payId: OTP,
                                    transaction_id: charge.id,
                                    owner_id: req.body.owner_id,
                                    match_id: req.body.match_id,
                                    player_id: req.body._id,
                                    amount: req.body.amount,
                                }

                                var newpayment= new bookingPayment(data);

                               newpayment.save();
                            
                                Match.update({_id: String(req.body.match_id)},{$set:{status:1}},{new:true}, function(){
                                  });

                                if(type==1){
                                   
                                  Notifications.update({_id:req.body.confirmation_id},{$set:{isRead:1}},{new:true},function(){
                                  });

                                }else{

                                  var toId = req.body.owner_id;
                                  var fromId = req.body._id;
                                  var params = {match_id:req.body.match_id, coming_status: Number(req.body.coming_status)}
              
                                  add_notification(fromId,toId,13,params);

                                  Confirmation.update({_id:req.body.confirmation_id},{$set:{status:1}}, {new:true}, function(err, output){
                                    
                                  });
                                }

                    
                            res.send({
                              msg: 'Payment successfull',
                              status: 1,
                              data: null
                            });
                             }else{

                              res.send({
                                msg: "Error while paying to owner.",
                                status: 0,
                                data: null
                              });


                            }
                          }
                        );
          
                  }else{
                    res.send({
                      msg: "Error while paying to owner.",
                      status: 0,
                      data: null
                    });      
          
                  }
                }
            );

      }else{
        res.send({
          msg: "Error while paying to owner.",
          status: 0,
          data: null
        });

      }




/////this
       }
       else{
          res.send({
            msg: 'Owner has not connected with stripe.',
            status: 0,
            data: null
          });
       }

    }else{
         res.send({
            msg: "Owner's account is unreachable.",
            status: 0,
            data: null
          });

    }

    function send_error(msg){
          res.send({
            msg: msg,
            status: 0,
            data: null
          });
    }



  }else{
    res.send({
    msg: 'Match has been already started',
    status: 12}); 
   }


  }else{
    res.send({
      status: 0}); 
  }

}

exports.playerAllInfo = async function (req, res) {
    
  var team_output  = await team.findOne({player_id: req.body._id});

  Player.findOne({_id: req.body._id}, function(err, player){

if(player!=null){
  res.send({
    status: 1,
    data: player,
    team : team_output!=null ? team_output : [],
    points: player.points < 10 ? 0 : ((player.points >= 10 && player.points < 20) ? 1 : ((player.points >= 20 && player.points < 30) ? 2 : (player.points >= 30 && player.points < 40) ? 3 : (player.points >= 40 && player.points < 50) ? 4 : 5)),
  });
 
}else{
  res.send({
    
    status: 0,
    
  });


}


  });
}


exports.payToCaptain = async function (req, res) {
var teaminfo = await team.findOne({_id: req.body.team_id})
var captain = await Player.findOne({_id: teaminfo.player_id});

if(errors.indexOf(captain.stripe_id)==-1){
  stripe.charges.create(
    {
      amount: req.body.amount*100,
      currency: 'usd',
      source: req.body.token,
      description: 'Payment to captain',
    },
    function(err, charge) {

      if(errors.indexOf(charge.id)==-1){
        var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
        var data = {
          transaction_id: OTP,
          captain_id: teaminfo.player_id,
          player_id: req.body._id,
          team_id: req.body.team_id,
          amount: req.body.amount,	
          type: 33
        }
        var newcaptainPayments =new captainPayments(data);
        newcaptainPayments.save(function(err, newcaptainPaymentsOutput){
          res.send({
            status: 1,
          });

        });
 

      }else{
        res.send({
          status: 0,
        });

      }
      
    }
  );

}else{
        res.send({
            status: 2,
          });

}



}

exports.add_chat = function (req, res) {

   var data = {
        fromId: req.body.fromId,
        toId: req.body.toId,
        message: req.body.message,
        fromType: req.body.fromType,
        toType: req.body.toType,
        readIds: req.body.toId
   }

   var newChat = new chat(data);

   newChat.save(function(err, output){


     if(err){
          res.send({
             status: 0,
          });

     }else{

  
      if(req.body.toType == 'player'){
       
        Player.findOne({_id: req.body.toId}, function(err, playerInfo){
          if(errors.indexOf(playerInfo.uid)==-1){
            var to=  playerInfo.uid;
            var title= 'New message: '+ req.body.message;
            var body = 'New message: '+ req.body.message;
            sendpush(to, title, body, 1)
          }
        })
  
      }else{
       
        User.findOne({_id: req.body.toId}, function(err, userInfo){
  
          if(errors.indexOf(userInfo.uid)==-1){

            console.log('coming to home')
            var to =  userInfo.uid;
            var title= 'New message: '+ req.body.message;
            fcmToOwner(title, to)
          }
          
        }) 
      }

          res.send({
            status: 1,
          });
     }
    
   });
 
}

exports.deleteChat = function (req, res) {

  var myId = [req.body._id];
  var hisId = [req.body.personId];

  chat.update({$or:[{toId: {$in : myId}, fromId : req.body.personId}, {toId: {$in: hisId} , fromId:  req.body._id}], is_group:'0'},{$push: {deleted: req.body._id}, $pull: { readIds: req.body._id}}, {multi: true}, function(err, messages){
    if(err){
         res.send({
            status: 0,
         });

    }else{
         res.send({
           status: 1,
         });
    }
   
  });

}


exports.dltSingleMsg = function (req, res) {
  chat.update({_id: req.body.msgId}, {$push: {deleted: req.body._id}}, function(err, messages){
    if(err){
         res.send({
            status: 0,
         });

    }else{
         res.send({
           status: 1,
         });
    }
   
  });
}

exports.deleteGroupChat = function (req, res) { 

  var myId = [req.body._id];

  chat.update({$or:[{toId: {$in : myId}}, {fromId: req.body._id}], is_group:'1', team_id: req.body.team_id}, {$push: {deleted: req.body._id}, $pull: { readIds: req.body._id}}, {multi: true}, function(err, messages){
    if(err){
         res.send({
            status: 0,
         });

    }else{
         res.send({
           status: 1,
         });
    }
   
  });

}

exports.group_chat = async function (req, res) {
  var team_info = await team.findOne({_id: req.body.team_id});
  if(team_info.players.length > 1){
  

        var toIds =   team_info.players;
        var myIndex = toIds.indexOf(req.body._id)
                      toIds.splice(myIndex, 1);
        var data = {
          fromId: req.body._id,
          toId: toIds,
          message: req.body.message,
          fromType: 'player',
          toType: 'player',
          is_group: '1',
          team_id: req.body.team_id,
          readIds: toIds,
          is_card:'0'
        }

       var newChat = new chat(data);
      newChat.save(function(err, output){
      if(err){
         res.send({
              status: 0,
          });

      }else{

        var count = 0;
        for(let playerId of toIds){
          Player.findOne({_id: playerId}, function(err, playerInfo){
            if(errors.indexOf(playerInfo.uid)==-1){
              var to=  playerInfo.uid;
              var title= 'New message: '+ req.body.message;
              var body = 'New message: '+ req.body.message;
              sendpush(to, title, body, 1)
            }
          })

          count++;

          if(count == toIds.length){
            res.send({
              status: 1,
           });
          }

        }


      }

      });

    
  }else{
    res.send({
      status: 2,
    });
  }


}

exports.sendLink = async function (req, res) {
  var team_info = await team.findOne({_id: req.body.team_id});
  if(team_info.players.length > 1){
    console.log('team_info.players',team_info.players)

        var toIds =   team_info.players;
        var myIndex = toIds.indexOf(req.body._id)
                      toIds.splice(myIndex, 1);
        var data = {
          fromId: req.body._id,
          toId: toIds,
          message: req.body.message,
          fromType: 'player',
          toType: 'player',
          is_group: '1',
          team_id: req.body.team_id,
          readIds: toIds,
          is_card:'1',
          amount: req.body.amount,
        }

       var newChat = new chat(data);
      newChat.save(function(err, output){
      if(err){
         res.send({
              status: 0,
          });

      }else{
         res.send({
            status: 1,
         });
      }

      });

    
  }else{
    res.send({
      status: 2,
    });
  }


}

exports.search = function (req, res) {

  var playerResponse;
  Player.find({$or: [ {"fname" : { '$regex': req.body.keyword, $options: 'i' }}, { "lname": { '$regex': req.body.keyword, $options: 'i' } } ] }, function(err, playerOutput)   { 
    playerResponse = playerOutput
    ownerSerach()
});

function ownerSerach(){
  var ids = [req.body._id]  
  Followers.find({player_id: { $in: ids}}, function(err, match) {
       
    if(match.length==0){
        res.send({
        status: 1,
        players: playerResponse,
        owners: [] 
        });
    }else{
            var ownerIds=[];
            var cont = 0;
          
            for(let key of match)  {

         ownerIds.push(key.owner_id);
           cont++;
           if(cont==match.length){
           
             getowners(ownerIds);
           }

  
          
             }             
          }

       }); 

function getowners(ownerIds){

  Property.find({owner_id: { $in: ownerIds}, name : { '$regex': req.body.keyword, $options: 'i' }}, function(err, p_output){

   if(p_output.length!=0){
     var valid_ids =[]
     var counting = 0;

     for(let key of p_output){
          

                 
       valid_ids.push(
                   {
                   name: key.name,
                   cover:  key.cover,
                   _id:  key.owner_id,
                   city:  key.city,
                 })
       counting++;

       if(counting==p_output.length){

        res.send({
          status: 1,
          players: playerResponse,
          owners: valid_ids 
          });
         }    

     }


   }else{

    res.send({
      status: 1,
      players: playerResponse,
      owners: [] 
      });

   }
 } )

}
}

}



exports.saveCalendar = function (req, res) {

   var data = {

        player_id: req.body._id,
        match_id: req.body.match_id,
       
 
   }

   var newCalendar = new Calendar(data);

   newCalendar.save(function(err, output){
     if(err){
          res.send({
             status: 0,
          });

     }else{
          res.send({
            status: 1,
          });
     }
    
   });
 
}


exports.get_chat = async function (req, res) {

      var user = [];
      if(req.body.type == 'owner'){
         var property_detail = await Property.findOne({owner_id: req.body.personId});
         if(property_detail!=null){
           user = {
             _id: req.body.personId,
             name: property_detail.name,
             city: property_detail.city,
             pic: property_detail.cover

           }
         }
      }else{
           user = await Player.findOne({_id: req.body.personId},'fname lname  pic _id');

      } 
      
   var isId = [req.body._id]

   chat.find({$or:[{toId:req.body._id, fromId : req.body.personId}, {toId: req.body.personId , fromId:  req.body._id}], is_group:'0', deleted: {$nin: isId}},function(err, messages){

     if(messages.length!=0){
       chat.update({toId:req.body._id, fromId : req.body.personId},  { $pull: { readIds :  req.body._id}}, {multi: true}, function(err, output){});

          res.send({
             status: 1,
             data: messages,
             user:user
          });

     }else{
          res.send({
             status: 0,
          });
     }
  
   });
 
 
}

exports.get_group_chat = async function (req, res) {
var myId = [req.body._id];
var team_info = await team.findOne({_id: req.body.team_id});
var is_stripe = await Player.findOne({_id: team_info.player_id});

  var teamInfo = [];
  teamInfo = {
       name: team_info.name,
       pic: team_info.cover,
       captain_id: team_info.player_id,
       is_stripe: is_stripe.stripe_id,
      }

var myId =[req.body._id]
chat.find({$or:[{toId:{$in:myId}, team_id : req.body.team_id}, {fromId: req.body._id, team_id : req.body.team_id}], is_group:'1', deleted: {$nin: myId}},function(err, messages){

  if(messages.length!=0){
    var data = [];
    var i = 0;

    for(let key of messages){
     Player.findOne({_id: key.fromId}, function(err, player_output){
       
       var dist = {
        is_card: key.is_card,
        fromId : player_output._id,
        pic: player_output.pic,
        name : player_output.fname[0].toUpperCase()+player_output.fname.slice(1)+ ' '+player_output.lname[0].toUpperCase()+player_output.lname.slice(1),
        message: key.message,
        createdAt : key.createdAt,
        _id: key._id,
        amount: key.amount
       }

      data.push(dist);
      i++
      if(i == messages.length){
        chat.update({$or:[{toId:{$in:myId}, team_id : req.body.team_id}, {fromId: req.body._id, team_id : req.body.team_id}], is_group:'1'}, { $pull: { readIds :  req.body._id}}, {multi: true}, function(err, output){});
        res.send({
          status: 1,
          data: arraySort(data, 'createdAt'),
          teamInfo: teamInfo
        });      
    }
     })     
    }

  }else{
        res.send({
          status: 0,
        });
    }

});

}

exports.get_all_chats = function (req, res) {


   var my_id = [req.body._id]
   chat.find({$or:[{toId: {$in: my_id}}, {fromId: req.body._id}], is_group: '0', deleted: {$nin: my_id}}, null,{sort: {'createdAt': -1}}, function(err, messages){
  
     console.log(messages)
     var data =[];
     if(messages.length!=0){

            
              var ids = [];
              var i = 0;

          for(let key of messages){

            var other_person_id =  (key.toId[0]==req.body._id) ? key.fromId : key.toId[0]   
            
            if(ids.indexOf(other_person_id)==-1){
            
            ids.push(other_person_id);

            var user_type = (key.fromId == req.body._id) ? key.toType : key.fromType ;

            var table = (user_type == 'player') ? Player : User

            console.log('user_type', user_type);


              table.findOne({_id: other_person_id}, function(err, user){

                chat.count({toId:req.body._id, fromId: user._id, readIds:{$in: my_id}}, function(err, unread){

                  var dist = {
                    pic: user.pic,
                    name : user.fname[0].toUpperCase()+user.fname.slice(1)+ ' '+user.lname[0].toUpperCase()+user.lname.slice(1),
                    createdAt : key.createdAt,
                    message : key.message,
                    _id : user._id,
                    isRead : key.isRead,
                    user_type : errors.indexOf(user.position)==-1 ? 'player' : 'owner',
                    unread: unread,
                    is_group: 0
                    }      
                    data.push(dist);      
                    i++;      
                    if(i == messages.length){
                      groupChat(data)    
                    }
                    })         

                  })

                }else{


                  i++;

              if(i == messages.length){
                groupChat(data)

              }
                }   

              }
     

      }else{
        groupChat(data)
      }
  
   });


   function groupChat(data){
       
    chat.find({$or:[{toId: {$in: my_id}}, {fromId: req.body._id}], is_group: '1',  deleted: {$nin: my_id}}, null,{sort: {'createdAt': -1}}, function(err, messages){
  
      if(messages.length!=0){
 
               var ids = [];
               var i = 0;
 
           for(let key of messages){
 
             if(ids.indexOf(key.team_id)==-1){
             
             ids.push(key.team_id);
               team.findOne({_id: key.team_id}, function(err, user){
 
                 chat.count({toId: {$in: my_id}, team_id: key.team_id,  readIds:{$in: my_id}}, function(err, unread){
 
                   var dist = {
                     pic: errors.indexOf(user.cover)==-1 ? user.cover : '',
                     name : user.name,
                     createdAt : key.createdAt,
                     message : key.message,
                     _id : key.team_id,
                     isRead : key.isRead,
                     user_type : 'player',
                     unread: unread,
                     is_group: 1
                     }      
                     data.push(dist);      
                     i++;      
                     if(i == messages.length){
                         res.send({
                           status: 1,
                           data: arraySort(data, 'createdAt', {reverse: true})
                         });      
                     }
                     })         
 
                   })
 
                 }else{

                   i++;
 
               if(i == messages.length){
                   res.send({
                     status: 1,
                     data: arraySort(data, 'created_at', {reverse: true})
                   });
 
               }
                 }   
 
               }
      
 
       }else{
        res.send({
          status: 1,
          data: arraySort(data, 'created_at', {reverse: true})
        });
       }
   
    });
   }
}


//get all unread messsages to show on badges 
exports.get_unread_messages = function(req, res){
  var myId = [req.body._id]
  chat.find({toId: req.body._id, readIds:{$in:myId} }, function(err, unread) {
    console.log(unread)
    if(unread.length!=0){
      res.json({
        status : 1,
        data : unread.length
      })
    }
    else{
      res.json({
        status : 0,
        data : null
      })
    }
  });
};

//get all unread messsages to show on badges 
exports.get_untouched_confirmations =async function(req, res){

  var confirmationsData = await Confirmation.count({player_id : req.body._id,status:0});
  res.json({
    status : 1,
    data :confirmationsData
  })
};


//get all unread messsages to show on badges 
exports.get_unread_notifications =async function(req, res){
  var ids = [req.body._id]
  var confirmationsData = await Notifications.count({ toId : { $in: ids}, isNewEntry : '1'});
  res.json({
    status : 1,
    data :confirmationsData
  })
};

//get all unread messsages to show on badges 
exports.read_unread_notifications =async function(req, res){
  var ids = [req.body._id]
 Notifications.updateMany({ toId : { $in: ids}}, {$set: {isNewEntry: '0'}}, {new:true}, function(err, output){

  console.log(err, output)
  res.json({
    status : 1
  })
 });

};


//get all unread invitations to show on badges 
exports.get_untouched_invitations= async function(req, res){
 
  var confirmationsData = await teamInvitation.count({ player_id : req.body._id, read : '0'});
  res.json({
    status : 1,
    data :confirmationsData
  })
};

//get all unread invitations to show on badges 
exports.read_unread_invitations = async function(req, res){
 
  teamInvitation.updateMany({ player_id : req.body._id}, {$set: {read: '1'}}, {new:true}, function(err, output){

  console.log(err, output)
  res.json({
    status : 1
  })
 });

};



  
exports.saveCard = async function(req, res){

var user = await Player.findOne({_id: req.body._id})
var doesExist = await SavedCard.findOne({matchId: req.body.matchId, userID: req.body._id})


if(doesExist!=null){

  res.send({
    status: 1,
  });

}else{

  const customer = await stripe.customers.create({
    source: req.body.token,
    email: user.email,
  });


  if(errors.indexOf(customer.id)==-1){

    var data = {
    userID: req.body._id,
    matchId: req.body.matchId,
    customerId: customer.id,
    sourceId: customer.default_source,
    amount: req.body.amount,
    }

  var newData = new SavedCard(data);
   newData.save(function(err, cardSaved){

    if(cardSaved!=null){

      res.send({
        status: 1,
      });

    }else{
      res.send({
        status: 0,
      });

    }

   });
   

  }else{

     res.send({
          status: 0,
        });

  }

}



 
  
};


exports.saveCardForOutsider = async function(req, res){

  var user = await Player.findOne({_id: req.body._id})
  
    const customer = await stripe.customers.create({
      source: req.body.token,
      email: user.email,
    });
  
  
    if(errors.indexOf(customer.id)==-1){
  
      var data = {
      userID: req.body._id,
      matchId: req.body.matchId,
      customerId: customer.id,
      sourceId: customer.default_source,
      amount: req.body.amount
      }
  
     var newData = new SavedCard(data);
     newData.save(function(err, cardSaved){
  
      if(cardSaved!=null){
  
        res.send({
          status: 1,
        });
  
      }else{
        res.send({
          status: 0,
        });
  
      }
  
     });
     
  
    }else{
  
       res.send({
            status: 0,
          });
  
    } 
  };



/////////////////////////////common///////////

function add_notification(fromId,toId,type,data_params){

        console.log('add_notificationadd_notificationadd_notification',{
          fromId : fromId,
          toId : toId,
          type : type,
          data_params : data_params,
          isRead : '0', 
        });

        var new_notis = new Notifications({
          fromId : fromId,
          toId : toId,
          type : type,
          data_params : data_params,
          isRead : '0', 
        });

        new_notis.save({}, function(res, err){
          console.log('add notification error', err);
        });
} 


async function sendpush(to, title, body, type) {

  const OneSignal = require('onesignal-node');    

  const client = new OneSignal.Client('92262208-ae94-498c-8262-79d7dd1fed54', 'Mjk0NDMwMGYtMDU5NC00YzM0LTljNDYtNzUwN2EyZDI0YjAy');

  if(type==1){

      const notification = {
              
          contents: {
            'tr': 'Yeni bildirim',
            'en': body,
            'sound': 'police',
            "android_sound": "police",
          },
          icon:'screen',
          "android_sound": "police",
           sound: 'police',
           android_channel_id: 'd7e1951a-5b02-4589-b858-05e60f404dd8',
           channel_id: 'd7e1951a-5b02-4589-b858-05e60f404dd8',
           include_android_reg_ids: [to]
        };
         
        try {
          const response = await client.createNotification(notification);
          console.log(response.body.id);
        } catch (e) {
          if (e instanceof OneSignal.HTTPError) {
           
            console.log(e.statusCode);
            console.log(e.body);
          }
        }

  }else{

      for(let key of to){

          const notification = {
              
              contents: {
                'tr': 'Yeni bildirim',
                'en': body,
                'sound': 'police',
                "android_sound": "police",
              },
              icon:'screen',
              "android_sound": "police",
               sound: 'police',
               android_channel_id: 'd7e1951a-5b02-4589-b858-05e60f404dd8',
               channel_id: 'd7e1951a-5b02-4589-b858-05e60f404dd8',
               include_android_reg_ids: [key]
            };
             
            try {
              const response = await client.createNotification(notification);
              console.log(response.body.id);
            } catch (e) {
              if (e instanceof OneSignal.HTTPError) {
               
                console.log(e.statusCode);
                console.log(e.body);
              }
            }

      }

  }
       
}



 async function fcmToOwner(msg, uid)  {
 
const OneSignal = require('onesignal-node');    

const client = new OneSignal.Client('329fab3a-9670-4eb3-8829-b29efb5df076', 'ODJhZDFiOTctNzkwNi00Yzc4LTllMTktYjNlNTc2YzFjZjUz');

const notification = {
  
  contents: {
    'tr': 'Yeni bildirim',
    'en': msg,
    'sound': 'police',
    "android_sound": "police",
  },
  icon:'screen',
  "android_sound": "police",
   sound: 'police',
   android_channel_id: '9cea4ad8-790f-4cb7-b3cd-42f7e8b2657a',
   channel_id: '9cea4ad8-790f-4cb7-b3cd-42f7e8b2657a',
   include_android_reg_ids: [uid]

};
 

try {
  const response = await client.createNotification(notification);
 
  
} catch (e) {
  if (e instanceof OneSignal.HTTPError) {
   
 
    console.log('error');
  
  }
}
}


function convert24to12(time){
  var  dt = time
  var hours = dt.split(':')[0]
  var AmOrPm = hours >= 12 ? 'pm' : 'am';
  hours = (hours % 12) || 12;
  var minutes = dt.split(':')[1]
  var finalTime = hours + ":" + minutes + " " + AmOrPm; 
  return finalTime  
}


function calcRemainingTodayMatchTime(matchDate, start_day){


  var d = new Date();
  var date = d.getDate();
  var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  var year = d.getFullYear();
  if (date < 10) {
      date = '0' + date;
  }
  if (month < 10) {
      month = '0' + month;
  }

  var hours = d.getHours();
  var mins = d.getMinutes();

  if (hours < 10) {
      hours = '0' + hours;
  }
  if (mins < 10) {
      mins = '0' + mins;
  }

  var stime = hours + ':' + mins;
  var dateStr = year + "-" + month + "-" + date;

  if(dateStr == matchDate){


    var current_time = stime+':'+'00'
 
  
    var match_time = start_day.split(' ')[1]
   
 
   
    var time_start = new Date();
  
    var time_end = new Date();
  
    var value_start = current_time.split(':');
  
    var value_end = match_time.split(':');
  
   
  
    time_start.setHours(value_start[0], value_start[1], value_start[2], 0)
  
    time_end.setHours(value_end[0], value_end[1], value_end[2], 0)
  
    var diff = time_end - time_start


                  if ((diff/60000) <= 60) {

                    return 1;

                  }else{

                    return 0;
                  }

                }else{


                  return 0;

                }
              

          }