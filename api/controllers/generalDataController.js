'use strict';
var constants = require('../constants/constants'),
errors = ["", null, undefined];

//modules
var mongoose = require('mongoose'),
path = require('path'),
passwordHash = require('password-hash'),
otpGenerator = require('otp-generator'),
FCM = require('fcm-node'),
fcm = new FCM(constants.FCM_SERVER_KEY),
arraySort = require('array-sort'),
NodeGeocoder = require('node-geocoder'),
fs = require('fs'),
sg = require('sendgrid')(constants.SENDGRID_ID),
multer = require('multer'),
filesUpload = require('../logic/uploadFiles')
 

//tables
var GroupTable = mongoose.model('GroupTable'),
UserTable = mongoose.model('UserTable'),
contactInvitationTable = mongoose.model('contactInvitationTable'),
NotificationsTable = mongoose.model('NotificationsTable')

//exported functions
exports.getLyncpayUsers = getLyncpayUsers;
exports.updateUserProfileData = updateUserProfileData;
exports.updateUserAuthPassword = updateUserAuthPassword;
exports.getNonLyncpayUsers = getNonLyncpayUsers;
exports.inviteContactOnLyncpay = inviteContactOnLyncpay;
exports.getUserNotifications = getUserNotifications;

//functions defination

async function getLyncpayUsers(req, res, next) {

	try {
 
        const {myAllNumbers} = req.body;
        if(errors.indexOf(myAllNumbers)>=0) return res.json({ status: false, msg: "Please provide the myAllNumbers." });
        
        var numbers = JSON.parse(myAllNumbers);
        var response = await UserTable.find({ phone: {$in : numbers }});

        if(response.length !=0) {
            var cont = 0;
            var allContacts = [];
            for(let key of response){
                var name =  key.name.split(' ');
                var dist = {
                            city: key.city,
                            country: key.country,
                            createdAt: key.createdAt,
                            email: key.email,
                            emailNotifications: key.emailNotifications,
                            isAccountCompleted: key.isAccountCompleted,
                            name1: name[0].split('')[0].toUpperCase(),
                            name2:  name[1] != undefined ? name[1].split('')[0].toUpperCase() : null,
                            name: (name[0].charAt(0).toUpperCase() + name[0].slice(1)) +' '+ (name[1] != undefined ? name[1].charAt(0).toUpperCase() + name[1].slice(1) : ''),
                            password: key.password,
                            personalised: key.personalised,
                            phone: key.phone,
                            pic: key.pic,
                            pushNotifications: key.pushNotifications,
                            state: key.state,
                            uid: key.uid,
                            updatedAt: key.updatedAt,
                            zip: key.zip,                          
                            _id: key._id,
                }

                allContacts.push(dist);
                cont++;

                if(cont == response.length){
                    return res.json({ status: true, data: allContacts});
                }
                

            }
        }
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
        

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}


//functions defination

async function getNonLyncpayUsers(req, res, next) {

	try {
 
        const {myAllNumbers, userId} = req.body;
        if(errors.indexOf(myAllNumbers)>=0) return res.json({ status: false, msg: "Please provide the myAllNumbers." });
        
        var numbers = JSON.parse(myAllNumbers);

        console.log(numbers);
 

        if(numbers.length !=0) {
            var cont = 0;
            var allContacts = [];
            for(let key of numbers){
  
                var isInvited = await contactInvitationTable.count({ phone:  key, senderId: userId});
                var isLyncpayUser = await UserTable.count({ phone:  key});

                if(isLyncpayUser == 0){
                    
                    var dist = {
                        phone: key,
                        createdAt: key.createdAt,
                        isLyncpayUser: isLyncpayUser,
                        isInvited: isInvited
                    }

                   allContacts.push(dist);
                }


                cont++;

                if(cont == numbers.length){
                    return res.json({ status: true, data: allContacts});
                }
                

            }
        }
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
        

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}




//functions defination

async function inviteContactOnLyncpay(req, res, next) {

	try {
 
        const {phone, userId} = req.body;
        if(errors.indexOf(userId)>=0) return res.json({ status: false, msg: "Please provide the userId." });
        if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone." });

        var step = phone
        var step1 = step.replace(/ /g,'')
        var mystring =  step1.split('-').join('')
        var mystring1 =  mystring.split('(').join('')
        var mystring2 =  mystring1.split(')').join('')
        var mystring3 =  mystring2.split('#').join('')
        var mystring4 =  mystring3.split('#').join('')
        var strLength = mystring4.length
        var final = mystring4.substr(strLength - 10)

        var doesExist = await contactInvitationTable.find({phone: final, senderId: userId})

        if(doesExist.length!=0) return res.json({ status: false, msg: "Already invited!" }); 
        
        var newData = new contactInvitationTable({
            phone: final,
            senderId: userId
        })

        newData.save(function(err, response){

            if(err != null) return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" });
            else return res.json({ status: true, msg: "Invited!" });

        });


	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}



 
async function updateUserProfileData(req, res, next) {

	try {
       console.log(req.params)
        const {id, email, phone} = req.params;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
        if(errors.indexOf(email)>=0) return res.json({ status: false, msg: "Please provide the email." });
        if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone." });

        UserTable.find({email: email, _id: {$ne :id}}, function(err, response){
      
        if(response.length != 0) return res.json({ status: false, msg: 'This email is already in use, Please use another'});
    
          })

        UserTable.find({phone: Number(phone), _id: {$ne :id}}, function(err, response){
    
        if(response.length != 0) return res.json({ status: false, msg: 'This phone is already in use, Please use another'});


        })
 
  
        filesUpload.uploadPic(req, res, function(err){

     
       var newData = {name: req.body.name, phone: phone, email: email}
       if(req.file != undefined) newData['pic'] = req.file.filename

        UserTable.updateOne({_id: id}, newData , function(err, response){

            UserTable.findOne({_id: id}, function(err, userData){
                if(err == null) return res.json({ status: true, msg: "Profile is updated", data: userData});
                else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
            });
        })
   

    } )

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}



async function updateUserAuthPassword(req, res, next) {

	try {
 
        const {id, oldPassword, newPassword} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
        if(errors.indexOf(oldPassword)>=0) return res.json({ status: false, msg: "Please provide the oldPassword." });
        if(errors.indexOf(newPassword)>=0) return res.json({ status: false, msg: "Please provide the newPassword." });

       var userDetails = await UserTable.findOne({_id: id})

       var isMatch = passwordHash.verify(oldPassword, userDetails.password) ?  true : false;

       if(!isMatch) return res.json({ status: false, msg: 'Your current password is wrong.'});


        UserTable.updateOne({_id: id}, {password: passwordHash.generate(newPassword)}, function(err, response){
    
            if(err == null) return res.json({ status: true, msg: 'Your password is updated.'});
            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 


        })
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}


async function getUserNotifications(req, res, next) {

    try {
 
        const {id} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
        
     
        var response = await NotificationsTable.find({ toId: id});

        if(response.length !=0) {
            var cont = 0;
            var allContacts = [];
            for(let key of response){


                if(key.type == 1){

                    var dist = {
                        id: key.id,
                        type: key.type,
                        isRead: key.isRead,
                        from: key.fromId,
                        groupName: key.data_params.groupName
                    }
    
                    allContacts.push(dist);
                }


                if(key.type == 2){

                    var dist = {
                        id: key.id,
                        type: key.type,
                        isRead: key.isRead,
                        from: key.fromId,
                        groupName: key.data_params.groupName,
                        expense: key.data_params.expense,
                    }
    
                    allContacts.push(dist);
                }
                

                cont++;

                if(cont == response.length){
                   
                    return res.json({ status: true, data: arraySort(allContacts, 'date', {reverse: true})});
                }
                

            }
        }
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
        

    } catch (err) {
    console.log('Catch Error', err);
        return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
    }

} 
 