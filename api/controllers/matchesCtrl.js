'use strict';

var mongoose = require('mongoose'),
    errors = ['', null, undefined, 'null', 'undefined', 0],
    User = mongoose.model('User'),
    FCM = require('fcm-node'),
    serverKey = 'AAAAD0hVUcY:APA91bG9dFjq_5yMB5ffOBUce0doghBnnpE9ngkSMtw2IDUb5X4uT8MIN-pYT5Jyndp_KZg7hNyuVDSHwSjPkG49irn5V3J96_dHssFoo_1O7NZxPgEqcwTdNLhju1J_ST67Md9Y9b6k',
    fcm = new FCM(serverKey),
    arraySort = require('array-sort'),
    team = mongoose.model('team'),
    SavedCard = mongoose.model('SavedCard'),
    AdminDeposits = mongoose.model('AdminDeposits'),
    Match = mongoose.model('Match'),
    outsiderPlayers = mongoose.model('outsiderPlayers'),
    Followers = mongoose.model('Followers'),
    MatchResults = mongoose.model('MatchResults'),
    RequestField = mongoose.model('RequestField'),
    Notifications = mongoose.model('Notifications'),
    paymentToOwner = mongoose.model('paymentToOwner'),
    Confirmation = mongoose.model('Confirmation'),
    Player = mongoose.model('Player'),  
    bookingPayment = mongoose.model('bookingPayment'),
    matchInvites = mongoose.model('matchInvites'),
    Otp = mongoose.model('Otp'),
    Joinmatch = mongoose.model('Joinmatch'),
    path = require('path'),
    Property = mongoose.model('Property'),
    NodeGeocoder = require('node-geocoder'),
    fs = require('fs');
    var sg = require('sendgrid')('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');
    
//----hashing password
var passwordHash = require('password-hash');
//----
var otpGenerator = require('otp-generator');
var multer = require('multer');
var stripe = require('stripe')('sk_test_oDnJiczBF5W5NtF4gphJ2YPT00A5wasqym');
const cron = require("node-cron");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/match/')
    },
    filename: function (req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
        cb(null, new Date().getTime() + '.' + fileExtn);
    }
});

//multer for property
var uploadproperty = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'data/property/')
    },
    filename: function (req, file, cb) {
        var fileExtn = file.originalname.split('.').pop(-1);
        cb(null, new Date().getTime() + '.' + fileExtn);
    }
});



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
 
    Match.find({ date: dateStr, isCancelled: 0}, function (err, match) {
       
        console.log('match count', match.length)
        if (match.length != 0) {

            for (let key of match) {
                
 

                var noOfPlayers = key.players;

                noOfPlayers = Number(noOfPlayers)-2;

                var current_time = stime+':'+'00'

                var match_hour = key.stime.slice(0, 2);

                var match_min = key.stime.slice(-2);

                var match_time = key.start_day.split(' ')[1]
               
                var diff;
               
                var time_start = new Date();

                var time_end = new Date();

                var value_start = current_time.split(':');

                var value_end = match_time.split(':');

                time_start.setHours(value_start[0], value_start[1], value_start[2], 0)

                time_end.setHours(value_end[0], value_end[1], value_end[2], 0)

                var diff = time_end - time_start

                if ((diff/60000) <= 5) {

                  

                    Joinmatch.findOne({ match_id: String(key._id) }, function (err, player_ids) {

                        if (player_ids != null) {
                            console.log('cominnn1')

                         var isFull;

                         



        ///count vacant seats
          
          var totalCount = key.players
          if(errors.indexOf(key.team1_team_id)==-1 && errors.indexOf(key.team2_team_id)==-1){
            totalCount = 'Game Full';

          }else{
  
            if(errors.indexOf(key.team1_team_id)==-1){
              totalCount =  totalCount/2;
            }
  
            if(errors.indexOf(key.team2_team_id)==-1){
         
              totalCount =  totalCount/2;
            }
  
          }

          if(errors.indexOf(key.team1_team_id) >= 0 && key.team1_player_ids.length!=0 || errors.indexOf(key.team2_team_id)>=0 && key.team2_player_ids.length!=0){

        
          if(errors.indexOf(key.team1_team_id)>=0 && key.team1_player_ids.length!=0){
           

            totalCount = totalCount - key.team1_player_ids.length
 
          }


          if(errors.indexOf(key.team2_team_id)>=0 && key.team2_player_ids.length!=0){
          
            totalCount = totalCount - key.team2_player_ids.length

          }

          }

          if(key.team3_player_ids.length!=0){
           
            totalCount = totalCount - key.team3_player_ids.length;
           
  
          }

          if(totalCount <= 0){
  
            totalCount = 'Game Full';
  
          }else{

            if(totalCount != 'Game Full'){
              var leftSeats = totalCount;
              totalCount = totalCount <= 1 ? totalCount+' Spot Left': totalCount+' Spots Left';
            }
           
          }

     ///count vacant seats

     console.log('totalCounttotalCounttotalCount', totalCount)

                           
                            if(totalCount == 'Game Full'){
                                console.log('cominnn2')
                                var allPlayers = []

                                for (let key1 of player_ids.player_id) {
                                    if(allPlayers.indexOf(key1)==-1){

                                        console.log('cominnn3')
                                        Match.findOne({_id: String(key._id)}, function(err, joined){
                                            SavedCard.findOne({userID: key1, matchId: String(key._id)}, function(err, cardDetails){


                                                if(cardDetails!=null){
                                                    console.log('cominnn')
                                                    var date =  new Date();
                                                    var currentTime =  date.getTime();
                                              
                                                    var matchDate = new Date(joined.date+' '+joined.stime );
                                              
                                                    var matchTime  = matchDate.getTime();

                                                    console.log('cominnn222', currentTime, matchTime)

                                                    if(currentTime <  matchTime){
                                                        console.log('cominnn222')
                                                    User.findOne({_id: key.owner_id}, function(err, userStrieId){

                                                        if(userStrieId!=null){
                                                            if(errors.indexOf(userStrieId.stripe_id) == -1){
                                                     
                                                           if(errors.indexOf(cardDetails.customerId)==-1){
                                                               var adminMoney =  (90/100) * Number(cardDetails.amount)
                                                               var userMoney =  Number(cardDetails.amount)
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
                                                                                  
                                

                                                                                add_notification(key1, key.owner_id, 7, {amount: adminMoney, match_id: String(key._id)});
                                                     
                                                                                 var AdminDepositData = {
                                                                                   match_id: String(key._id),
                                                                                   amount: adminMoney,
                                                                                   player_id: key1
                                                                                  
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
                                                                                        owner_id: key.owner_id,
                                                                                        player_id: key1,
                                                                                        amount: adminMoney,
                                                                                        type: 1,
                                                                                        matchId: key._id
                                                                                    }
                                                                                var newpayment = new paymentToOwner(data);
                                                
                                                                                newpayment.save(function (err, paymentOutput) {
                                                                                    console.log(paymentOutput);
                                                                                    
                                                                                });
                                                                 
                                                                                var data= {
                                                                                    payId: OTP,
                                                                                    transaction_id: charge.id,
                                                                                    owner_id: key.owner_id,
                                                                                    match_id: String(key._id),
                                                                                    player_id: key1,
                                                                                    amount: userMoney,
                                                                                }
                                                
                                                                                var newpayment= new bookingPayment(data);
                                                     
                                                                                    newpayment.save();
                                                                                 
                                                                                     Match.update({_id: String(key._id)},{$set:{status:1, isCancelled: 2}},{new:true}, function(){
                                                                                       });
                                                     
                                                                                     if(type==1){
                                                                                        
                                                                                       // Notifications.update({_id: req.body.confirmation_id},{$set:{isRead:1}},{new:true},function(){
                                                                                       // });
                                                     
                                                                                     }else{
                                                     
                                                                                       var toId = req.body.owner_id;
                                                                                       var fromId = key1;
                                                                                       var params = {match_id: String(key._id), coming_status: Number(req.body.coming_status)}
                                                                   
                                                                                       add_notification(fromId,toId,13,params);
                                                     
                                                                                       Confirmation.update({_id:req.body.confirmation_id},{$set:{status:1}}, {new:true}, function(err, output){
                                                                                         
                                                                                       });
                                                                                     }
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
                                                        console.log("Match has been already started");
                                                 
                                                     }
                                              
                                              
                                                    }else{
                                             
                                                    }

                                            });
                                           
                                        });
                                     
                                            
                                    }
                                 
                                }



                            }else{

                                // Match.update({ _id: String(key._id) }, { $set: { isCancelled: 1 } }, { new: true }, function (err, matchUpdate) {

                                //     console.log('match has been cancelled')
    
                                // });
                            }

                        }else{

                           

                            // Match.update({ _id: String(key._id) }, { $set: { isCancelled: 1 } }, { new: true }, function (err, matchUpdate) {

                            //     console.log('match has been cancelled')

                            // });

                        }


                    });


                }


                        Match.update({ _id: String(key._id) }, { $set: { alert_sent: 1 } }, { new: true }, function (err, matchUpdate) {

                        });

            }

        }

    })


});


// slot players in team before 5 mins
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

    Match.find({ date: dateStr, slotted: 0,  isCancelled: 2 }, function (err, match) {
      
        if (match.length!=0) {
     
            for (let key of match) {

                var match_date =  key.date;
                var match_start_time =  key.stime;
                var start_time_value = new Date(match_date+' '+match_start_time);
                var final = start_time_value.setMinutes( start_time_value.getMinutes() -  120);
                var final_time = start_time_value.getTime();
     
                if (d.getTime() >= final_time ){
                    if(key.team1_player_ids.length ==0 || key.team2_player_ids.length==0){
                        if(key.team1_player_ids.length ==0 && key.team2_player_ids.length==0){
                            var all_team1_ids = key.team1_player_ids;
                            var all_team2_ids = key.team2_player_ids;
                            var current_time = hours * 60 + mins;
                            var match_hour = key.stime.slice(0, 2);
                            var match_min = key.stime.slice(-2);
                            var match_time = Number(match_hour) * 60 + Number(match_min)
                            var diff = match_time - current_time;     
  
                            if (diff <= 5) {
                                var total;
                                total = key.team1_player_ids.length + key.team2_player_ids.length + key.team3_player_ids.length;
       
                                if(total% 2 ==0){
                                    var half = total/2

                                }else{
           
                                    var half =  Math.round(total/2);
             
                                }

                                var i;
                                var first_entries = Math.abs(key.team1_player_ids.length - half);
                 
                                for (i = 0; i < key.team3_player_ids.length; i++) {
                                    if(i+1 <= first_entries){
              
                                        all_team1_ids.push(key.team3_player_ids[i]);
                                    }
                                    else{
              
                                        all_team2_ids.push(key.team3_player_ids[i]);
                                    }

                                    if(key.team3_player_ids.length == i+1){ 
           
            
                                        Match.update({_id: String(key._id)},{$set:{team1_player_ids : all_team1_ids, team2_player_ids : all_team2_ids, team3_player_ids: [], slotted:1}}, {new:true},function(){
            
                                        });
                                    }

                                }
                            }
                        }else{
                            if(key.team1_player_ids.length == 0){
                                Match.update({_id: String(key._id)},{$set:{team1_player_ids : key.team3_player_ids, team3_player_ids: [], slotted:1}}, {new:true},function(){

                                });
                            }else if(key.team2_player_ids.length == 0){
                                Match.update({_id: String(key._id)},{$set:{team2_player_ids : key.team3_player_ids, team3_player_ids: [], slotted:1}}, {new:true},function(){
                    
                                });
                            }
                        }       
                    }
                }     
            }
        }
    })


});

cron.schedule("* * * * *", function () {
 
    var present_time = new Date();
    var presentTime =  present_time.getTime()


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

    Match.find({ date: dateStr, status: 1, paid: 0,  isCancelled: 2 }, function (err, query_a) {

        if (query_a.length != 0) {

            for (let key of query_a) {
               
                console.log('1')

                var duration = key.duration;
                var date =  key.date;
                console.log('date', date)
                var start_time =  key.stime;
                var start_time_value = new Date(date+' '+start_time);

                var final = start_time_value.setMinutes( start_time_value.getMinutes() +  Number(duration));
                var final_time = start_time_value.getTime();

                console.log('presentTime', presentTime)
                console.log('final_time', final_time)

                if(presentTime > final_time){

                    console.log('yepp')

                    User.findOne({ _id: key.owner_id }, function (err, query_b) {
                        if (query_b != null) {
           
                            //send push notifications for voting request

                            Joinmatch.findOne({match_id: key._id},function(err, allUdis){

                                if(allUdis!=null){

                                 var uniqueArray = []
                                
                                    for(let key3 of allUdis.player_id){

                                        if(uniqueArray.indexOf(key3)==-1){
                                            uniqueArray.push(key3)
                                            var new_notis = new Notifications({
                                                // eslint-disable-next-line indent
                                                fromId: '0',
                                                toId: key3,
                                                type: 9,
                                                data_params: {
                                                    match_id: key._id
                                                },
                                                isRead: '0',
                                            });
     
                                            new_notis.save();
     
                                            Player.findOne({_id: key3},function(err, playersUid){
                                                if(playersUid!=null){
     
                                                    var to =  playersUid.uid;
                                                    var title =  'Vote for MOTM';
                                                    var body =  "Please vote for the player to select as Man of the match";
                                                    var type = 1; 
     
                                                    sendpush(to, title, body, type) 
     
                                                }
                                            });

                                        }                                  
                                    }

                                }
                            });

                            Match.update({ _id: key._id }, { $set: { paid: 1 } }, { new: true }, function (err, query_a) {

                                // Followers.findOne({owner_id: key.owner_id}, function(err, followerInfo){
                                // console.log(followerInfo)
                                //   if(followerInfo!=null){
                                //    for(let playerkey of followerInfo.player_id){
                                //        Player.findOne({_id: playerkey}, function(err, playerUid){

                                //        Property.findOne({owner_id: key.owner_id}, function(err, propertyDetails){
                                //         var to =  playerUid.uid;
                                //         var title =  'Spot'+propertyDetails.name+' may be free now, Try adding match';
                                //         var body =  'Spot'+propertyDetails.name+' may be free now, Try adding match';
                                //         var type = 1;
                                //         sendpush(to, title, body, type); 
                                //         })
                                //        })

                                //    }
                                  
                                //   }

                                // })
                        
                            })
                        }
                    });
                }
            }
        }

    });
});


 
exports.addmatch = async function (req, res) {

    var team1Details = errors.indexOf(req.body.team1_team_id)==-1 ?  await team.findOne({_id: req.body.team1_team_id}) : null;

    var team2Details =  errors.indexOf(req.body.team2_team_id)==-1 ? await team.findOne({_id: req.body.team2_team_id}) : null;

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
    var hours= d.getHours() >= 10 ? d.getHours() : '0'+d.getHours();
    var mins =  d.getMinutes() >= 10 ? d.getMinutes() : '0'+d.getMinutes();
     
    var stime= hours+':'+mins;
    var dateStr = year + "-" + month + "-" + date;


    if(dateStr==req.body.date){
        console.log(req.body.stime, stime)
        if(req.body.stime < stime ){

        
            res.send({
      
                status: 6,
      
            });
    
        }else{
  
            callMatch();
    
        }
 

    }else{

        callMatch()

 
    }


    async function callMatch(){
    
  
        var matchExists = await Match.find(
            {    isCancelled: 2,
                propertyId : req.body.property_id,
                $and: [
                    {
                  
                          $or:[
                            {start_day : {$lte : req.body.date+' '+req.body.stime+':00'}, end_day : {$gte : req.body.date+' '+req.body.stime+':00'}},
                            {start_day : {$lte : req.body.endDate+' '+req.body.finalTime}, end_day : {$gte : req.body.endDate+' '+req.body.finalTime}}
                          ]
                    },
                     {
                        status: 1
                    },
                    
                    {
                        owner_id: req.body._id
                    }

                ]
            }
        );

        var one = 1;

        if (one==1) {
    
            var match = await Property.findOne({ owner_id: req.body._id });

            var matchArray = await Property.findOne({ _id: req.body.property_id });

            if (match!=null) {

                var total_player = req.body.players;
                var joined = 0;
        
                if(errors.indexOf(req.body.team1_player_ids)==-1){

                    joined =  total_player/2
                } 

                if(errors.indexOf(req.body.team2_player_ids)==-1){

                    joined = joined + (total_player/2)
                }
        
                const data = {
                    joined: joined,
                    duration: req.body.duration,
                    owner_id: req.body._id,
                    // name:  req.body.name,
                    name:  'Team 1 VS Team 2',
                    location: match.name+' ('+match.city+')',
                    date: req.body.date,
                    stime: req.body.stime,
                    etime: req.body.etime,
                    players: req.body.players,
                    // team1: req.body.team1_name,
                    // team2:  req.body.team2_name,
                    team1: 'Team 1',
                    team2: 'Team 2',
                    team1_player_ids: [],
                    team2_player_ids:  [],
                    team_2_type: '0',
                    team_1_type: '0',
                    gender: req.body.gender,
                    request_match: req.body.request_match,
                    fullday: req.body.fullday,
                    status : (req.body.request_match =='1') ? 0 : 1,
                    start_day : req.body.date+ ' '+ req.body.stime+':00',
                    end_day: req.body.endDate+' '+req.body.finalTime,
                    matchFees: req.body.matchFees,
                    level:  req.body.level,
                    propertyId: req.body.property_id,
                    invitedTeam1:  errors.indexOf(req.body.team1_team_id)==-1 ? req.body.team1_team_id : 0,
                    invitedTeam2:  errors.indexOf(req.body.team2_team_id)==-1 ? req.body.team2_team_id : 0
                }

                var new_match = new Match(data);

                new_match.save(async function (err, match) {

                    if(match!=null){

                        ////req.body.team_1_type!=0
                        
                        if(req.body.team_1_type!=0){

                            if(req.body.team_1_type==1){
                             
                                var newReqForInvitaion1 = {
                                    matchId: match._id,
                                    type: 1,	
                                    captainId: team1Details.player_id,
                                    name: req.body.team1_name
                                }

                                var newMatchInvites = new matchInvites(newReqForInvitaion1)

                                var toId = team1Details.player_id;
                                var fromId = req.body._id;
                                var params = {match_id: match._id}
                  
                                add_notification(fromId,toId, 333 ,params);


                                newMatchInvites.save(function(err, matchSuccess1){

                                    if(matchSuccess1!=null){
                                        Player.findOne({_id: team1Details.player_id}, function(err, playerOutput){

                                            if(playerOutput!=null){
                                                console.log('playerOutput.uid', playerOutput.uid)
                                                var to =  errors.indexOf(playerOutput.uid)==-1 ? playerOutput.uid : 0;
                                                var title =  'New Match';
                                                var body =  "You are invited to play a match with your team";
                                                var type = 1; 
                                                sendpush(to, title, body, type) 
                                            }
                                        }) 
                                    }
                                })
    
                            }else{

                                for(let key of JSON.parse(req.body.team1_player_ids)){

                                    var newReqForInvitaion1 = { 
                                        matchId: match._id,
                                        type: 2,	
                                        playerId: key,
                                        name: req.body.team1_name
                                    }

                                    var newMatchInvites = new matchInvites(newReqForInvitaion1)

                                    var toId = key;
                                    var fromId = req.body._id;
                                    var params = {match_id: match._id}
                      
                                    add_notification(fromId,toId, 6 ,params);

                                    newMatchInvites.save(function(err, matchSuccess1){

                                        if(matchSuccess1!=null){

                                            Player.findOne({_id: key}, function(err, playerOutput){

                                                if(playerOutput!=null){
                                                    console.log('playerOutput.uid',playerOutput.uid)
                                                    var to =  errors.indexOf(playerOutput.uid)==-1 ? playerOutput.uid : 0;
                                                    var title =  'New Match';
                                                    var body =  "You are invited to play a match";
                                                    var type = 1; 
                                                    sendpush(to, title, body, type) 
                                                }
                                            })
                                        }
                                    });

                                }
                            }


                            if(req.body.team_2_type==0){
                                res.send({
                                    msg: 'Match is added',
                                    status: 1,
                                    data: match
                                });
                            }

                        }

                         ////req.body.team_1_type!=0


                         ////req.body.team_2_type!=0

                         if(req.body.team_2_type!=0){

                            if(req.body.team_2_type==1){
                             
                                var newReqForInvitaion2 = {
                                    matchId: match._id,
                                    type: 1,	
                                    captainId: team2Details.player_id,
                                    name: req.body.team2_name
                                }

                                var newMatchInvites2 = new matchInvites(newReqForInvitaion2)

                                var toId =  team2Details.player_id;
                                var fromId = req.body._id;
                                var params = {match_id: match._id}
                  
                                add_notification(fromId,toId, 333 ,params);


                                newMatchInvites2.save(function(err, matchSuccess2){

                                    if(matchSuccess2!=null){
                                        Player.findOne({_id: team2Details.player_id}, function(err, playerOutput){

                                            if(playerOutput!=null){
                                                console.log('playerOutput.uid',playerOutput.uid)
                                                var to =  errors.indexOf(playerOutput.uid)==-1 ? playerOutput.uid : 0;
                                                var title =  'New Match';
                                                var body =  "You are invited to play a match with your team";
                                                var type = 1; 
                                                sendpush(to, title, body, type) 
                                            }
                                        }) 
                                    }
                                })
    
                            }else{

                                for(let key1 of JSON.parse(req.body.team2_player_ids)){

                                    var newReqForInvitaion2 = {
                                        matchId: match._id,
                                        type: 2,	
                                        playerId: key1,
                                        name: req.body.team2_name
                                    }

                                    var newMatchInvites2 = new matchInvites(newReqForInvitaion2)

                                    var toId = key1;
                                    var fromId = req.body._id;
                                    var params = {match_id: match._id}
                      
                                    add_notification(fromId,toId, 6 ,params);


                                    newMatchInvites2.save(function(err, matchSuccess2){

                                        if(matchSuccess2!=null){

                                            Player.findOne({_id: key1}, function(err, playerOutput){

                                                if(playerOutput!=null){
                                                    console.log('playerOutput.uid',playerOutput)
                                                    var to =  errors.indexOf(playerOutput.uid)==-1 ? playerOutput.uid : 0;
                                                    var title =  'New Match';
                                                    var body =  "You are invited to play a match";
                                                    var type = 1; 
                                                    sendpush(to, title, body, type) 
                                                }
                                            })
                                        }
                                    });

                                }
                            }

                            res.send({
                                msg: 'Match is added',
                                status: 1,
                                data: match
                            });
                        }


                        ////req.body.team_2_type!=0

                        if(req.body.team_2_type==0 && req.body.team_1_type==0){
                            res.send({
                                msg: 'Match is added',
                                status: 1,
                                data: match
                            });
                        }

                
                   }else{

                    res.send({
                        status: 0,
                    });

                   }
                });


            } else {
                res.send({
                    msg: 'Please update your property details before adding match',
                    status: 3,
                    data: null
                });


            }



        } else {

            res.send({
                msg: 'This time slot is already taken',
                status: 4,
                data: null
            });

        }
    }
}

exports.todayMatches = async function (req, res) {


    var time = new Date();
var hours = time.getHours()
var mins = time.getMinutes()

var day = time.getDate();
var month = time.getMonth() + 1;  
var year = time.getFullYear();
if (day < 10) {
day = '0' + day;
}
if (month < 10) {
month = '0' + month;
}

var currentDate = year+'-'+month+'-'+day

if(hours.toString().length<2){
    hours= '0'+hours;
}

if(hours.toString().length<2){
hours= '0'+hours;
}

if(mins.toString().length<2){
mins= '0'+mins;
}

var currentTime = hours+':'+mins

   
    var ids = [req.body._id]

    var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

    var match_ids = [];
    if(joinIds.length!=0){
   
        for(let key of joinIds){
            match_ids.push(key.match_id);
        }

    }

  

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

    var owners = await Followers.find({ "player_id": {"$in": ids}});

    var owner_id=[];
 
    if(owners.length!=0){

        for(let key of owners){
            owner_id.push(key.owner_id)

        }

    }
  

    Match.find({$or: [{ "owner_id": {"$in": owner_id}, date: dateStr , status: 1}, {_id: {$in : match_ids}, date: dateStr , status: 1}]},function(err, match){
   
        if (match.length == 0) {
            res.send({
                msg: 'no data',
                status: 0,
                data: []
            });
        } else {

            var i = 0;
            var DataArray=[]

            for (let key of match) {

                Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                    var dict= { 

                        date: key.date,
                        etime:  key.etime,
                        displayEndTime: convert24to12(key.etime),
                        fullday: key.fullday,
                        gender:  key.gender,
                        location:  key.location,
                        name:  key.name,
                        owner_id:  key.owner_id,
                        paid:  key.paid,
                        players:  key.players,
                        request_match:  key.request_match,
                        status:  key.status,
                        stime: key.stime,
                        displayStartTime: convert24to12(key.stime),
                        team1_name:  key.team1_name,
                        team1_player_ids:  key.team1_player_ids,
                        team2_name:  key.team2_name,
                        team2_player_ids:  key.team2_player_ids,
                        team_1_type:  key.team_1_type,
                        team_2_type: key.team_2_type,
                        _id: key._id,
                        level: key.level,
                        seats: playersLeft(key.players, key.team1_team_id, key.team2_team_id, key.team1_player_ids.length, key.team2_player_ids.length,  key.team3_player_ids.length),
                        matchStatus: matchStatus(key.date, key.stime, key.isCancelled, key.end_day, key.etime)
                    }


    function playersLeft(players, team1_id, team2_id, team1_players, team2_players, team3_players){

                        ///count vacant seats
                        var totalCount;
                        totalCount = players
                        if(errors.indexOf(team1_id)==-1 && errors.indexOf(team2_id)==-1){
                        totalCount = 'Game Full';

                        
                        }else{

                        if(errors.indexOf(team1_id)==-1){
                            
                            totalCount =  totalCount/2;
                        }

                        if(errors.indexOf(team2_id)==-1){
                           
                            totalCount =  totalCount/2;
                        }

                        }


                        if(errors.indexOf(team1_id) >= 0 && team1_players!=0 || errors.indexOf(team2_id)>=0 && team2_players!=0){

                        console.log('4 count: '+ totalCount)


                        if(errors.indexOf(team1_id)>=0 && team1_players!=0){
                        

                        totalCount = totalCount - team1_players

                        
                        }


                        if(errors.indexOf(team2_id)>=0 && team2_players!=0){

                        totalCount = totalCount - team2_players
                         
                        }

                        }



                        if(team3_players!=0){
                       
                        totalCount = totalCount - team3_players;
                        

                        }



                        if(totalCount <= 0){

                        totalCount = 'Game Full';

                        }else{

                        if(totalCount != 'Game Full'){
                            totalCount = totalCount <= 1 ? totalCount+' Spot Left': totalCount+' Spots Left';
                        }
                        
                        }

                        ///count vacant seats

                        return totalCount;
                    }

                    function matchStatus(matchDate, matchSTime, isCancelled, matchEnd_day, matchEtime){
                 
                        if(currentDate >= matchDate  && currentTime > matchSTime && isCancelled == 2 &&  currentTime < matchEtime){
                    
                            return 'Game started'
                           
                        }else if(currentDate == matchEnd_day.split(' ')[0]  &&  currentTime > matchEtime && isCancelled == 2){
                          
                           return 'Game completed'
                        }else if(currentDate > matchEnd_day.split(' ')[0] && isCancelled == 2){
                            alert(currentDate +' '+matchEnd_day.split(' ')[0])
                           
                            return 'Game completed'
                        }else if(isCancelled == 1){
                       
                            return 'Game cancelled'
                        }else{
                    
                            return 'no'
                    
                        }
                    
                    }

                    if(join == null){
                        dict['status']= '0'

                    }else{
                        dict['status']= join.player_id.length;

                    }
                    DataArray.push(dict);

                    i++;
                    if (match.length == i) {

                        res.send({
                            msg: 'match list',
                            status: 1,
                            data: arraySort(DataArray,  ['date','stime'], {reverse: false}) 
                        });
                    }
                });


            }
        }
        
    })

}


///owner's match//
exports.ownerTodayMatches = async function (req, res) {


            var time = new Date();
            var hours = time.getHours()
            var mins = time.getMinutes()
        
            var day = time.getDate();
            var month = time.getMonth() + 1;  
            var year = time.getFullYear();
            if (day < 10) {
            day = '0' + day;
            }
            if (month < 10) {
            month = '0' + month;
            }

            var currentDate = year+'-'+month+'-'+day

            if(hours.toString().length<2){
                hours= '0'+hours;
            }

            if(hours.toString().length<2){
            hours= '0'+hours;
            }

            if(mins.toString().length<2){
            mins= '0'+mins;
            }

            var currentTime = hours+':'+mins



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
 

    Match.find({ "owner_id": req.body._id, date: { $eq: dateStr }, status: 1},function(err, match){
 
        if (match.length == 0) {
            res.send({
                msg: 'no data',
                status: 0,
                data: []
            });
        } else {

            var i = 0;
            var DataArray=[]

            for (let key of match) {

                Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                    var dict = { 
                        date:  key.date,
                        displayEndTime: convert24to12(key.etime),
                        etime: key.etime,
                        fullday: key.fullday , 
                        gender:  key.gender,
                        location:  key.location,
                        name:  key.name,
                        owner_id:  key.owner_id,
                        paid:  key.paid,
                        players:  key.players,
                        request_match:  key.request_match,
                        status:  key.status,
                        displayStartTime: convert24to12(key.stime),
                        stime: key.stime,
                        team1_name:  key.team1_name,
                        team1_player_ids:  key.team1_player_ids,
                        team2_name:  key.team2_name,
                        team2_player_ids:  key.team2_player_ids,
                        team_1_type:  key.team_1_type,
                        team_2_type: key.team_2_type,
                        _id: key._id,
                        level: key.level,
                        seats: playersLeft(key.players, key.team1_team_id, key.team2_team_id, key.team1_player_ids.length, key.team2_player_ids.length,  key.team3_player_ids.length),
                        matchStatus: matchStatus(key.date, key.stime, key.isCancelled, key.end_day, key.etime)
                    }

                    function playersLeft(players, team1_id, team2_id, team1_players, team2_players, team3_players){

                        ///count vacant seats
                          var totalCount;
                          totalCount = players
                          if(errors.indexOf(team1_id)==-1 && errors.indexOf(team2_id)==-1){
                            totalCount = 'Game Full';
                
                            
                          }else{
                  
                            if(errors.indexOf(team1_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                            if(errors.indexOf(team2_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                          }
                
                
                          if(errors.indexOf(team1_id) >= 0 && team1_players!=0 || errors.indexOf(team2_id)>=0 && team2_players!=0){
                
                            
                
                   
                          if(errors.indexOf(team1_id)>=0 && team1_players!=0){
                           
                
                            totalCount = totalCount - team1_players
                
                            
                          }
                
                
                          if(errors.indexOf(team2_id)>=0 && team2_players!=0){
                          
                            totalCount = totalCount - team2_players
                            
                          }
                
                          }
                
                          
                
                          if(team3_players!=0){
                            
                            totalCount = totalCount - team3_players;
                           
                  
                          }
                
                         
                  
                          if(totalCount <= 0){
                  
                            totalCount = 'Game Full';
                  
                          }else{
                
                            if(totalCount != 'Game Full'){
                              totalCount = totalCount <= 1 ? totalCount+' Spot Left': totalCount+' Spots Left';
                            }
                           
                          }
                    
                        ///count vacant seats

                        return totalCount;
                
                                    }


                     function matchStatus(matchDate, matchSTime, isCancelled, matchEnd_day, matchEtime){
                 
                                if(currentDate >= matchDate  && currentTime > matchSTime && isCancelled == 2 && currentTime < matchEtime){
                          
                                    return 'Game started'
                                   
                                }else if(currentDate == matchEnd_day.split(' ')[0]  &&  currentTime > matchEtime && isCancelled == 2){
                                  
                                   return 'Game completed'
                                
                                }else if(currentDate > matchEnd_day.split(' ')[0] && isCancelled == 2){
                                    alert(currentDate +' '+matchEnd_day.split(' ')[0])
                                   
                                    return 'Game completed'
                               
                                }else if(isCancelled == 1){
                               
                                    return 'Game cancelled'
                               
                                }else{

                                    return 'no'

                                }
             
                     }

                    if(join == null){
                        dict['status']= '0'

                    }else{
                        dict['status']= join.player_id.length;

                    }
                    DataArray.push(dict);

                    i++;
                    if (match.length == i) {

                        res.send({
                            msg: 'match list',
                            status: 1,
                            data: arraySort(DataArray,  ['date','stime'], {reverse: false}) 
              
                        });
                    }
                });


            }
        }
        





    })

}



///owner's match//
exports.ownerUpcomingMatches = async function (req, res) {



    var time = new Date();
    var hours = time.getHours()
    var mins = time.getMinutes()

    var day = time.getDate();
    var month = time.getMonth() + 1;  
    var year = time.getFullYear();
    if (day < 10) {
    day = '0' + day;
    }
    if (month < 10) {
    month = '0' + month;
    }

    var currentDate = year+'-'+month+'-'+day

    if(hours.toString().length<2){
        hours= '0'+hours;
    }

    if(hours.toString().length<2){
    hours= '0'+hours;
    }

    if(mins.toString().length<2){
    mins= '0'+mins;
    }

    var currentTime = hours+':'+mins

    

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
 

    Match.find({ "owner_id": req.body._id, date: { $gt: dateStr }, status: 1},function(err, match){
 
        if (match.length == 0) {
            res.send({
                msg: 'no data',
                status: 0,
                data: []
            });
        } else {

            var i = 0;
            var DataArray=[]

            for (let key of match) {

                Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                    var dict= { 

                        date: key.date,
                        displayEndTime: convert24to12(key.etime),
                        etime: key.etime,
                        fullday: key.fullday,
                        gender:  key.gender,
                        location:  key.location,
                        name:  key.name,
                        owner_id:  key.owner_id,
                        paid:  key.paid,
                        players:  key.players,
                        request_match:  key.request_match,
                        status:  key.status,
                        displayStartTime: convert24to12(key.stime),
                        stime: convert24to12(key.stime),
                        team1_name:  key.team1_name,
                        team1_player_ids:  key.team1_player_ids,
                        team2_name:  key.team2_name,
                        team2_player_ids:  key.team2_player_ids,
                        team_1_type:  key.team_1_type,
                        team_2_type: key.team_2_type,
                        _id: key._id,
                        level: key.level,
                        seats: playersLeft(key.players, key.team1_team_id, key.team2_team_id, key.team1_player_ids.length, key.team2_player_ids.length,  key.team3_player_ids.length),
                        matchStatus: matchStatus(key.date, key.stime, key.isCancelled, key.end_day, key.etime)
                    }


                    function playersLeft(players, team1_id, team2_id, team1_players, team2_players, team3_players){

                        ///count vacant seats
                          var totalCount;
                          totalCount = players
                          if(errors.indexOf(team1_id)==-1 && errors.indexOf(team2_id)==-1){
                            totalCount = 'Game Full';
                
                            
                          }else{
                  
                            if(errors.indexOf(team1_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                            if(errors.indexOf(team2_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                          }
                
                
                          if(errors.indexOf(team1_id) >= 0 && team1_players!=0 || errors.indexOf(team2_id)>=0 && team2_players!=0){
                
                            console.log('4 count: '+ totalCount)
                
                   
                          if(errors.indexOf(team1_id)>=0 && team1_players!=0){
                           
                
                            totalCount = totalCount - team1_players
                
                            
                          }
                
                
                          if(errors.indexOf(team2_id)>=0 && team2_players!=0){
                          
                            totalCount = totalCount - team2_players
                            
                          }
                
                          }
                
                          if(team3_players!=0){
                             
                            totalCount = totalCount - team3_players;
                            
                  
                          }
                
                         
                  
                          if(totalCount <= 0){
                  
                            totalCount = 'Game Full';
                  
                          }else{
                
                            if(totalCount != 'Game Full'){
                              totalCount = totalCount <= 1 ? totalCount+' Spot Left': totalCount+' Spots Left';
                            }
                           
                          }
                    
                        ///count vacant seats

                        return totalCount;
                
                                    }


                function matchStatus(matchDate, matchSTime, isCancelled, matchEnd_day, matchEtime){
                 
                                        if(currentDate >= matchDate  && currentTime > matchSTime && isCancelled == 2 && currentTime < matchEtime){
                                  
                                            return 'Game started'
                                           
                                        }else if(currentDate == matchEnd_day.split(' ')[0]  &&  currentTime > matchEtime && isCancelled == 2){
                                          
                                           return 'Game completed'
                                        }else if(currentDate > matchEnd_day.split(' ')[0] && isCancelled == 2){
                                            alert(currentDate +' '+matchEnd_day.split(' ')[0])
                                           
                                            return 'Game completed'
                                        }else if(isCancelled == 1){
                                       
                                            return 'Game cancelled'
                                        }else{
        
                                            return 'no'
        
                                        }
                     
                             }



                    if(join == null){
                        dict['status']= '0'

                    }else{
                        dict['status']= join.player_id.length;

                    }
                    DataArray.push(dict);

                    i++;
                    if (match.length == i) {

                        res.send({
                            msg: 'match list',
                            status: 1,
                            data: arraySort(DataArray,  ['date','stime'], {reverse: false}) 
                        });
                    }
                });


            }
        }
        
    })

}


///owner's match//
exports.ownersearchMatches = async function (req, res) {
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
 
    Match.find(
  
        {  $and: [
            { $or: [{ date: { $regex: req.body.keyword, $options: 'i' } },{ name: { $regex: req.body.keyword, $options: 'i' } }, { etime: { $regex: req.body.keyword, $options: 'i' } }, { stime: { $regex: req.body.keyword, $options: 'i' } }, { location: { $regex: req.body.keyword, $options: 'i' } }] },
            { date: { $gte: dateStr } },
            { status: 1 },
            { "owner_id": req.body._id, date: { $gte: dateStr }}
        ]
        }
    
        ,function(err, match){
    
            if (match.length == 0) {
                res.send({
                    msg: 'no data',
                    status: 0,
                    data: []
                });
            } else {

                var i = 0;
                var DataArray=[]

                for (let key of match) {

                    Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                        var dict= { 

                            date: key.date,
                            etime:  key.etime,
                            fullday: key.fullday,
                            gender:  key.gender,
                            location:  key.location,
                            name:  key.name,
                            owner_id:  key.owner_id,
                            paid:  key.paid,
                            players:  key.players,
                            request_match:  key.request_match,
                            status:  key.status,
                            stime: key.stime,
                            team1_name:  key.team1_name,
                            team1_player_ids:  key.team1_player_ids,
                            team2_name:  key.team2_name,
                            team2_player_ids:  key.team2_player_ids,
                            team_1_type:  key.team_1_type,
                            team_2_type: key.team_2_type,
                            _id: key._id
                        }

                        if(join == null){
                            dict['status']= '0'

                        }else{
                            dict['status']= join.player_id.length;

                        }
                        DataArray.push(dict);

                        i++;
                        if (match.length == i) {

                            res.send({
                                msg: 'match list',
                                status: 1,
                                data: DataArray
                            });
                        }
                    });


                }
            }
        
        })

}

exports.upcomingMatches = async function (req, res) {

var time = new Date();
var hours = time.getHours()
var mins = time.getMinutes()
var day = time.getDate();
var month = time.getMonth() + 1;  
var year = time.getFullYear();
if (day < 10) {
day = '0' + day;
}
if (month < 10) {
month = '0' + month;
}

var currentDate = year+'-'+month+'-'+day

if(hours.toString().length<2){
    hours= '0'+hours;
}

if(hours.toString().length<2){
hours= '0'+hours;
}

if(mins.toString().length<2){
mins= '0'+mins;
}

var currentTime = hours+':'+mins


    var ids = [req.body._id]

    var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

    var match_ids = [];
    if(joinIds.length!=0){
   
        for(let key of joinIds){
            match_ids.push(key.match_id);
        }

    }

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


    var ids=[req.body._id];


    var owners = await Followers.find({ "player_id": {"$in": ids}});
    var owner_id=[];
 
    if(owners.length!=0){

        for(let key of owners){
            owner_id.push(key.owner_id)

        }

    }


    Match.find({$or: [{ "owner_id": {"$in": owner_id}, date: { $gt: dateStr } , status: 1}, {_id: {$in : match_ids}, date: { $gt: dateStr } , status: 1}]},function(err, match){

        if(match.length!=0){
            var i = 0;
            var totalArray = [];
            for (let key of match) {

                Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                    var dic = {
                        _id: key._id,
                        updatedAt: key.updatedAt,
                        createdAt: key.createdAt,
                        owner_id: key.owner_id,
                        name: key.name,
                        location: key.location,
                        date: key.date,
                        stime: key.stime,
                        displayStartTime: convert24to12(key.stime),
                        level: key.level,
                        displayEndTime: convert24to12(key.etime),
                        etime: key.etime,
                        players: key.players,
                        cover: key.cover,
                        team1: key.team1,
                        team2: key.team2,
                        gender:  key.gender,
                        seats: playersLeft(key.players, key.team1_team_id, key.team2_team_id, key.team1_player_ids.length, key.team2_player_ids.length,  key.team3_player_ids.length),
                        matchStatus: matchStatus(key.date, key.stime, key.isCancelled, key.end_day, key.etime)
                    }


                    function playersLeft(players, team1_id, team2_id, team1_players, team2_players, team3_players){

                        ///count vacant seats
                          var totalCount;
                          totalCount = players
                          if(errors.indexOf(team1_id)==-1 && errors.indexOf(team2_id)==-1){
                            totalCount = 'Game Full';
                
                             
                          }else{
                  
                            if(errors.indexOf(team1_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                            if(errors.indexOf(team2_id)==-1){
                              
                              totalCount =  totalCount/2;
                            }
                  
                          }
                
                
                          if(errors.indexOf(team1_id) >= 0 && team1_players!=0 || errors.indexOf(team2_id)>=0 && team2_players!=0){
                
                            console.log('4 count: '+ totalCount)
                
                   
                          if(errors.indexOf(team1_id)>=0 && team1_players!=0){
                           
                
                            totalCount = totalCount - team1_players
                
                            
                          }
                
                
                          if(errors.indexOf(team2_id)>=0 && team2_players!=0){
                          
                            totalCount = totalCount - team2_players
                            
                          }
                
                          }
                
                          
                
                          if(team3_players!=0){
                           
                            totalCount = totalCount - team3_players;
                            
                  
                          }
                
                         
                  
                          if(totalCount <= 0){
                  
                            totalCount = 'Game Full';
                  
                          }else{
                
                            if(totalCount != 'Game Full'){
                              totalCount = totalCount <= 1 ? totalCount+' Spot Left': totalCount+' Spots Left';
                            }
                           
                          }
                    
                        ///count vacant seats

                        return totalCount;
                
                                    }

                            function matchStatus(matchDate, matchSTime, isCancelled, matchEnd_day, matchEtime){
                 
                                        if(currentDate >= matchDate  && currentTime > matchSTime && isCancelled == 2 && currentTime < matchEtime){
                                    
                                            return 'Game started'
                                           
                                        }else if(currentDate == matchEnd_day.split(' ')[0]  &&  currentTime > matchEtime && isCancelled == 2){
                                          
                                           return 'Game completed'
                                        }else if(currentDate > matchEnd_day.split(' ')[0] && isCancelled == 2){
                                            alert(currentDate +' '+matchEnd_day.split(' ')[0])
                                           
                                            return 'Game completed'
                                        }else if(isCancelled == 1){
                                       
                                            return 'Game cancelled'
                                        }else{
                                    
                                            return 'no'
                                    
                                        }
                                    
                                    }

                                    
                    if (join == null) dic["status"] = '0';
                    else dic["status"] = join.player_id.length;

                    totalArray.push(dic);
                    i++;
                    if (match.length == i) {

                        res.send({
                            msg: 'match list',
                            status: 1,
                            data: arraySort(totalArray,  ['date','stime'], {reverse: false}) 
                        });
                    }
                });
            }

        }else{
            res.send({
                msg: 'No match',
                status: 0,
                data: []
            });


        }

    });

}


exports.searchmatch = async function (req, res) {
 

    var ids = [req.body._id]

    var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

    var match_ids = [];
    if(joinIds.length!=0){
 
        for(let key of joinIds){
            match_ids.push(key.match_id);
        }

    }

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


    var ids=[req.body._id];


    var owners = await Followers.find({ "player_id": {"$in": ids}});
    var owner_id=[];

    if(owners.length!=0){

        for(let key of owners){
            owner_id.push(key.owner_id)

        }

    }

    var condition1 = {"owner_id": {"$in": owner_id}, date: { $gte: dateStr } , status: 1};
    var condition2 = {_id: {$in : match_ids}, date: { $gte: dateStr } , status: 1};
    if(errors.indexOf(req.body.keyword) == -1){
        condition1['$or'] = [ 
            {name : { '$regex' : req.body.keyword, '$options' : 'i' }},
            {etime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
            {stime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
            {location : { '$regex' : req.body.keyword, '$options' : 'i' }} 
        ]
        condition2['$or'] = [ 
            {name : { '$regex' : req.body.keyword, '$options' : 'i' }},
            {etime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
            {stime : { '$regex' : req.body.keyword, '$options' : 'i' }}, 
            {location : { '$regex' : req.body.keyword, '$options' : 'i' }} 
        ]
    }


    Match.find({$or: [
        condition1, condition2
    ]
    },function(err, match){

        if(match.length!=0){
            var i = 0;
            var totalArray = [];
            for (let key of match) {

                Joinmatch.findOne({ match_id: key._id }, function (err, join) {

                    var dic = {
                        _id: key._id,
                        updatedAt: key.updatedAt,
                        createdAt: key.createdAt,
                        owner_id: key.owner_id,
                        name: key.name,
                        location: key.location,
                        date: key.date,
                        stime: key.stime,
                        etime: key.etime,
                        players: key.players,
                        cover: key.cover,
                        team1: key.team1,
                        team2: key.team2,
                        gender:  key.gender,

                    }
                    if (join == null) dic["status"] = '0';
                    else dic["status"] = join.player_id.length;

                    totalArray.push(dic);
                    i++;
                    if (match.length == i) {

                        res.send({
                            msg: 'match list',
                            status: 1,
                            data: totalArray
                        });
                    }
                });
            }

        }else{
            res.send({
                msg: 'No match',
                status: 0,
                data: []
            });


        }

    });


    ////////

}


exports.myupcomingMatches = function (req, res) {


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


    Match.find({ owner_id: req.body._id, date: { $gt: dateStr }, status: 1 }, async function (err, match) {

        if (match.length == 0) {
            res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: null
            });
        } else {

    

            var i = 0;
            var  resData =[]
            for (let key of match) {


                var Joined = await Joinmatch.findOne({match_id : key._id});
        
                var dict = await {
                    alert_sent: key.alert_sent,
                    createdAt: key.createdAt,
                    date: key.date,
                    etime: key.etime,
                    fullday: key.fullday,
                    gender: key.gender,
                    location: key.location,
                    name: key.name,
                    owner_id: key.owner_id,
                    paid: key.paid,
                    players: key.players,
                    request_match: key.request_match,
                    status: Joined!=null ? Joined.player_id.length : 0,
                    stime: key.stime,
                    team1: key.team1,
                    team1_player_ids: key.team1_player_ids,
                    team2: key.team2,
                    team2_player_ids: key.team2_player_ids,
                    team2_team_id: key.team2_team_id,
                    team_1_type: key.team_1_type,
                    team_2_type: key.team_2_type,
                    updatedAt: key.updatedAt,
                    _id: key._id,
                }

                resData.push(dict);
                i++;
                if (i == match.length) {
                    res.send({
                        msg: 'requests',
                        status: 1,
                        data: arraySort(resData,  ['date','stime'], {reverse: false})
                    });

                }

            }

        }

    });

}

////owner prevous matches////
exports.ownerMyPreviousMatches = function (req, res) {

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


    Match.find({ owner_id: req.body._id, date: { $lt: dateStr }, status: 1 }, async function (err, match) {

        if (match.length == 0) {
            res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: null
            });
        } else {

    

            var i = 0;
            var  resData =[]
            for (let key of match) {


                var Joined = await Joinmatch.findOne({match_id : key._id});
        
                var dict = await {
                    alert_sent: key.alert_sent,
                    createdAt: key.createdAt,
                    date: key.date,
                    etime: key.etime,
                    fullday: key.fullday,
                    gender: key.gender,
                    location: key.location,
                    name: key.name,
                    owner_id: key.owner_id,
                    paid: key.paid,
                    players: key.players,
                    request_match: key.request_match,
                    status: Joined!=null ? Joined.player_id.length : 0,
                    stime: key.stime,
                    displayTime:  convert24to12(key.stime),
                    team1: key.team1,
                    team1_player_ids: key.team1_player_ids,
                    team2: key.team2,
                    team2_player_ids: key.team2_player_ids,
                    team2_team_id: key.team2_team_id,
                    team_1_type: key.team_1_type,
                    team_2_type: key.team_2_type,
                    updatedAt: key.updatedAt,
                    _id: key._id,
                }

                resData.push(dict);
                i++;
                if (i == match.length) {
                    res.send({
                        msg: 'requests',
                        status: 1,
                        data: arraySort(resData,  ['date','stime'], {reverse: false})
           
                    });

                }

            }

        }

    });

}


////owner pre matches///////

exports.mypreviousMatches = async (req, res) => {


    var ids =[req.body._id]

    var joinIds = await Joinmatch.find({ "player_id": {"$in": ids}});

    var match_ids = [];
    if(joinIds.length!=0){
   
        for(let key of joinIds){
            match_ids.push(key.match_id);
        }

    }

  
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
  
    ////////////////////

    var ids=[req.body._id];
    var owners = await Followers.find({ "player_id": {"$in": ids}});

    if(owners.length!=0){
        var owner_id=[];
        var cont= 0;
        for(let key of owners){
            owner_id.push(key.owner_id);
            cont++;
    
            if(cont==owners.length){

                Match.find( {$or: [{ owner_id: req.body._id, date: { $lt: dateStr }, status: 1 }, {_id: {$in : match_ids}, date: { $lt: dateStr } , status: 1} ]}, function (err, match) {

                    if (match.length == 0) {
                        res.send({
                            msg: 'Internal Server Error, Try again',
                            status: 0,
                            data: null
                        });
                    } else {

                    var myupmatches=[];
                    var cont=0;
                     for(let key of match){
                       
                         Joinmatch.findOne({match_id : key._id}, function(err, result) { 
                       
                         var dist = {
      
                              alert_sent: key.alert_sent,
                              createdAt: key.createdAt,
                              date: key.date,
                              duration: key.duration,
                              end_day: key.end_day,
                              etime: key.etime,
                              fullday: key.fullday,
                              gender: key.gender,
                              is_near: key.is_near,
                              joined: key.joined,
                              location: key.location,
                              name: key.name,
                              owner_id: key.owner_id,
                              paid: key.paid,
                              players: result.player_id.length,
                              request_match: key.request_match,
                              slotted: key.slotted,
                              start_day: key.start_day,
                              status: key.status,
                              stime: key.stime,
                              displayTime:  convert24to12(key.stime),
                              team1: key.team1,
                              team1_player_ids: key.team1_player_ids,
                              team1_team_id: key.team1_team_id,
                              team2: key.team2,
                              team2_player_ids: key.team2_player_ids,
                              team2_team_id: key.team2_team_id,
                              team3_player_ids: key.team3_player_ids,
                              team_1_type: key.team_1_type,
                              team_2_type: key.team_2_type,
                              updatedAt: key.updatedAt,
                              _id: key._id,
                        }
      
                      myupmatches.push(dist);
      
                        cont++;
            
                      if(cont==match.length){
                      
                        res.send({
                        msg: 'myupcoming messages',
                        status: 1,
                        data: myupmatches
                       }); 
      
                      }                
                         });
                     
  
                 
      
                   
      
                     } 














        
                        // var i = 0;
        
                        // match.forEach(function (key) {
        
                        //     Player.findOne({ match_id: key._id }, function (err, player) {
        
                        //         MatchResults.findOne({ match_id: key._id }, function (err, results) {
        
                        //             if (player != null) { match[i]['status'] = player.player_id.length; }
                        //             else { match[i]['status'] = 0; }
        
                        //             if (results != null) { match[i]['team1'] = '1'; }
                        //             else { match[i]['team1'] = '0'; }
        
                        //             if (match[i]['team1'] == '0' || match[i]['team1'] == '1') {
        
                        //                 i++;
                        //             }
        
                        //             if (i == match.length) {
                        //                 res.send({
                        //                     msg: 'requests',
                        //                     status: 1,
                        //                     data: match
                        //                 });
                        //             }
                        //         });
                        //     });
                        // });
                    }
                });
 

            }
          
        }
        
        
        
    }else{

        res.send({
            msg: 'No match',
            status: 0,
            data: []
        });

    }



    ////////////////////

}

exports.updateProperty = (req, res) => {

    var upload = multer({ storage: uploadproperty }).single('file');
    upload(req, res, function (err) {

        User.findOne({ email: req.body.email }, function (err, owner) {
            if (owner == null) {
                res.send({
                    msg: 'No owner exists for this email',
                    status: 2,
                    data: null
                });
            } else {
                var id = owner._id;
                Property.findOne({ owner_id: id }, function (err, match) {
                    var data = {
                        owner_id: id,
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

                        Property.update({ owner_id: id }, { $set: data }, { new: true }, function (err, match) {
       
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
            }
        });
    });

}


exports.deletePropertyByID = function (req, res) {

    Property.update({ _id: req.body.id }, { $set: {status: '0'} }, { new: true }, function (err, match) {
       
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


exports.getProperty = function (req, res) {

    Property.findOne({ owner_id: req.body._id }, function (err, match) {

        if (match == null) {
            res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: null
            });
        } else {
            res.send({
                msg: 'property details',
                status: 1,
                data: match

            });

        }

    });

}

exports.getPropertyById = function (req, res) {

    Property.findOne({ _id: req.body._id }, function (err, match) {

        if (match == null) {
            res.send({
                msg: 'Internal Server Error, Try again',
                status: 0,
                data: null
            });
        } else {
            res.send({
                msg: 'property details',
                status: 1,
                data: match

            });

        }

    });

}


exports.cancelGameManually = function (req, res){
    Match.update({ _id: req.body.match_id }, { $set: { isCancelled: 1 } }, { new: true }, function (err, matchUpdate) {

        res.send({
            status: 1,
        });

    });
}

exports.getPropertiesArray = function (req, res) {

    Property.find({ owner_id: req.body._id, status: '1' }, function (err, match) {

        if (match.length==0) {
            res.send({

                status: 0,
                data: null
            });
        } else {
            res.send({
          
                status: 1,
                data: match

            });

        }

    });

}



exports.updatePropertyByOwner = (req, res) => {

    var upload = multer({ storage: uploadproperty }).single('file');
    upload(req, res, function (err) {

        var id = req.body._id;
        Property.findOne({ owner_id: id }, function (err, match) {
            var data = {
                owner_id: id,
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

                Property.update({ owner_id: id }, { $set: data }, { new: true }, function (err, match) {
     
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

}

exports.updatePropertyById = (req, res) => {

    var upload = multer({ storage: uploadproperty }).single('file');
    upload(req, res, function (err) {

        var id = req.body._id;
        var ownerId = req.body.owner_id;
        Property.findOne({ _id: id }, function (err, match) {
            var data = {
                owner_id: ownerId,
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

                Property.update({ _id: id }, { $set: data }, { new: true }, function (err, match) {
     
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

}

function add_notification(fromId, toId, type, data_params) {
    var new_notis = new Notifications({
        fromId: fromId,
        toId: toId,
        type: type,
        data_params: data_params,
        isRead: '0',
    });
    new_notis.save();
}


exports.fcmTest = async function(req, res)  {

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

function convert24to12(time){
            var  dt = time
            var hours = dt.split(':')[0]
            var AmOrPm = hours >= 12 ? 'pm' : 'am';
            hours = (hours % 12) || 12;
            var minutes = dt.split(':')[1]
            var finalTime = hours + ":" + minutes + " " + AmOrPm; 
            return finalTime  
}