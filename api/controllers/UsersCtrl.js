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

//functions logic
async function sendOTP(req, res, next) {

 
	try {
		const {phone} = req.body;
    if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone number." });
    console.log('passed');
   
 
	} catch (err) {
		return res.status(401).send({ status: false, msg: "Something Went Wrong.Please Try Again!" });
	}

}


 


 


 