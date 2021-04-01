'use strict';
var constants = require('../constants/constants'),
errors = ['', null, undefined,' null', 'undefined', 0];

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
    throughError('its another message')
 
	} catch (err) {
		return res.status(401).send({ status: false, msg: "Something Went Wrong.Please Try Again!" });
	}

}



async function throughError(msg) {

	try {

    return res.json({ status: false, msg: msg });
 
	} catch (err) {
		return res.status(401).send({ status: false, msg: "Something Went Wrong.Please Try Again!" });
	}

}



 


 