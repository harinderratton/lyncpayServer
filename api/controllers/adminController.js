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
filesUpload = require('../logic/uploadFiles');

//tables
var OTPTable = mongoose.model('OTPTable'),
UserTable = mongoose.model('UserTable'),
AdminTable = mongoose.model('AdminTable');

//exported functions
 
exports.tryLoginAdmin = tryLoginAdmin;
exports.Admin_updateUserProfileData = Admin_updateUserProfileData;
exports.Admin_updateAuthPassword = Admin_updateAuthPassword;
 

//functions logic
 
async function tryLoginAdmin(req, res, next) {


	try {

     
   const {email, password} = req.body;

    if(errors.indexOf(email)>=0) return res.json({ status: false, msg: "Please provide the email." });
    if(errors.indexOf(password)>=0) return res.json({ status: false, msg: "Please provide the password." });
 

    var isUser = await AdminTable.findOne({email: email}, {}, { sort: { 'createdAt' : -1 }});
    
    
    if(isUser!=null) {

      var isMatch = passwordHash.verify(password, isUser.password) ?  true : false;

    }
    else return res.json({ status: false, msg: "Either your email or password is wrong"}); 

    if(isMatch) {

      return res.json({ status: true, msg: "Access permitted", data: isUser});
    }
   
    else return res.json({ status: false, msg: "You have provided wrong password"});

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}




async function Admin_updateUserProfileData(req, res, next) {

	try {

 
     filesUpload.uploadPic(req, res,  function(err){
     
        console.log(req.body)
        const {id, email, phone, name, state, address, country} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
        if(errors.indexOf(email)>=0) return res.json({ status: false, msg: "Please provide the email." });
        if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone." });
        if(errors.indexOf(name)>=0) return res.json({ status: false, msg: "Please provide the name." });
       var newData = {name: req.body.name, phone: phone, email: email, address: address,  country: country, state: state}
       if(req.file != undefined) newData['pic'] = req.file.filename

       AdminTable.updateOne({_id: id}, newData , function(err, response){

        AdminTable.findOne({_id: id}, function(err, userData){
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


async function Admin_updateAuthPassword(req, res, next) {

	try {
 
        const {id, oldPassword, newPassword} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
        if(errors.indexOf(oldPassword)>=0) return res.json({ status: false, msg: "Please provide the oldPassword." });
        if(errors.indexOf(newPassword)>=0) return res.json({ status: false, msg: "Please provide the newPassword." });

       var userDetails = await AdminTable.findOne({_id: id})

       var isMatch = passwordHash.verify(oldPassword, userDetails.password) ?  true : false;

       if(!isMatch) return res.json({ status: false, msg: 'Your current password is wrong.'});


       AdminTable.updateOne({_id: id}, {password: passwordHash.generate(newPassword)}, function(err, response){
    
            if(err == null) return res.json({ status: true, msg: 'Your password is updated.'});
            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 


        })
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}



 