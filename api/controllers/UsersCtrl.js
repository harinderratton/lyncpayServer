'use strict';

var mongoose = require('mongoose'),
//fcm
FCM = require('fcm-node'),

serverKey = 'AAAAD0hVUcY:APA91bG9dFjq_5yMB5ffOBUce0doghBnnpE9ngkSMtw2IDUb5X4uT8MIN-pYT5Jyndp_KZg7hNyuVDSHwSjPkG49irn5V3J96_dHssFoo_1O7NZxPgEqcwTdNLhju1J_ST67Md9Y9b6k',

fcm = new FCM(serverKey),
//fcm
arraySort = require('array-sort'),
errors= ['', null, undefined,' null', 'undefined', 0],
User = mongoose.model('User'),
Otp =  mongoose.model('Otp'),
Player =  mongoose.model('Player'),
SparePlayers =  mongoose.model('SparePlayers'),
bookingPayment = mongoose.model('bookingPayment'),
paymentToOwner = mongoose.model('paymentToOwner'),
refunds_to_player = mongoose.model('refunds_to_player'),
Notifications = mongoose.model('Notifications'),
requestFieldPayments = mongoose.model('requestFieldPayments'),
Followers = mongoose.model('Followers'),
MatchResults = mongoose.model('MatchResults'),
InvitedPlayers = mongoose.model('invitedPlayers'),
RequestField = mongoose.model('RequestField'),
path = require('path'),
Joinmatch = mongoose.model('Joinmatch'),
NodeGeocoder = require('node-geocoder'),
Match = mongoose.model('Match'),
team = mongoose.model('team'),
fs = require('fs');
var sg = require('sendgrid')('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');
//----hashing password
var passwordHash = require('password-hash');
//----
var otpGenerator = require('otp-generator');
var multer  = require('multer');
var stripe = require('stripe')('sk_test_oDnJiczBF5W5NtF4gphJ2YPT00A5wasqym');
//address controller start here
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/pic/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

//user signup


exports.add_user =async function(req, res)  {
  
console.log(req.body.uid);
  if(errors.indexOf(req.body.uid)==-1){

      await User.update({uid:req.body.uid},{$set:{uid:0}},{new:true});

  }
  //status 5 is for pending confirmation
      const data= {
      matchFees: req.body.matchFees,
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.pnumber,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      uid:req.body.uid,
      status:5,
      state: req.body.state,
      matchFees: req.body.matchFees
    }
 

  //check email availability
    User.findOne({email: req.body.email}, function(err, user) {
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
         var new_user = new User(data);
              new_user.save(function(err, user) {
              if (user == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              }else{
                sendEmail(user)
              
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
                "OTP": 'http://centercircleapp.com:3002/confirmEmail/'+user._id,
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



exports.add_Spare =async function(req, res)  {
  
        const data= {
        ownerId:  req.body.ownerId,
        fname: req.body.fname,
        lname: req.body.lname,
        status: 1,
  
      }
   
    //check email availability
    SparePlayers.find({ownerId: req.body.ownerId, status: 1}, function(err, user) {
        if(user.length >= 3){
            res.send({
            status: 5,
            data: null
      });
        }else{
          savenewuser();
        }
       
      });    
  
        function savenewuser(){
           var new_user = new SparePlayers(data);
                new_user.save(function(err, user) {
                if (user == null){
                   res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0,
                    data: null
                  });
                }else{
                  res.send({
                    status: 1
                    });
                }
                });
              }
  
  };

  exports.get_Spares =async function(req, res)  {
  
    SparePlayers.find({ownerId:  req.body.ownerId, status: 1}, function(err, response){

      res.send({
        status: 1,
        data: response
        });
  
    })

};


exports.remove_Spare = async function(req, res)  {
  
  SparePlayers.update({_id:  req.body._id}, {status: 0}, {new: true}, function(err, response){

    res.send({
      status: 1,
      data: response
      });

  })

};

exports.facilityLogout= function(req, res){
          User.update({_id:req.body._id}, {$set: {uid:''}},function(err, user){
       
          if(user!=null){
            res.send({
              status: 1
              });
          
          }else{
            res.send({
              status: 0
              });
          }


          });


          }

    exports.playerLogout= function(req, res){
      Player.update({_id:req.body._id}, {$set: {uid:''}},function(err, user){
         
            if(user!=null){
              res.send({
                status: 1
                });
            
            }else{
              res.send({
                status: 0
                });
            }

            });
            }



exports.confirmEmail= function(req, res){
  console.log(req.params._id);
          User.update({_id:req.params._id},{$set:{status:1}},{new:true},function(err, user){
       
          if(user!=null){
            
            res.sendFile(path.join(__dirname, '../templates') + '/confirmed.html', 'utf8'); 
          }


          });


          }

//user login

exports.user_login = function(req, res) { 

  console.log(req.body.uid);
    User.findOne({email: req.body.email}, function(err, user) {
      if(user==null){
          res.send({  
          msg: 'Account does not exist',
          status: 2,
          data: null
    });
      }else{

  //check password
      if(passwordHash.verify(req.body.password,user.password)){

          if(errors.indexOf(req.body.uid)==-1){
          
           User.update({uid:req.body.uid},{$set:{uid:0}},{new:true},function(err, tokenUpdate){
                  console.log(tokenUpdate);
     
                 User.update({_id:user._id},{$set:{uid:req.body.uid}},{new:true},function(err, tokenUpdate){
             
           console.log(tokenUpdate);

                }); 
          

           });    
           }   
           
           if(user.status==5){
            res.send({
              msg: 'Your email verification is pending',
              status: 5,
              data: user
           });

           }else if(user.status==1){

            res.send({
              msg: 'Logged in',
              status: 1,
              data: user
           });

           }
                 
            

      }else{
         res.send({
                msg: 'Wrong credentials',
                status: 0,
                data: null
             });
      }

  //check password       
      }
     
    });     

};

exports.getAddresses = function(req, res) {
  Address.find({userId : req.params.userId }, function(err, addresses) {
       res.json(addresses); 
  });
};

exports.getDefaultAddress = function(req, res) {
  Address.findOne({userId : req.params.userId, is_default : '1' }, function(err, address) {
       res.json(address); 
  });
};

exports.delete_address = function(req, res) {
  Address.remove({_id : req.body.id}, function(err, task) {
     if (task == null){
       res.send({
        error: err,
        status: 0,
        data: null
      });
    }else{
      res.send({
        error: null,
        status: 1,
        data: task
      });
    }
    
  });
};


exports.getotp =function(req, res){
      User.findOne({email: req.body.email, status:1}, function(err, user) {
      if(user==null){
          res.send({
          msg: 'We did not find any account associated with this email',
          status: 0,
          data: null
    });
      }else{
         generateOtp(req.body.email);        
      }
    });
  


        function generateOtp(email){
    var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
        var new_otp = new Otp({email:email,otp:OTP,type:1});
       new_otp.save(function(err, otp) {
              if (otp == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 3,
                  data: null
                });
              }else{
                  sendotp(otp);              
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
                    "OTP": otp.otp
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
}

exports.resetpassword =function(req, res){
        console.log(req.body.npassword);
			Otp.findOne({email:req.body.email,type:1}, null, {sort:{'_id': -1}}, function(err, user) {
          console.log('otp'+user);
              
			     if(user==null){
			      res.send({
			        msg: 'Internal Server Error, Try again',
			        status: 0,
			        data: null
			      });
			    }else{             
             confirmOtp(req.body.otp,user.otp);			    }

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
         User.update({ email: req.body.email}, { $set: { password : passwordHash.generate(req.body.npassword) }}, {new: true}, function(err, user) {
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


exports.updateinfo = function(req, res) { 
   
  var upload = multer({ storage: storage }).single('file');
  upload(req,res,function(err){
      
      var querydata = {
              matchFees: req.body.matchFees,
              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              email: req.body.email,
              state: req.body.state,
              city: req.body.city,
              country: req.body.country,
              zip: req.body.zip,
          }
            if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }
                User.findOne({email:req.body.email, "_id": { $ne: req.body._id}}, function(err, user) {   

               if(user==null){
        User.update({_id: req.body._id},{$set:querydata},{new:true}, function(err, user) {
               
                 if(user==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0}); 
                 }else{

                      User.findOne({_id:req.body._id}, function(err, user) { 
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

               }else{

                res.send({
                    msg: 'Email already exists, Try another',
                    status: 3,
                    data: null
                });



               }





                 });


      
                                   
  });



  }

  exports.updatepassword =function(req, res){


        User.findOne({_id:req.body._id}, function(err, user) {
                      
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


      
      function chnagepass(){  User.update({_id: req.body._id},{$set:{'password':passwordHash.generate(req.body.npassword)}},{new:true}, function(err, user) {
      
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


  exports.getFieldRequests = function(req, res) {
  RequestField.find({status:1,owner_id : req.body._id}, function(err, task) {
     if (task.length==0){
          res.send({
            msg: 'no data',
            status: 0,
            data:null      
          }); 
    }else{
          var newarray=[];
          var i=0;
          for(let key of task){
            Player.findOne({_id : key.player_id}, function(err, player) {
            var dict={
             request:key,
             player:player
            }
            newarray.push(dict);
            // task[i]['status']= player;
            i++;
            if(i==task.length){

                  res.send({
                  msg: 'requests',
                  status: 1,
                  data:newarray
                  }); 

            }

            });


          }
      
    }
    
  });
};


  exports.actionOnFieldReq = async function(req, res) {

 //status 1 for pending, 2 for accepted, 3 for canceled

    if(req.body.status==1){

console.log(req.body);
          RequestField.update({_id:req.body.rId}, { $set: { status : 2 }}, {new: true}, function(err, user) {
             if(user==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: user
                  });
          
             }else{
              res.send({
              msg: 'accepted',
              status: 1,
              data: user
              });
            }

         });
    }else if(req.body.status==0){ 

  
        RequestField.update({_id:req.body.rId}, { $set: { status : 3 }}, {new: true}, function(err, user) {
           if(user==null){
                res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: user
                });          
           }else{
                         
                  Player.findOne({_id:req.body.player_id},function(err, player_token){
                  if(player_token!=null){                                  

                  User.findOne({_id:req.body.owner_id},function(err,admin_details){
                  var owner_name= admin_details.fname;
                   //decline push

                   if(errors.indexOf(player_token.uid)==-1){
                            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                              to: player_token.uid, 
                              collapse_key: 'your_collapse_key',
                              
                              notification: {
                                  title: 'Field request declined', 
                                  body: 'Your field request is declined by '+owner_name.charAt(0).toUpperCase() + owner_name.slice(1)
                              },      
                             
                          };
                          
                          fcm.send(message, function(err, response){
                            console.log(err);
                              if (err) {
                                  console.log("Something has gone wrong!");
                              } else {
                                  console.log("Successfully sent with response: ", response);
                              }
                            });       

                         }
                         });
                        }

                     });           

                 //fcm

            res.send({
            msg: 'Rejected',
            status: 1,
            data: user
            });
          }

       });
      
        
    }
 
};


exports.searchhome = function(req, res){

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
              // , $and:[{date:{$gte:dateStr}}]



             Match.find({ 

               $and : [
                   {$or: [ {name : { $regex: req.body.keyword, $options: 'i' }}, { location: { $regex: req.body.keyword, $options: 'i' } }, { date: { $regex: req.body.keyword, $options: 'i' } } ]},
                   {date : {$gte : dateStr}}
               ]
               
},function(err, match) {           

              if(match.length==0){
              res.send({
              msg: 'no data',  
              status: 0,
              data: null
              });
              }else{             
 
                var myupmatches=[];
                var cont=0;
                    for(let key of match){               

                    Joinmatch.findOne({match_id:key._id}, function(err, result) { 
                      
                        if(result!=null)  match[cont]['status']= result.player_id.length;
                            else match[cont]['status']= 0;               
                          
                            cont++;
                            
                            if(cont==match.length){
                                console.log(myupmatches);
                                res.send({
                                msg: 'search',
                                status: 1,
                                data:match
                                }); 
                            }    

                   }); 

               } 


          
             }

        });            

}

exports.getnearbyUsers = async function(req, res){

   var owner_ids = await Followers.findOne({owner_id: req.body._id});

   if(owner_ids!=null){

       if(owner_ids.player_id.length!=0){

        Player.find({_id: {$in:owner_ids.player_id}
         },function(err, users) {  
           
  
                    if(users.length==0){
                      res.send({
                      msg: 'no nearby users',
                      status: 0,
                      data: []
                      });
              
                  }else{
                  res.send({
                  msg: 'users list',
                  status: 1,
                  data: users
                  });
                }

             }
            ); 
       }else{
        res.send({
          msg: 'no nearby users',
          status: 0,
          data: []
          });


       }



   }else{
    res.send({
      msg: 'no nearby users',
      status: 0,
      data: []
      });


   }
    
}



//user signup
exports.addMatchResults = async function(req, res) {

      var resultsExists= await MatchResults.findOne({match_id:req.body.match_id});

    


      const data= {  

        match_id: req.body.match_id,
        name: req.body.name,
        location: req.body.location,
        team1_score: req.body.team1_score,
        team2_score: req.body.team2_score,
        positions_team1: req.body.positions_team1,
        positions_team2: req.body.positions_team2,
        shots_ontarget_team1: req.body.shots_ontarget_team1,
        shots_ontarget_team2: req.body.shots_ontarget_team2,
        touches_team1: req.body.touches_team1,
        touches_team2: req.body.touches_team2,
        shots_team1: req.body.shots_team1,
        shots_team2: req.body.shots_team2,
    }

    var newMatchResults = new MatchResults(data);


      if(resultsExists!=null){

        const updateData = {        
        name: req.body.name,
        location: req.body.location,
        team1_score: req.body.team1_score,
        team2_score: req.body.team2_score,
        positions_team1: req.body.positions_team1,
        positions_team2: req.body.positions_team2,
        shots_ontarget_team1: req.body.shots_ontarget_team1,
        shots_ontarget_team2: req.body.shots_ontarget_team2,
        touches_team1: req.body.touches_team1,
        touches_team2: req.body.touches_team2,
        shots_team1: req.body.shots_team1,
        shots_team2: req.body.shots_team2,
    }
    
      MatchResults.update({match_id:req.body.match_id},{$set:updateData},{new:true},function(err, result) {
        if (result == null){
          res.send({
          msg: 'Internal Server Error, Try again',
          status: 0,
          data: null
          });
            }else{
        res.send({
          msg: 'match result',
          status: 1,
          data: result
          });
          }
        });

      }
      else{
              newMatchResults.save(function(err, result) {
                if (result == null){
                 res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                 });
                   }else{
                res.send({
                  msg: 'match result',
                  status: 1,
                  data: result
                  });
                 }
               });
            }
};

exports.getaAllPlayers = async  function(req, res){
       var followersArray = []
       var followers = await Followers.findOne({owner_id: req.body.ownerId});
       
       if(followers!=null){

        if(followers.player_id.length!=0){

          followersArray =  followers.player_id

          var InvitedPlayer =  await InvitedPlayers.find({match_id:req.body._id}); 

          var InvitedPlayersIds=[];
          for(let key of InvitedPlayer){
              InvitedPlayersIds.push(key.player_id);
          }
   
         var alreadyJoined = await  Joinmatch.findOne({match_id:req.body._id}); 
   
         var ids=[];    
         if(alreadyJoined!=null){
          ids = alreadyJoined.player_id
         }


         var finalIds = [];
         var count = 0;

         for(let key1 of followers.player_id){

          if(ids.indexOf(key1)==-1){
            finalIds.push(key1)
          }

          count++

          if(count == followers.player_id.length){

            Player.find({$and:[{"_id": { "$in": finalIds }}, {"_id":{ "$nin":InvitedPlayersIds}}]} ,function(err, users) {             
    
              if(users.length==0){
                 res.send({
              
                 status: 0,
                
                 });
         
            }else{
             res.send({
             msg: 'users list',
             status: 1,
             data: users
             });
           }

           }
          );

          }

         }
   
        
        }else{

          res.send({
            status: 0,
            });

        }

       }else{

        res.send({
          status: 0,
          });

       } 
}

exports.sendInvite = async  function(req, res){
             
      var joined = await Match.findOne({_id: req.body._id});
      var date =  new Date();
      var currentTime =  date.getTime();

      var matchDate = new Date(joined.date+' '+joined.stime );

      var matchTime  = matchDate.getTime();

      if(currentTime <  matchTime){
        var owner_details= await User.findOne({_id:req.body.owner_id}); 
        var i=0;
        for(let key of req.body.player_ids){


          var data= {
                match_id:req.body._id,
                player_id:key                     
          }
          var newInvitation= new InvitedPlayers(data);
          newInvitation.save(function(err,invitationSent){
            console.log(invitationSent);
            console.log(err);
            if(invitationSent!=null){
                console.log('1');
                Player.findOne({_id:key},function(err, udid){
                    if(errors.indexOf(udid.uid)==-1){
                      var body = 'You got an inviation for a match by facility';
                      sendpush(udid.uid, body);

                    }
                     

                });
               
            }

        i++
        if(i==req.body.player_ids.length){

              var toId= req.body.player_ids;
              var fromId= req.body.owner_id;
              var params= {match_id:req.body._id}

              add_notification(fromId,toId,6,params);
                        res.send({
                          msg: 'Invitation has been sent',
                          status: 1                       
                          });
                        }
                       }); 
                     } 
                }else{

                  res.send({                  
                    status: 3                      
                    });
               }

  
           
}

exports.getResults = async  function(req, res){

              MatchResults.findOne({match_id:req.body._id},function(err,results){

            
              if(results!=null){
                      res.send({
                                msg: 'Invitation has been sent',
                                status: 1,
                                data:results                             
                                });

                               }else{

                                      res.send({
                                msg: 'No results yet',
                                status: 0,
                             
                                });

                               }
              


               });  
           
}


exports.searchplayerforInvitation = async  function(req, res){

       var InvitedPlayer =  await InvitedPlayers.find({match_id:req.body._id}); 

       var InvitedPlayersIds=[];
       for(let key of InvitedPlayer){

           InvitedPlayersIds.push(key.player_id);
       }

      var alreadyJoined= await  Joinmatch.findOne({match_id:req.body._id}); 
      var ids=[];    
      if(alreadyJoined!=null){
       ids=alreadyJoined.player_id
      }
   
      Player.find({
        $and:[
        { "_id": { "$nin": ids },"_id":{ "$nin":InvitedPlayersIds} },
        { $or:[
          {fname : { $regex: req.body.keyword, $options: 'i' }},
          {lname : { $regex: req.body.keyword, $options: 'i' }},
          {city : { $regex: req.body.keyword, $options: 'i' }},
          {position : { $regex: req.body.keyword, $options: 'i' }}
          ]
        }

        ]

    } ,function(err, users) {             
 
                     if(users.length==0){
                        res.send({
                        msg: 'no nearby users',
                        status: 0                    
                        });
                
                   }else{
                    res.send({
                    msg: 'users list',
                    status: 1,
                    data: users
                    });
                  }

                  }
                 );
           
}

  exports.cancelMatch = async (req, res) => {

     Match.update({_id:req.body.match_id},{$set:{status:2}},{new: true},function(err,updated){

            if(updated!=null){
                      res.send({
                      status:1,
                      msg:'Match has been canceled',
                      data:updated      
                      });

            }else{
                    res.send({
                    status:0,
                    msg: 'Internal Server Error, Try again',

                      });
               } 
            });
           }


    exports.get_owner_notifications = async function(req, res) {

      var ids = [req.body._id];

        const notifQuery =  await Notifications.find({toId : { $in: ids}, isRead:0},null, {$sort:{createdAt:-1}});

      if(notifQuery.length==0){

              res.send({
                          status:0,
                          msg: 'No notifications',
                          });

              
       }else{

        var notifications_array=[];
  
        var i=0;
     for(let key of notifQuery){

      if(key.type==2){      
       var joinedplayersQuery= await Player.findOne({_id :key.fromId});
     
         var joinmatchDist= await {
            noti_id: String(key._id),  
            fname: joinedplayersQuery.fname,
            lname:joinedplayersQuery.lname,
            pic:joinedplayersQuery.pic,
            _id:key.data_params.match_id,
            type: 2,
            createdAt : key.createdAt
       }

       notifications_array.push(joinmatchDist);

      }

      if(key.type==212){  

        
        var joinedplayersQuery= await Player.findOne({_id : key.fromId});
      
          var joinmatchDist= await {
             noti_id: String(key._id),  
             fname: joinedplayersQuery!=null ? joinedplayersQuery.fname : 'A',
             lname: joinedplayersQuery!=null ? joinedplayersQuery.lname : 'User',
             pic: joinedplayersQuery!=null ? joinedplayersQuery.pic : null,
             _id:key.data_params.match_id,
             type: 212,
             createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }

       if(key.type==213){  

        
        var joinedplayersQuery= await Player.findOne({_id : key.fromId});
      
          var joinmatchDist= await {
             noti_id: String(key._id),  
             fname: joinedplayersQuery!=null ? joinedplayersQuery.fname : 'demo',
             lname: joinedplayersQuery!=null ? joinedplayersQuery.lname : 'demo',
             pic: joinedplayersQuery!=null ? joinedplayersQuery.pic : null,
             _id:key.data_params.match_id,
             type: 213,
             createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }

       if(key.type==214){  

        
        var joinedplayersQuery= await Player.findOne({_id : key.fromId});
      
          var joinmatchDist= await {
             noti_id: String(key._id),  
             fname: joinedplayersQuery!=null ? joinedplayersQuery.fname : 'demo',
             lname: joinedplayersQuery!=null ? joinedplayersQuery.lname : 'demo',
             pic: joinedplayersQuery!=null ? joinedplayersQuery.pic : null,
             _id:key.data_params.match_id,
             type: 214,
             createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }


      if(key.type==55){  

        var leave_matchQyery = await team.findOne({_id : key.data_params.team_id});
      
          var leave_matchDist= await {

                noti_id: String(key._id),  
                pic: leave_matchQyery.cover,
                name: leave_matchQyery.name,
                matchId: key.data_params.match_id,
                type: 55,
                createdAt : key.createdAt
        }

        notifications_array.push(leave_matchDist);

    }


      if(key.type==13){      
        var joinedplayersQuery= await Player.findOne({_id :key.fromId});
      
          var joinmatchDist= await {
        noti_id: String(key._id),  
        fname: joinedplayersQuery.fname,
        lname:joinedplayersQuery.lname,
        pic:joinedplayersQuery.pic,
        _id:key.data_params.match_id,
        type: 13,
        coming_status: key.data_params.coming_status,
        createdAt : key.createdAt
        }
 
        notifications_array.push(joinmatchDist);
 
       }

          if(key.type==3){      
       var field_requestsQuery= await Player.findOne({_id :key.fromId});
 
         var field_requestsDist= await {
            noti_id: String(key._id),  
       fname: field_requestsQuery.fname,
       lname:field_requestsQuery.lname,
       pic:field_requestsQuery.pic,
       _id:key.data_params.field_id,
       type: 3,
       createdAt :key.createdAt
       }

       notifications_array.push(field_requestsDist);

      }



              if(key.type==5){      
       var leave_matchQyery= await Player.findOne({_id :key.fromId});
     
         var leave_matchDist= await {
            noti_id: String(key._id),  
       fname: leave_matchQyery.fname,
       lname:leave_matchQyery.lname,
       pic:leave_matchQyery.pic,
       _id:key.data_params.match_id,
        type: 5,
        createdAt : key.createdAt
       }

       notifications_array.push(leave_matchDist);

      }




         if(key.type==7){

               var joined_matchDist= { 
              noti_id: String(key._id),  
              fname: '',
              lname:'',           
              _id:key.data_params.match_id,
              type: 7,
              amount:key.data_params.amount,
              createdAt : key.createdAt
            }      
      
     var matchQyery= await Match.findOne({_id :key.data_params.match_id});
     if(matchQyery!=null){

         joined_matchDist['pic']= matchQyery.cover
     }

      notifications_array.push(joined_matchDist);
    
    
       }

      




      i++;
      if(i==notifQuery.length){       

                  res.send({
                    status:1,
                    msg: 'Owner notifications',
                    data:  arraySort(notifications_array, 'createdAt', {reverse: true})  


                    });
                  }
                }      
             }
            }


  exports.clear_owner_notifications = async function(req, res) {
    
    
      Notifications.update({_id:req.body._id},{$set:{isRead:1}},{new: true},function(err, match) {



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

 exports.stripe_redirect = function(req, res) {   
       var id = req.query.state.split('__')[0]
       var type = req.query.state.split('__')[1]
 
        if(errors.indexOf(req.query.code)==-1){

              stripe.oauth.token({
                grant_type: 'authorization_code',
                code: req.query.code,
              }).then(function(response) {
               if(errors.indexOf(response.stripe_user_id)){

                if(type==1){
                  Player.update({_id: id},{$set:{stripe_id:'acct_1Gi1SKLVX3UJ8e1l'}},{new: true},function(err, user) {
 
                    if(user!=null){
                     res.sendFile(path.join(__dirname, '../templates') + '/stripeSuccess.html', 'utf8');            
 
                   }else{
 
                    res.send({
                       status:0,
                        msg: 'Internal Server Error, Try again',
                          });
                         }                     
                      });

                }else{
                  User.update({_id: id},{$set:{stripe_id:'acct_1Gi1SKLVX3UJ8e1l'}},{new: true},function(err, user) {
 
                    if(user!=null){
                     res.sendFile(path.join(__dirname, '../templates') + '/stripeSuccess.html', 'utf8');            
 
                   }else{
 
                    res.send({
                       status:0,
                        msg: 'Internal Server Error, Try again',
                          });
                         }                     
                      });


                }
              
               }
               


              });


        }

        return;



 
              

                   }  


 exports.get_profile = function(req, res) {       
 
               User.findOne({_id:req.body._id},function(err, user) {

                   if(user!=null){
                  console.log(user);
                  res.send({
                    status:1,
                    msg: 'User Profile',                  
                    data:user
                    });

                  }else{

                   res.send({
                      status:0,
                       msg: 'Internal Server Error, Try again',
                         });

                  }
 
       });


      } 


 exports.get_owner_transaction = async function(req, res) {       
 
               paymentToOwner.find({owner_id:req.body._id},null,{sort:{createdAt:-1}},function(err, user) {

                   if(user!=null){

                    var cont = 0
                    var list = [];
                    for(let x of user){
                     
                    Match.findOne({_id: (x.matchId!=null || x.matchId!=undefined) ? x.matchId : x._id}, function(err, matchDetails){

                      let dict = {
                        amount: Number(x.amount),
                        createdAt: x.createdAt,
                        owner_id: x.owner_id,
                        payId: x.payId,
                        player_id: x.player_id,
                        transaction_id: x.transaction_id,
                        type: x.type,
                        updatedAt: x.updatedAt,
                        _id: x._id,
                        matchTime: matchDetails!=null ? matchDetails.stime : null,
                        matchDate: matchDetails!=null ? matchDetails.date : null
                  }

                  list.push(dict);
                  cont++;

                  if(cont == user.length){

                    res.send({
                      status:1,
                      msg: 'User Profile',                  
                      data: arraySort(list, 'createdAt', {reverse: true})
                      });

                  }
                      
                    });  


                    }


                  }else{

                   res.send({
                      status:0,
                       msg: 'Internal Server Error, Try again',
                         });

                  }
 
       });


      } 

      // get players to be shown in add match 

      
      exports.getPlayersForAddMatch = function(req, res){

        var ids= [];
       if(req.body.ids.length!=0){

        ids= JSON.parse(req.body.ids); 

       }

       
        Player.find({status:1, _id: {$nin: ids }},function(err, users) { 
              
                if(users.length==0){
                   res.send({
                   msg: 'no players',
                   status: 0,
                   data: []
                   });
           
              }else{
               res.send({
               msg: 'players list',
               status: 1,
               data: users
               });
             }

             });
         
     }


     exports.getPlayersForAddMatchNew = async function(req, res){


      var followers = await Followers.findOne({owner_id: req.body._id});
      var ids= [];
      if(followers!=null){
        if(followers.player_id.length!=0){

          if(req.body.ids.length!=0){

            ids= JSON.parse(req.body.ids); 

            Player.find({status:1, _id: {$nin: ids, $in: followers.player_id }},function(err, users) { 
            
              if(users.length==0){
                 res.send({
                 msg: 'no players',
                 status: 0,
                 data: []
                 });
         
            }else{
             res.send({
             msg: 'players list',
             status: 1,
             data: users
             });
           }

           });
      
           }else{


            Player.find({status:1, _id: {$in: followers.player_id }},function(err, users) { 
            
              if(users.length==0){
                 res.send({
                 msg: 'no players',
                 status: 0,
                 data: []
                 });
         
            }else{
             res.send({
             msg: 'players list',
             status: 1,
             data: users
             });
           }

           });


           }




         
        }else{
          res.send({
            status: 0,
            });
        }

      }else{
        res.send({
          status: 0,
          });
      }

      
   }


      // get teams to be shown in add match 


      exports.getTeamsForAddMatch = function(req, res){

        team.find({_id:{$ne: errors.indexOf(req.body.id)==-1 ? req.body.id : null}},function(err, users) { 
                  
             if(users.length==0){

                   res.send({
                   msg: 'no teams',
                   status: 0,
                   data: []
                   });
           
              }else{
               res.send({
               msg: 'teams list',
               status: 1,
               data: users
               });
             }

             });
         
     }


     exports.getTeamsForAddMatchNew = async function(req, res){

      var followers = await Followers.findOne({owner_id: req.body._id});

      if(followers!=null){

        if(followers.player_id.length!=0){

          team.find({
            _id:{$ne: errors.indexOf(req.body.id)==-1 ? req.body.id : null},
            player_id:{$in: followers.player_id},

        },function(err, users) { 
                
            if(users.length==0){
 
                  res.send({
                  msg: 'no teams',
                  status: 0,
                  data: []
                  });
          
             }else{
              res.send({
              msg: 'teams list',
              status: 1,
              data: users
              });
            }
 
            });


        }else{
          res.send({
            msg: 'no teams',
            status: 0,
            data: []
            });
  
        }



      }else{
        res.send({
          msg: 'no teams',
          status: 0,
          data: []
          });

      }      
   }


   // getTemInfo


           exports.getTemInfo = function(req, res){

            team.findOne({_id: req.body._id},function(err, teamRes) { 
                      
                 if(teamRes==null){
    
                       res.send({
                       msg: 'team does not exist',
                       status: 0,
                       data: []
                       });
               
                  }else{
                   res.send({
                   msg: 'team details',
                   status: 1,
                   data: teamRes
                   });
                 }
    
                 });
             
         }


/////////////////////////////////////////////////////common////////////////////////////////////////

function add_notification(fromId,toId,type,data_params){
  var new_notis = new Notifications({
    fromId : fromId,
    toId : toId,
    type : type,
    data_params : data_params,
    isRead : '0', 
  });
  new_notis.save();
}



async function sendpush(to, body) {

   

  const OneSignal = require('onesignal-node');    

  const client = new OneSignal.Client('92262208-ae94-498c-8262-79d7dd1fed54', 'Mjk0NDMwMGYtMDU5NC00YzM0LTljNDYtNzUwN2EyZDI0YjAy');

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

       
}
