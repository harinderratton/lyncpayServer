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
var GroupTable = mongoose.model('GroupTable'),
UserTable = mongoose.model('UserTable');

//exported functions
exports.getMyContacts = getMyContacts;
exports.createNewGroup = createNewGroup;
 

async function getMyContacts(req, res, next) {

	try {
 
      const {id} = req.body;
      if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
 
      UserTable.find(function(err, response){

        if(response.length !=0) return res.json({ status: true, data: response});
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

      })
   

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}



async function createNewGroup(req, res, next) {

	try {
 
      const {id, selectedIDS, name} = req.body;
      if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
      if(errors.indexOf(selectedIDS)>=0) return res.json({ status: false, msg: "Please provide the selectedIDS." });
      if(errors.indexOf(name)>=0) return res.json({ status: false, msg: "Please provide the name." });

      var newGroup = new GroupTable({
        admin: id,
        name: name,
        members: JSON.parse(selectedIDS)
      })
 
      newGroup.save(function(err, response){

        if(err == null) return res.json({ status: true, msg: 'Group has been created'});
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

      })
   

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}

 


 


 