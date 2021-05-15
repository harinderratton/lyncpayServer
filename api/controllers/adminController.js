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
AdminTable = mongoose.model('AdminTable'),
GroupTable = mongoose.model('GroupTable');

//exported functions
 
exports.tryLoginAdmin = tryLoginAdmin;
exports.Admin_updateUserProfileData = Admin_updateUserProfileData;
exports.Admin_updateAuthPassword = Admin_updateAuthPassword;
exports.Admin_fetchAllUsers = Admin_fetchAllUsers;
exports.Admin_getUserDetail = Admin_getUserDetail;
exports.Admin_fetchSingleUser = Admin_fetchSingleUser;
exports.Admin_updateUserAuthPassword = Admin_updateUserAuthPassword;
exports.Admin_updateUserStatus = Admin_updateUserStatus;
exports.Admin_addNewUser = Admin_addNewUser;

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

       if(!isMatch) return res.json({ status: false, msg: 'Your old password is wrong.'});


       AdminTable.updateOne({_id: id}, {password: passwordHash.generate(newPassword)}, function(err, response){
    
            if(err == null) return res.json({ status: true, msg: 'Your password is updated.'});
            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 


        })
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}


async function Admin_fetchAllUsers(req, res, next) {

	try {

       const {limit} = req.body;
       if(errors.indexOf(limit)>=0) return res.json({ status: false, msg: "Please provide the limit." });

       var userList = await UserTable.find({status: {'$nin': [0]}}, null, {sort:{createdAt: -1 },  limit: limit != 'infinity' ? limit: 1000000000000000})
       var userListCount = await UserTable.count({})
       var groups = await GroupTable.count()
       return res.json({status: true, data: userList, groupsCount: groups, userListCount: userListCount});
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}

async function Admin_getUserDetail(req, res, next) {

	try {

        const {id} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });

        var groups =  await GroupTable.find({members: {'$in': [id]}})

        return res.json({status: true, groups: groups});
 
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}


async function Admin_fetchSingleUser(req, res, next) {

	try {

        const {id} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });

        var userDetails =  await UserTable.findOne({_id: id})

        return res.json({status: true, data: userDetails});
 
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}




async function Admin_updateUserAuthPassword(req, res, next) {

	try {
 
        const {id, newPassword, confirmPassword} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
       
        if(errors.indexOf(newPassword)>=0) return res.json({ status: false, msg: "Please provide the newPassword." });

      if(newPassword != confirmPassword) return res.json({ status: false, msg: "New password and confirm passwords do not match." });


        UserTable.updateOne({_id: id}, {password: passwordHash.generate(newPassword)}, function(err, response){
    
            if(err == null) return res.json({ status: true, msg: 'Your password is updated.'});
            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 


        })
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}


async function Admin_updateUserStatus(req, res, next) {

	try {
 
        const {id, status} = req.body;
        if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
       
        if(errors.indexOf(status)>=0) return res.json({ status: false, msg: "Please provide the status." });

     
        UserTable.updateOne({_id: id}, {status: status}, function(err, response){
    
            if(err == null) return res.json({ status: true, msg: 'status is updated.'});
            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 


        })
 
  
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}
   
}




async function Admin_addNewUser(req, res, next) {

	try {
        console.log(req.params)
        const {email, phone, name} = req.params;
        if(errors.indexOf(email)>=0) return res.json({ status: false, msg: "Please provide the email." });
        if(errors.indexOf(phone)>=0) return res.json({ status: false, msg: "Please provide the phone." });
        if(errors.indexOf(name)>=0) return res.json({ status: false, msg: "Please provide the name." });

        UserTable.find({email: email}, function(err, response){
      
        if(response.length != 0) return res.json({ status: false, msg: 'This email is already in use, Please use another'});
    
          })

        UserTable.find({phone: Number(phone)}, function(err, response){
    
        if(response.length != 0) return res.json({ status: false, msg: 'This phone is already in use, Please use another'});


        })
 
  
        filesUpload.uploadPic(req, res, function(err){

     
       var newData = {name: req.body.name, phone: phone, email: email}
       if(req.file != undefined) newData['pic'] = req.file.filename

       var newUser = new UserTable(newData);

       newUser.save(function(err, response){
        if(err == null) return res.json({ status: true, msg: "New user is created.", data: userData});
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
        })
   

    } )

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}



 