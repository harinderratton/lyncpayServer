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
UserTable = mongoose.model('UserTable'),
NotificationsTable = mongoose.model('NotificationsTable'),
ExpenseTable = mongoose.model('ExpenseTable')

//exported functions
exports.getMyContacts = getMyContacts;
exports.createNewGroup = createNewGroup;
exports.getMyGroups = getMyGroups;
exports.getSingleGroupDetails = getSingleGroupDetails;
exports.confirmAddExpense = confirmAddExpense;


async function getMyContacts(req, res, next) {

	try {
 
      const {id} = req.body;
      if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
 
      UserTable.find({_id: {$ne: id}},function(err, response){

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
         
                var memberIDS = JSON.parse(selectedIDS)
                var allIDS = []

                for(let key of memberIDS ){

                    if(allIDS.indexOf(key) == -1) allIDS.push(key) 

                }

                var newGroup = new GroupTable({
                    admin: id,
                    name: name,
                    members:  allIDS
                })
            
                newGroup.save(function(err, response){


                    allIDS.forEach(function myFunction(item, index) {

                        if(item!= id) addNotifications(id, item, 1, {groupName: name})
                       
                      });

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


function addNotifications(fromId, toId, type, data_params){

        var data = {
            fromId: fromId,
            toId: toId,
            type: type,
            data_params: data_params
        }

        var newNotification = new NotificationsTable(data)
        newNotification.save();
}



async function getSingleGroupDetails(req, res, next) {

    try{
        const {groupId} = req.body;
        if(errors.indexOf(groupId)>=0) return res.json({ status: false, msg: "Please provide the groupId." });

        var response1 = await GroupTable.findOne({_id: groupId});

        if(response1 != null) {
            var cont = 0 ;
            var allMembers = [];
            for(let key of response1.members){
               
                        var userDetails = await UserTable.findOne({_id: key}, '_id name pic');
                        allMembers.push(userDetails);
                        cont++;

                        if(cont == response1.members.length) {

                            var name =  response1.name.split(' ');
                            var ResData = {
                                admin: response1.admin,
                                createdAt: response1.createdAt, 
                                members: allMembers, 
                                name: response1.name,
                                name1: name[0].split('')[0].toUpperCase(),
                                name2:  name[1] != undefined ? name[1].split('')[0].toUpperCase() : null,
                                paymentStatus: response1.paymentStatus, 
                                pic: response1.pic,
                                _id: response1._id, 
                            }
                            
                            return res.json({ status: true, msg: 'groups list', data: ResData});
                        
                        }

                
            }


        }
        else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

} catch (err) {
console.log('Catch Error', err);
return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
}


}


async function confirmAddExpense(req, res, next) {

	try {
           filesUpload.uploadPic(req, res, function(err){

                const {name, groupId, members, total, each, userId} = req.body;
                if(errors.indexOf(members)>=0) return res.json({ status: false, msg: "Please provide the members." });
                if(errors.indexOf(groupId)>=0) return res.json({ status: false, msg: "Please provide the groupId." });
                if(errors.indexOf(name)>=0) return res.json({ status: false, msg: "Please provide the name." });
                if(errors.indexOf(total)>=0) return res.json({ status: false, msg: "Please provide the total." });
                if(errors.indexOf(each)>=0) return res.json({ status: false, msg: "Please provide the each." });
                if(errors.indexOf(userId)>=0) return res.json({ status: false, msg: "Please provide the userId." });
         
                var memberIDS = JSON.parse(members)
                var cont = 0;
                for(let key of memberIDS){

                    var newExpense = new ExpenseTable({
                        groupId: groupId,
                        userId: key,
                        amount: each,
                    })
                
                    newExpense.save(function(err, response){
                        addNotifications(userId, key, 2, {groupName: name, expense: each})

                        cont++

                        if(cont == memberIDS.length){
                            if(err == null) return res.json({ status: true, msg: 'Expense has been added'});
                            else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
                        }

    
                    })

                }

                
   
       });
	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}

 


 


 