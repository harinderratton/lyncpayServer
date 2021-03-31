'use strict';

var mongoose = require('mongoose'),
    errors= ['',null,undefined,'null','undefined'],
    User = mongoose.model('User'),
    chat = mongoose.model('chat'),
    vote = mongoose.model('votes'),
    Match = mongoose.model('Match'),
    invitedPlayers = mongoose.model('invitedPlayers'),
    AdminDeposits = mongoose.model('AdminDeposits'),
    Joinmatch = mongoose.model('Joinmatch'),
    Calendar = mongoose.model('Calendar'),
    Admin = mongoose.model('Admin'),
    MatchResults = mongoose.model('MatchResults'),
    Followers = mongoose.model('Followers'),
    paymentToOwner = mongoose.model('paymentToOwner'),
    Notifications = mongoose.model('Notifications'),
    RequestField = mongoose.model('RequestField'),
    Otp =  mongoose.model('Otp'),
    terms =  mongoose.model('terms'),
    Addfav =  mongoose.model('Addfav'),
    Player =  mongoose.model('Player'),
    path = require('path'),
    Confirmation = mongoose.model('Confirmation'),
    requestFieldPayments = mongoose.model('requestFieldPayments'),
    Property = mongoose.model('Property'),
    NodeGeocoder = require('node-geocoder'),
    bookingPayment = mongoose.model('bookingPayment'),
    team = mongoose.model('team'),
    teamInvitation = mongoose.model('teamInvitation'),
    states = mongoose.model('States'),
    fs = require('fs');
    var sg = require('sendgrid')('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');
//----hashing password
var passwordHash = require('password-hash');

//----
var otpGenerator = require('otp-generator');
var multer  = require('multer');

var uploadTeamPic = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'data/team/')
  },
  filename: function(req, file, cb) {
       var fileExtn = file.originalname.split('.').pop(-1);
      cb(null, new Date().getTime() + '.' + fileExtn);
      }
});

var storage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/pic/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

var adminstorage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/admin_pic/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});



var pstorage = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/p_pics/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

//multer for property
var uploadproperty = multer.diskStorage({
   destination: function(req, file, cb) {
       cb(null, 'data/property/')
   },
   filename: function(req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
       cb(null, new Date().getTime() + '.' + fileExtn);
       }
});

//user signup
exports.addPlayerByAdmin = function(req, res) {	 
    User.findOne({email:req.params.email}, function(err, auser) {  


     if(auser==null){
               var upload = multer({ storage: storage }).single('file');
  upload(req,res,function(err){
      
      var querydata = {

              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              email: req.body.email,
              state: req.body.state,
              city: req.body.city,
              country: req.body.country,
              zip: req.body.zip,
              password: passwordHash.generate(req.body.password),
              status: '1'
          }
            if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }

                var new_user = new User(querydata);
        new_user.save(function(err, user) {
                 console.log(err);
                 if(user==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0}); 
                 }else{
                          res.send({
                              msg: 'New owner has been added',
                              status: 1,
                              data:user
                          });                  
                         }   
                      });      

             });



     }else{

        res.send({
                    msg: 'Email already exists, Try another',
                    status: 3,
                    data: null
         });

     }
     });   

       }

       exports.updateProperty = (req, res)=>{
            console.log('qswdefrgthyjukujhytgrfds');    
            var upload = multer({ storage: uploadproperty }).single('file');
             upload(req,res,function(err){  
                  
               User.findOne({email:req.body.email}, function(err, owner) {
                  if(owner==null){
                  res.send({
                  msg: 'No owner exists for this email',  
                  status: 2,
                  data: null
                  });
                  }else{

                    var id= owner._id;
                    Property.findOne({owner_id:id}, function(err, match) {         
                    var data= {
                        owner_id:id,    
                        name:req.body.name,
                        area:req.body.area,
                        state:req.body.state,
                        city:req.body.city,
                        zip:req.body.zip,
                        address:req.body.address,
                        descr:req.body.descr,
                        lat:req.body.lat,
                        lng:req.body.lng,
                }
             if(errors.indexOf(req.file)==-1){
             data['cover'] = req.file.filename;

            }

              if(match==null){               
                   var addProperty = new Property(data);
                       addProperty.save(function(err, match) { 
                       console.log(err);   

              if(match==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',  
                  status: 0,
                  data: null
                  });
              }else{             
                  res.send({
                  msg: 'propery has been added',
                  status: 1,
                  data:match

                  }); 

              }

              }); 

              }else{   
                
                    Property.update({owner_id:id},{$set:data},{new: true},function(err, match) {           
                  console.log(match);   
              if(match==null){
                  res.send({
                  msg: 'Internal Server Error, Try again',  
                  status: 0,
                  data: null
                  });
              }else{             
                  res.send({
                  msg: 'propery has been updated',
                  status: 1,
                  data:match

                             }); 
                            }
                         });           
                        }
                     }); 
                    }               
                 });
              });                    

}

exports.getOwners= async (req, res)=>{
     let data;
     data = await User.find({status:1});
   if(data.length==0){

      res.send({
        msg: 'No owner exists',
        status: 0,
        data:null  
      });

   }else{
       
        var i=0;
        var allData=[];
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

        for(let key of data){
       
        var matches =  await Match.find({owner_id:key._id});  
        var totalMatches; 
              if(matches.length==0) {
                                totalMatches=0;
                              
                              }
        else {
           totalMatches= matches.length;
          
             }          
            
        var today =  await Match.find({owner_id:key._id,date:dateStr}); 

             var temArray= await{
             _id:key._id,
             fname:key.fname,
             lname:key.lname,
             phone:key.phone,
             email:key.email,
             zip: key.zip,  
             country:key.country,
             city:key.city,
             state:key.state,
             pic:key.pic,
             total_matches:totalMatches,
             today_matches: today.length

             };

          allData.push(temArray);
          i++;

       
        if(i==data.length){
        res.send({
          msg: 'matches',
          status: 1,
          data:allData  
         });
        }      

       }

   }
}

exports.deleteOwner = async (req, res)=>{

      await User.remove({_id:req.body._id});
      await Match.remove({owner_id:req.body._id});     
      await Property.remove({_id:req.body._id});      
      await chat.remove({$or:[{toId:req.body._id}, { fromId: req.body._id}]})
      // await Confirmation.remove({$or:[{toId:req.body._id}, { fromId: req.body._id}]})
      await Notifications.remove({$or:[{toId:req.body._id}, { fromId: req.body._id}]})
      await Followers.remove({owner_id: req.body._id})
      await RequestField.remove({owner_id: req.body._id})    
      await bookingPayment.remove({owner_id: req.body._id})
      await requestFieldPayments.remove({owner_id: req.body._id})
      await paymentToOwner.remove({owner_id: req.body._id})      
      
      res.send({
          msg: 'Owner has been deleted',
          status: 1,
          data:null  
      });

 
}

exports.ownerNProperty= async (req,res)=>{

     const user = await User.findOne({_id:req.body._id});
     const property= await Property.findOne({owner_id:req.body._id});
    
    if(user!=null){

        res.send({
        status:1,
        msg:'user details',
        user:user,
        property:property

        });

    }else{
        res.send({
        status:0,
        msg: 'Internal Server Error, Try again',
        user:user,
        property:property
        });



    } 


}

//update player
//user signup
exports.update_PlayerByAdmin = function(req, res) { 
 
    User.findOne({email:req.params.email,_id:{$ne:req.params._id}}, function(err, auser) {
     if(auser==null){
               var upload = multer({ storage: storage }).single('file');
  upload(req,res,function(err){
      
      var querydata = {

              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              email: req.body.email,
              state: req.body.state,
              city: req.body.city,
              country: req.body.country,
              zip: req.body.zip,
                   }

          if(errors.indexOf(req.password)==-1){
               querydata['password'] = passwordHash.generate(req.body.password)

          }
            if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }

              
       User.update({_id:req.params._id},{$set:querydata},{new:true},function(err, user) {
                 console.log(err);
                 if(user==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0}); 
                 }else{
                          res.send({
                              msg: 'Profile data has been updated',
                              status: 1,
                              data:user
                          });                  
                         }   
                      });      

             });



     }else{

        res.send({
                    msg: 'Email already exists, Try another',
                    status: 3,
                    data: null
         });

     }
     });   

       }


       exports.editProperty = (req, res)=>{  

            var upload = multer({ storage: uploadproperty }).single('file');
             upload(req,res,function(err){
                        var data= {
                        owner_id:req.body._id,    
                        name:req.body.name,
                        area:req.body.area,
                        state:req.body.state,
                        city:req.body.city,
                        zip:req.body.zip,
                        address:req.body.address,
                        descr:req.body.descr,
                        lat:req.body.lat,
                        lng:req.body.lng,
                }

                if(errors.indexOf(req.file)==-1){
                  data['cover'] = req.file.filename
      
                }

                Property.findOne({owner_id:req.body._id}, function(err, propertyExists){
                 if(propertyExists!=null){
                  Property.update({owner_id:req.body._id},{$set:data},{new: true},function(err, match) {           
                    console.log(match);   
                if(match==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',  
                    status: 0,
                    data: null
                    });
                }else{             
                    res.send({
                    msg: 'propery has been updated',
                    status: 1,
                    data:match 
                          }); 
                              }
                           });


                 }else{
                 var newproperty = new Property(data)
                 newproperty.save(function(err, propertyCreated){
                  if(propertyCreated==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',  
                    status: 0,
                    data: null
                    });
                }else{             
                    res.send({
                    msg: 'propery has been updated',
                    status: 1,
                   
                          }); 
                              }
                 })


                 }


                })
                
          
              });                    

}


exports.getPlayers= async (req, res)=>{
     let data;
     data = await Player.find({status:1});
   if(data.length==0){

      res.send({
        msg: 'No players exists',
        status: 0,
        data:null  
      });

   }else{
       
      var i=0;
      var allData=[];
     

      for(let key of data){
         console.log(key._id);
        var ids=[key._id.toString()];  
     
        var join_match = await Joinmatch.find({player_id: { $in: ids}});       

            var temArray= await{
            _id:key._id,
            fname:key.fname,
            lname:key.lname,
            phone:key.phone,
            email:key.email,
            pic:key.pic,
            points: key.points < 10 ? 0 : ((key.points >= 10 && key.points < 20) ? 1 : ((key.points >= 20 && key.points < 30) ? 2 : (key.points >= 30 && key.points < 40) ? 3 : (key.points >= 40 && key.points < 50) ? 4 : 5)),
                        };

          if(join_match.length==0) temArray['matches_played']=  0;
          if(join_match.length>=1) temArray['matches_played']=  join_match.length;

            allData.push(temArray);
            i++;
          if(i==data.length){
              res.send({
              msg: 'players',
              status: 1,
              data:allData
              }); 
          }

        
      }

   }teamInvitation
}

exports.deletePlayer = async (req, res)=>{

      await Player.remove({_id: req.body._id});
      var ids = [req.body._id]
      await Joinmatch.update({player_id: {$in: ids}}, {$pull: {player_id:req.body._id}}, {multi:true});
      await Followers.update({player_id: {$in: ids}}, {$pull: {player_id:req.body._id}}, {multi:true});
      await RequestField.remove({player_id: req.body._id})    
      await teamInvitation.remove({player_id:req.body._id});  
      await bookingPayment.remove({player_id: req.body._id})
      await requestFieldPayments.remove({player_id: req.body._id})
      await Notifications.remove({$or:[{toId:req.body._id}, { fromId: req.body._id}]})
      await paymentToOwner.remove({player_id: req.body._id})
      await Confirmation.remove({player_id: req.body._id})
      await team.update({players: {$in: ids}}, {$pull: {players:req.body._id}}, {multi:true});
      await teamInvitation.remove({player_id: req.body._id})
      await vote.remove({toId: req.body._id})
      await chat.remove({$or:[{toId:req.body._id}, { fromId: req.body._id}]})
      await Calendar.remove({player_id: req.body._id})
      await AdminDeposits.remove({player_id: req.body._id})
      res.send({
          msg: 'Player has been deleted',
          status: 1,
          data:null  
      });

}

exports.getPlayer = async (req, res)=>{

    const player=  await Player.findOne({_id:req.body._id});    
       
      res.send({
          msg: 'Player details',
          status: 1,
          data:player  
      });

 
}

exports.updatePByadmin = function(req, res) { 
  console.log(req.params._id);


      Player.findOne({email: req.params.email,_id: { $ne: req.params._id}}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 2,
          data: null
    });
      }else{
         savenewuser();
      }
     
    });    

    
   function savenewuser(){
        var upload = multer({ storage: pstorage }).single('file');
        upload(req,res,function(err){
        var querydata = {
              fname: req.body.fname,
              lname: req.body.lname,
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

  exports.addPByadmin = function(req, res) { 
  
        Player.findOne({email: req.params.email}, function(err, user) {
      if(user!=null){
          res.send({
          msg: 'An account is already exists for this email',
          status: 2,
          data: null
    });
      }else{
         savenewuser();
      }
     
    });   
    
   function savenewuser(){

        var upload = multer({ storage: pstorage }).single('file');
        upload(req,res,function(err){
        var querydata = {
              fname: req.body.fname,
              lname: req.body.lname,
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
              address: req.body.address,
              status: 1,

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

            const addnew = new Player(querydata);
      
            addnew.save(function(err, user) {
             
         if(user==null){
            res.send({
            msg: 'Internal Server Error, Try again',
            status: 0}); 
         }else{
            res.send({
            msg: 'New player has been added',
            status: 1
          }); 

          
              }   
              });
                                   
  });



   }



  }



  exports.adminTodayMatches = async(req, res)=>{

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

              
             const match = await Match.find({date:dateStr,status:1});        

              if(match.length==0){
              res.send({
              msg: 'no data',  
              status: 0,
              data: []
              });
              }else{             
        
                       var i =0;
                       var complete_array = [];                       
                      for(let key of match){

                       
                        var ownername = await User.findOne({_id:key.owner_id});
                        var noofjoins = await Joinmatch.findOne({match_id:key._id});
                       
                        var allData = {
                             _id: key._id,
                              name:key.name,
                             location:key.location,
                             ownerfname:ownername.fname,
                             ownerlname:ownername.lname,
                             time:key.stime
                                       }


                        if(noofjoins==null)  allData['players']='0';                              
                        else allData['players'] =noofjoins.player_id.length;   

                        complete_array.push(allData);                       

                        i++;
                        if(match.length==i){

                          res.send({
                            msg: 'match list',
                            status: 1,
                            data:complete_array                                        
                          }); 
                        }                           

                       } 
                    }   

}



  exports.adminUpcomingMatches = async(req, res)=>{

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

              
             const match = await Match.find({date:{$gt:dateStr},status:1});        

              if(match.length==0){
              res.send({
              msg: 'no data',  
              status: 0,
              data: []
              });
              }else{             
        
                       var i =0;
                       var complete_array = [];                       
                      for(let key of match){

                       
                        var ownername = await User.findOne({_id:key.owner_id});
                        var noofjoins = await Joinmatch.findOne({match_id:key._id});
                       
                        var allData = {
                             _id: key._id,
                              name:key.name,
                             location:key.location,
                             ownerfname:ownername.fname,
                             ownerlname:ownername.lname,
                             time:key.stime,
                             date:key.date
                                       }


                        if(noofjoins==null)  allData['players']='0';                              
                        else allData['players'] =noofjoins.player_id.length;   

                        complete_array.push(allData);                       

                        i++;
                        if(match.length==i){

                          res.send({
                            msg: 'match list',
                            status: 1,
                            data:complete_array                                        
                          }); 
                        }                           

                       } 
                    }   

}


  exports.adminPreviousMatches = async(req, res)=>{

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

              
             const match = await Match.find({date:{$lt:dateStr},status:1});        

              if(match.length==0){
              res.send({
              msg: 'no data',  
              status: 0,
              data: []
              });
              }else{             
        
                       var i =0;
                       var complete_array = [];                       
                      for(let key of match){

                       
                        var ownername = await User.findOne({_id:key.owner_id});
                        var noofjoins = await Joinmatch.findOne({match_id:key._id});
                       
                        var allData = {
                             _id: key._id,
                              name:key.name,
                             location:key.location,
                             ownerfname:ownername.fname,
                             ownerlname:ownername.lname,
                             time:key.stime,
                             date:key.date
                                       }


                        if(noofjoins==null)  allData['players']='0';                              
                        else allData['players'] =noofjoins.player_id.length;   

                        complete_array.push(allData);                       

                        i++;
                        if(match.length==i){

                          res.send({
                            msg: 'match list',
                            status: 1,
                            data:complete_array                                        
                          }); 
                        }                           

                       } 
                    }   

}

   exports.adminMatchDetails = async(req, res)=>{

      var match = await Match.findOne({_id:req.body._id});

      var owner= await User.findOne({_id:match.owner_id});

      var noofjoins = await Joinmatch.findOne({match_id:req.body._id});

      if(noofjoins!=null){

        if(noofjoins.player_id.length>0){

                var user=[];
                var i=0;
                for(let key of noofjoins.player_id){

                var player = await Player.findOne({_id:key});
                
                if(player!=null){
                  user.push(player);
                }
                  
                  i++;
                if(i==noofjoins.player_id.length){

                  res.send({
                            msg: 'match details',
                            status: 1,
                            data:{'match':match, 'owner':owner, players: user}                                        
                          }); 
                }
              }
            }
          }else{

              res.send({
                      msg: 'match details',
                      status: 1,
                      data:{'match':match, 'owner':owner, players: []}                                      
              }); 


          }

    





   }

	exports.CancelMatchByAdmin = async (req, res) => {

	   Match.update({_id:req.body._id},{$set:{status:2}},{new: true},function(err,updated){

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

   exports.invitePlayerByAdmin = async (req,res)=>{   

        
         const exists = await invitedPlayers.findOne({match_id:req.body.match_id,player_id:req.body.player_id});
         if(exists==null){
              
             var data = {
		             	match_id:req.body.match_id,
		             	player_id:req.body.player_id
                        }
                const newquery= new invitedPlayers(data);
                newquery.save(function(err,resoutput){

							if(resoutput!=null){
											res.send({
											status:1,
											msg: 'invitation sent',

											});
							}else{
											res.send({
											status:0,
											 msg: 'Internal Server Error, Try again',
											 data:err

											});

							}
                

                });



         }else{
          invitedPlayers.update({_id:req.body._id},{$set:{status:2}},{new: true},function(err,updated){

              if(updated!=null){
							res.send({
							status:1,
							msg: 'invitation sent',

							});

              }else{
								res.send({
								status:0,
								 msg: 'Internal Server Error, Try again',
								 data:err

								});
							   }
					          })
					        }
					      }


exports.getPlayersByAdmin= async (req,res) => {

     const players = await Player.find({status:1});

    if(players.length>0){

    var temArray=[];
    var i=0;
     for(let key of players){
                  
        const response = await invitedPlayers.findOne({match_id: '5e54c4d1e5c54478eaf28e11', player_id: key._id});  
        console.log(response);
        

        if(response!=null){
            if(response.status==3){
               temArray.push(key);     
              

            }

        }else{

               temArray.push(key);        
               
        }
          i++;
        if(i==players.length){

				res.send({
						status:1,
						msg: 'Players list',
						data:temArray
				});
        }

     }

    }else{
				res.send({
						status:0,
						msg: 'Players list',
						data:null
				});

     	
     }



}


exports.getPlayersForVote= async (req,res) =>{

    const joined_players = await Joinmatch.findOne({match_id: req.body.match_id});

     if(joined_players!=null){
       
       if(joined_players.player_id.length!=0){
         

          Player.find({_id: {$in: joined_players.player_id}}, function(err, players){
             res.send({
                status:1,
                msg: 'Players list',
                data : players
            });
          });
         
       }else{
      res.send({
            status:0,
            msg: 'Players list',
            data:null
        });

       }
     }else{
             res.send({
            status:0,
            msg: 'Players list',
            data:null
        });
     }
}


exports.getResultsByAdmin = async function(req, res){


              var match_details=   await Match.findOne({_id:req.body._id});  

              MatchResults.findOne({match_id:req.body._id}, function(err, result) {         

              if(result==null){
              res.send({
		          msg: 'No data yet',  
		          status: 0,
		          data: null
              });
              }else{   


			res.send({
				msg: 'Match result',
				status: 1,
				data:{results:result, match_details:match_details}
		     	});          
              }
          });  
        }



//admin

exports.adminAuth = async function(req, res) { 
      
        Admin.findOne({email:req.body.email},function(err, user) {

        	if(user==null){
                        res.send({
				                msg: 'No account exists for this email',
				                status: 0,
				                data: null
				             });

        	}else{

           
				  //check password
				      if(passwordHash.verify(req.body.password,user.password)){
				                 
				             res.send({
				                msg: 'Logged in',
				                status: 1,
				                data: user
				             });

				      }else{
				         res.send({
				                msg: 'Wrong credentials',
				                status: 0,
				                data: null
				             });
				            }
                           }                 
                        });

    }


    exports.getAdminProfile = async function(req, res) { 
    	console.log(req.body._id);
      
        Admin.findOne({_id: req.body._id},function(err, user) {

                          	if(user==null){
                        res.send({
				                msg: 'Internal Server Error, Try again',
				                status: 0,
				                data: null
				             });

        	}else{
						res.send({
								msg: 'Profile data',
								status: 1,
								data: user
						});
                       }        	               
                     });

                   }


    //user signup
exports.updateAdminProfile = async function(req, res) {

    Admin.findOne({email:req.params.email,_id:{$ne:req.params._id}}, function(err, auser) {  


     if(auser==null){
               var upload = multer({ storage: adminstorage }).single('file');
  upload(req,res,function(err){
      
      var querydata = {

              fname: req.body.fname,
              lname: req.body.lname,
              phone: req.body.phone,
              email: req.body.email             
          }
            if(errors.indexOf(req.file)==-1){
             querydata['pic'] = req.file.filename;

            }

            console.log(querydata);
              
        Admin.update({_id:req.params._id},{$set:querydata},{new:true},function(err, user) {
                 console.log(err);
                 if(user==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0}); 
                 }else{
                          res.send({
                              msg: 'Profile information has been updated',
                              status: 1,
                              data:user
                          });                  
                         }   
                      });      

             });



     }else{

        res.send({
                    msg: 'Email already exists, Try another',
                    status: 3,
                    data: null
         });

     }
     });   

       }


exports.AdminPasswordUpdate = async function(req, res) { 
      
        Admin.findOne({_id:req.body._id},function(err, user) {

        	if(user==null){
                        res.send({
				                msg: 'No account exists for this email',
				                status: 0,
				                data: null
				             });

        	}else{

           
				  //check password
				      if(passwordHash.verify(req.body.password,user.password)){

				      	  Admin.update({_id:req.body._id},{$set:{ password: passwordHash.generate(req.body.npassword)}},{new:true},function(err, positive) {
                                  
                               if(positive!=null){
									res.send({
											msg: 'Password has been updated',
											status: 1,
											data: user
									});
                                }

				      	  });
				                 
				        

				      }else{
				      	
				         res.send({
				                msg: 'The old password you enetred was wrong',
				                status: 0,
				                data: null
				             });
				            }
                           }                 
                        });

    }


//add match


///transfer to owners
exports.addMByAdmin = async function(req, res){



  var matchExists = await Match.find(
                               {$and : [
                                   {
                                     $or : [
                                      {stime: { $gte: req.params.stime, $lte: req.params.stime } },
                                      {stime: { $gte: req.params.etime, $lte: req.params.etime } },
                                      {etime: { $gte: req.params.stime, $lte: req.params.stime } },
                                      {etime: { $gte: req.params.etime, $lte: req.params.etime } }
                                     ]
                                   },
                                   {
                                   date : req.params.date,
                                   }
                                   ,{
                             status:1
                                   }
                               ]}
                                   );
 
 if(matchExists.length==0){
   console.log(req.body);
                      
    var match = await Property.findOne({owner_id:req.params._id}); 
    
    if(match!=null){
       var upload = multer({ storage: storage }).single('file');
     upload(req,res,function(err){     
 
 
     console.log(req.body); 
 
           const data= {
       owner_id:req.body._id,
       name: req.body.name,
       location: req.body.location,
       date: req.body.date,
       stime: req.body.stime,
       etime: req.body.etime,
       players: req.body.players,
       cover: req.file.filename,
       team1: req.body.team1,
       team2: req.body.team2,
       request_match: req.body.request_match,
       fullday: req.body.fullday
     }
 
        if(req.body.request_match=='1'){
           data['paid']=1
     }
       var new_match = new Match(data);
               new_match.save(function(err, match) {
               if (match == null){
                  res.send({
                   msg: 'Internal Server Error, Try again',
                   status: 0,
                   data: null
                 });
               }else{
              //
 
              Followers.findOne({owner_id:req.body._id},function(err, FollowersID){
 
              if(FollowersID!=null){
                var toId= FollowersID.player_id;
                var fromId= req.body._id;
                var params= {match_id:String(match._id)}
 
                 add_notification(fromId,toId,1,params);
 
              }     
 
 
              });
              //
 
                if(req.body.request_match=='1'){
 
                User.findOne({_id:req.body._id},function(err,stri_id){
                  var amountoPay;
                  var amnt;
                  if(req.body.fullday=='1'){
 
                    amountoPay=10800;
                    amnt= 108;
                  }else{
                       
                    amountoPay=900;
                    amnt=9;
 
                  }
                 stripe.transfers.create(
                                {
                                 amount:amountoPay,
                                 currency: 'usd',
                                 destination:stri_id.stripe_id,                     
                                },
                               function(err, transfer) {
                                 console.log(err);
                           if(transfer!=null){
 
                           var OTP= otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets:false });
                           var data= {
                           payId:OTP,
                           transaction_id:transfer.id,
                           owner_id:req.body._id,
                           player_id:'',
                           amount:amnt,
                           type:3
                           }
                           var newpayment= new paymentToOwner(data);
                           newpayment.save()
 
                           RequestField.update({_id:req.body.r_id}, { $set: { status : 2 }}, {new: true}, function(err, user) {
           
 
                           });
 
                           }
 
                               })
 
 
                  });
 
                 
                  
 
                }
                  var player_ids=[];
                  var i=0;
                Player.find({status:1},function(err,players){
                  console.log(players);
                if(players.length!=0){
                for(let key of players){
                  if(errors.indexOf(key.uid)==-1){
                    player_ids.push(key.uid);
                  }
                    
                    i++;
 
                    if(i==players.length){
                             User.findOne({_id:req.body._id},function(err,admin_details){
                     var owner_name= admin_details.fname;
 
                     if(player_ids.length>0){
                             var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                 registration_ids: player_ids, 
                                 collapse_key: 'your_collapse_key',
                                 
                                 notification: {
                                     title: 'New match added', 
                                     body: 'A new match has been added by '+owner_name.charAt(0).toUpperCase() + owner_name.slice(1)
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
                   
 
                               if(req.body.request_match=='1'){
 
            Player.findOne({_id:req.body.player_id},function(err, player_token){
              console.log(player_token);
            if(player_token!=null){
 
 
              if(errors.indexOf( player_token.uid)==-1){
                              var message1 = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                 to: player_token.uid, 
                                 collapse_key: 'your_collapse_key',
                                 
                                 notification: {
                                     title: 'Field request is accepted', 
                                     body: 'Your field request is accepted by '+owner_name.charAt(0).toUpperCase() + owner_name.slice(1)
                                 },      
                                
                             };
                             
                             fcm.send(message1, function(err, response){
                               console.log(err);
                                 if (err) {
                                     console.log("Something has gone wrong!");
                                 } else {
                                     console.log("Successfully sent with response: ", response);
                                 }
                               });
 
              }
                  
          
 
            }
 
            });
 
 
               }
                             
                             });
                       
                           
 
 
                    }
                }
                }
             
 
                });
 
               
      
                 res.send({                 
                   msg: 'Match is added',
                   status: 1,
                   data: match
                 });
               }
               });
 
 
     });

    }else{
             res.send({
                   msg: 'Please update your property details before adding match',
                   status: 3,
                   data: null
                 });
 
 
    }
 
 }else{
 
              res.send({
                   msg: 'This time slot is already taken',
                   status: 4,
                   data: null
                 });
 
   }
 
 }



 //dashboard owners

 exports.dashboardOwners = async function(req, res) { 

      
    var owners= await User.find({status:1});
   
    var i=0;
    var data=[];


    if(owners.length!=0){
      for(let key of owners){

        Match.find({owner_id:key._id},function(err, ownerMatch){
    
          var dist = {
            pic:key.pic,
            email:key.email,
            phone:key.phone,
            city:key.city,
            matches:ownerMatch.length,
            name:key.fname[0].toUpperCase()+key.fname.slice(1) +' '+ key.lname[0].toUpperCase()+key.lname.slice(1)
            }

            data.push(dist);

            i++;

            if(i==owners.length){
              res.send({
                status: 1,
                data:data
              });
    
            }
    
         })
    
       }

    }else{
            res.send({
              status: 0
            
            });



    }




   

}


//dashboard players

exports.dashboardPlayers = async function(req, res) { 
  var total_matches= await Match.find({status:1});
  var players= await Player.find({status:1});
 
  var i=0;
  var data=[];

  if(players.length!=0){
    for(let key of players){

      var ids=[String(key._id)]
      Joinmatch.find( {"player_id": {"$in": ids}}, function(err, matches) {
        console.log(matches);
  
        var dist = {
          pic:key.pic,
          email:key.email,
          phone:key.phone,
          matches:matches.length,
          points: key.points < 10 ? 0 : ((key.points >= 10 && key.points < 20) ? 1 : ((key.points >= 20 && key.points < 30) ? 2 : (key.points >= 30 && key.points < 40) ? 3 : (key.points >= 40 && key.points < 50) ? 4 : 5)),
          name:key.fname[0].toUpperCase()+key.fname.slice(1) +' '+ key.lname[0].toUpperCase()+key.lname.slice(1)
          }

          data.push(dist);

          i++;

          if(i==players.length){
            res.send({
              status: 1,
              data:data,
              total_matches:total_matches.length
            });
  
          }
  
       })
  
     }

  }else{
          res.send({
            status: 0
          
          });

  }

}


exports.deleteTeam = async function(req, res) {
  var teamInfo = await team.findOne({player_id: req.body._id})
  team.deleteOne({_id: teamInfo._id},function(err, user) {

                  if(user==null){
                    res.send({
                    msg: 'Internal Server Error, Try again',
                    status: 0,
                    data: null
                 });

                }else{
                    teamInvitation.deleteMany({team_id: teamInfo._id}, function(err, deleted){
                      console.log('coming')
                      Player.update({_id: req.body._id}, {$set:{ hasTeam:'0'}}, {new: true}, function(err, haveTeam){
                       
                        res.send({
                          msg: 'Team deleted',
                          status: 1,
                          data: user
                      });
                      })       
                    })
                   }        	               
                 });

               }


 exports.manageTeamAdmin = async (req, res)=>{

                if(req.body.status==1){
               
                  teamInvitation.update({team_id:req.body.team_id, player_id: req.body.player_id},{$set:{status:1}},{new:true},function(err, invitations){
                    console.log('1');
                    if(invitations!=null){
                      console.log('2');
                      var setdata= {$push:{players:req.body.player_id}};
                      team.update({_id: req.body.team_id},setdata,{new:true}, function(err, teamOutput){
                        console.log('3');
                        console.log(teamOutput);
                        if(teamOutput!=null){
                              
                                res.send({
                                  status:1,
                                
                                    });
              
              
                        }else{
                          res.send({
                            status:0,
                           
                               });
              
                        }
              
              
              
                      });
               
               
                    }else{
               
                     res.send({
                       status:0,
                      
                          });
                    }
               
               
                   });
              
              
              
                }else{
                  teamInvitation.update({team_id:req.body.team_id, player_id: req.body.player_id},{$set:{status:2}},{new:true},function(err, invitations){
              
                   if(invitations!=null){
                    res.send({
                      status:1,
                     
                         });
              
              
                   }else{
              
                    res.send({
                      status:0,
                      
                         });
                   }
              
              
                  });
              
              
                }
              
              }


exports.getAdminDeposits = async function(req, res) { 
  
  AdminDeposits.find({},function(err, deposits) {

                 if(deposits.length==0){
                    res.send({
                          msg: 'No deposists',
                          status: 0,
                          data: null,

                 });

                 }else{
                         var allData =[];
                         var total = 0;
                          var i = 0;
                           for(let key of deposits){

                          Match.findOne({_id: key.match_id},function(err, matchInfo){
                               Player.findOne({_id: key.player_id}, function(err, playerInfo){
                                    var dist ={
                                        match: matchInfo,
                                        player: playerInfo,
                                        amount: key.amount
                                       }
                                   allData.push(dist)

                                 total = total + Number(key.amount)
                                 i++
                                    if(i==deposits.length){

                                     res.send({
                                        msg: 'All deposits summary',
                                        status: 1,
                                        data: allData,
                                        total:total
                                      });
                                  }
                                })
                              })
                            }
               
                         }                         
                     });
                   }


 exports.getVotesData = async function(req, res) { 
  
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
  var dateStr = year + "-" + month + "-" + date;


   var matches = await Match.find({date: { $lt: dateStr }, status: 1 });

 
  if(matches.length!=0){

    var votes = [];
    var i = 0;

    for(let key of matches){

       Joinmatch.findOne({match_id:key._id}, function(err, joinResult){
          
          if(joinResult!=null){

            if(joinResult.player_id.length!=0){
                     for(let key1 of joinResult.player_id){
                     vote.find({match_id: key._id, toId: key1},function(err, voteResult){
                       Player.findOne({_id:key1}, function(err, playerOutput){

                         if(playerOutput!=null){
                         var dist = {
                            match: key,
                            player: playerOutput,
                            vote: voteResult
                          }
                          votes.push(dist);
                          i++;
                          if(i==matches.length){
                             res.send({
                                        msg: 'All votes',
                                        status: 1,
                                        data: votes,
                                        
                                    });
                          }
                         }else{

                             i++;
                            if(i==matches.length){
                             res.send({
                                    msg: 'All votes',
                                    status: 1,
                                    data: votes,
                                    
                               });
                      }


                         }

                       })
                     


                     })

                    }
            }else{
                     i++;
                      if(i==matches.length){
                         res.send({
                                    msg: 'All votes',
                                    status: 1,
                                    data: votes,
                                    
                                });
                      }
            }

                   

          }else{
              i++;
              if(i==matches.length){
                 res.send({
                            msg: 'All votes',
                            status: 1,
                            data: votes,
                            
                        });
              }
          }
       })

    }

  }else{
        res.send({
          msg: 'No votes',
          status: 0,
          data: [],
        });

  }
 

               }



 exports.getTeamsForAdmin = function(req, res){

        team.find({},function(err, users) { 
                  
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


     exports.getStates = function(req, res){
       states.findOne({},function(err, result){
        res.send({
          msg: 'states',
          status: 1,
          data: result!=null ? result.states : []
          });
       })
     }

     exports.updatePropertyByOwner1 = async (req, res) => {

     var exists = await User.findOne({email: req.params.email});

     if(exists!=null){
      var upload = multer({ storage: uploadproperty }).single('file');
      upload(req, res, function (err) {
    
        var id = req.body._id;
        Property.findOne({ owner_id: exists._id }, function (err, match) {
          var data = {
            owner_id: exists._id,
            name: req.body.name,
            area: req.body.area,
            state: req.body.state,
            city: req.body.city,
            zip: req.body.zip,
            address: req.body.address,
            descr: req.body.descr,
            lat: req.body.lat,
            lng: req.body.lng,
    
          }
          if (errors.indexOf(req.file) == -1) {
            data['cover'] = req.file.filename;
    
          }
    
          if (match == null) {
            var addProperty = new Property(data);
            addProperty.save(function (err, match) {
     
              if (match == null) {
                res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              } else {
                res.send({
                  msg: 'Property has been added',
                  status: 1,
                  data: match
    
                });
    
              }
    
            });
    
          } else {
    
            Property.update({ owner_id: exists._id }, { $set: data }, { new: true }, function (err, match) {
         
              if (match == null) {
                res.send({
                  msg: 'Internal Server Error, Try again',
                  status: 0,
                  data: null
                });
              } else {
                res.send({
                  msg: 'Property has been updated',
                  status: 1,
                  data: match    
                });
              }
            });
          }
        });
    
      });

     }else{
      res.send({       
        status: 5       
      });
     }


    
    }

    exports.OwnersForTeam = async (req, res)=>{
    var data  = await Player.find({hasTeam: '0'});
    console.log('data', data)
    if(data.length==0){
 
       res.send({
         msg: 'No owner exists',
         status: 0,
         data:null  
       });
 
    }else{        
         var i=0;
         var allData=[];     
 
         for(let key of data){       
 
           allData.push(key._id);
           i++;        
         if(i==data.length){

          Player.find({_id: {$in: allData }}, function(err, allPlayers){
            res.send({
              
              status: 1,
              data: allPlayers  
             });

          });
     
         }      
 
        }
 
    }
 }

 exports.PlayersForTeamAdmin = async (req, res)=>{
  var ids = [req.body.id]
  var data  = await Player.find({_id: {$nin: ids}}); 
  if(data.length==0){

     res.send({
       msg: 'No player exists',
       status: 0,
       data:null  
     });

  }else{        
       var i=0;
       var allData=[];     

       for(let key of data){       

         allData.push(key._id);
         i++;        
       if(i==data.length){

        Player.find({_id: {$in: allData }}, function(err, allPlayers){
          res.send({
            
            status: 1,
            data: allPlayers  
           });

        });
   
       }      

      }

  }
}


  //make a team
  exports.updateTeam = async function(req, res) {


 
    var upload = multer({ storage: uploadTeamPic }).single('file');


    upload(req, res, function (err) {

      console.log(req.body);

    var data= {         
           name: req.body.name                  
              }

          if(errors.indexOf(req.file)==-1){
            data['cover'] = req.file.filename

          }
   

team.update({_id: req.body.teamId},{$set: data},{new: true},function(err, teamCreated){
      if(teamCreated!=null){

        res.send({
          status:1,
          team: teamCreated
            });
  

      }else{
        res.send({
          status:0,
           msg: 'error',
             });
           }
         });
       });        
      }

  exports.updateTerms = async function(req, res) {
     terms.update({colId: 1}, {$set: {terms: req.body.terms}}, {new : true},function(err, terms_result){
       if(terms_result!=null){
        res.send({
          status:1
             });
       }else{
        res.send({
          status:0
             });
       }
     })
  }

  exports.getTerms = async function(req, res) {

    terms.findOne({colId: '1'},function(err, terms_result){
      console.log(terms_result)
      if(terms_result!=null){
       res.send({
         status:1,
         terms:terms_result
            });
      }else{
       res.send({
         status:0
            });
      }
    })
 }


 exports.saveInsta = async function(req, res) {

 
  
  
}

