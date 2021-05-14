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
 

//functions logic
 




 


async function tryLoginAdmin(req, res, next) {


    var newAdmin = new AdminTable({
      
        name:  'Lyncpay Admin',
        phone: '9815393101',
        email: 'admin@lyncpay.com', 
        password:  passwordHash.generate('111111')
    })
    newAdmin.save(function(){

    })
    return;

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


 