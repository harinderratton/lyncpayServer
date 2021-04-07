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
exports.getMyGroups = getMyGroups;
 

async function getMyContacts(req, res, next) {

	try {
 
      const {id} = req.body;
      if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
 
      UserTable.find({_id: {$ne: id}},function(err, response){

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
           filesUpload.uploadPic(req, res, function(err){

                const {id, selectedIDS, name} = req.body;
                if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
                if(errors.indexOf(selectedIDS)>=0) return res.json({ status: false, msg: "Please provide the selectedIDS." });
                if(errors.indexOf(name)>=0) return res.json({ status: false, msg: "Please provide the name." });
              
            

                var newIDS = selectedIDS.push(id)
                console.log({
                    admin: id,
                    name: name,
                    members: newIDS
                });

                return;
                var newGroup = new GroupTable({
                    admin: id,
                    name: name,
                    members: newIDS
                })
            
                newGroup.save(function(err, response){

                    if(err == null) return res.json({ status: true, msg: 'Group has been created'});
                    else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

                })
   
       });
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}


async function getMyGroups(req, res, next) {

	try{
                const {id} = req.body;
                if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });

                var response1 = await GroupTable.find({admin: id});

                if(response1.length!= 0) {
                    var cont = 0 ;
                    var groupList = [];
                    for(let key of response1){
                        cont++
                        var allMembers = [];
                        var cont1 = 0 ;
                        for(let key1 of key.members){
                            var userDetails = await UserTable.findOne({_id: key1}, '_id name pic');
                            allMembers.push(userDetails);
                            cont1++ 
                            if (cont1 == key.members.length){
                            
                                var name =  key.name.split(' ');
                                var dist = {
                                    admin: key.admin,
                                    createdAt: key.createdAt, 
                                    members: allMembers, 
                                    name: key.name,
                                    name1: name[0].split('')[0].toUpperCase(),
                                    name2:  name[1] != undefined ? name[1].split('')[0].toUpperCase() : null,
                                    paymentStatus: key.paymentStatus, 
                                    pic: key.pic,
                                    _id: key._id, 
                                }

                                groupList.push(dist);


                                if(cont == response1.length) return res.json({ status: true, msg: 'groups list', data: groupList});

                            } 
                        }

                       
                       

                    }


                }
                else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
    
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}

 


 


 