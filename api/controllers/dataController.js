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
exports.getLyncpayUsers = getLyncpayUsers;
 
 
//functions defination

async function getLyncpayUsers(req, res, next) {

	try {
 
        const {myAllNumbers} = req.body;

        console.log(myAllNumbers);
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
                            name1: name[0].charAt(0).toUpperCase() + name[0].slice(1),
                            name2:  name[1] != undefined ? name[1].charAt(0).toUpperCase() + name[1].slice(1) : null,
                            name:  key.name,
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

 