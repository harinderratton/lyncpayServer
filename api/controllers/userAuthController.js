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
multer = require('multer');

 

//tables
var OTPTable = mongoose.model('OTPTable'),
UserTable = mongoose.model('UserTable');

//function Names
exports.sendOTP = sendOTP;
exports.verifiyOTP = verifiyOTP;

//functions logic
async function sendOTP(req, res, next) {

	try {
		const {phone} = req.body;
    if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone number." });
    var OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
    var hashedOTP = passwordHash.generate(OTP);
    const data = {
      phone: phone,
      otp: hashedOTP
    }

    const newData = new OTPTable(data);
    newData.save(function(mongoErr, mongoRes){
      if(mongoErr == null)  return res.json({ status: true, msg: "An OTP is sent to "+ phone, otp: OTP});
      else  return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" });

    })

    
   
	} catch (err) {
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}




async function verifiyOTP(req, res, next) {

	try {
		const {phone, otp} = req.body;

    if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone number." });
    if(errors.indexOf(otp)>=0) return res.json({ status: false, msg: "Please provide the otp." });

    var isOTP = await OTPTable.findOne({phone: phone}, {}, { sort: { 'createdAt' : -1 }});
    var isMatch;

    if(isOTP != null) {

      console.log(isOTP);
      console.log(otp);
      isMatch = passwordHash.verify(Number(otp), isOTP.otp) ?  true : false;

    }
    else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

    if(isMatch) return res.json({ status: false, msg: "Your phone number is verified!" });
    else return res.json({ status: false, msg: "You have provided a wrong OTP!" });

	} catch (err) {
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}


 


 


 