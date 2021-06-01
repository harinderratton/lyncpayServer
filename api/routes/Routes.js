'use strict';
module.exports = function(app) {

var userAuth = require('../controllers/userAuthController');
var userGroups = require('../controllers/groupController');
var payMethods = require('../controllers/payMethodController');
var dataControllerMethods = require('../controllers/generalDataController');
var adminMethods = require('../controllers/adminController');

//user routes start
app.route('/sendOTP').post(userAuth.sendOTP)
app.route('/verifiyOTP').post(userAuth.verifiyOTP)
app.route('/checkInTable').post(userAuth.checkInTable)
app.route('/tryLogin').post(userAuth.tryLogin)
app.route('/finishPersonalisation').post(userAuth.finishPersonalisation)
app.route('/setPushNotifications').post(userAuth.setPushNotifications)
app.route('/setEmailNotifications').post(userAuth.setEmailNotifications)


//group routes start
app.route('/getMyContacts').post(userGroups.getMyContacts)
app.route('/createNewGroup').post(userGroups.createNewGroup)
app.route('/getMyGroups').post(userGroups.getMyGroups)
app.route('/getSingleGroupDetails').post(userGroups.getSingleGroupDetails)
app.route('/confirmAddExpense').post(userGroups.confirmAddExpense)


//payment methods routes start
app.route('/addNewCreditCard').post(payMethods.addNewCreditCard)
app.route('/getMyPaymethods').post(payMethods.getMyPaymethods)


//general data controller routes start
app.route('/getLyncpayUsers').post(dataControllerMethods.getLyncpayUsers)
app.route('/updateUserProfileData/:phone/:email/:id').post(dataControllerMethods.updateUserProfileData)
app.route('/updateUserAuthPassword').post(dataControllerMethods.updateUserAuthPassword)
app.route('/getNonLyncpayUsers').post(dataControllerMethods.getNonLyncpayUsers)
app.route('/inviteContactOnLyncpay').post(dataControllerMethods.inviteContactOnLyncpay)
app.route('/getUserNotifications').post(dataControllerMethods.getUserNotifications)
 


//admin controller routes start
app.route('/tryLoginAdmin').post(adminMethods.tryLoginAdmin)
app.route('/Admin_updateUserProfileData').post(adminMethods.Admin_updateUserProfileData)
app.route('/Admin_updateAuthPassword').post(adminMethods.Admin_updateAuthPassword)
app.route('/Admin_fetchAllUsers').post(adminMethods.Admin_fetchAllUsers)
app.route('/Admin_getUserDetail').post(adminMethods.Admin_getUserDetail)
app.route('/Admin_fetchSingleUser').post(adminMethods.Admin_fetchSingleUser)
app.route('/Admin_updateUserAuthPassword').post(adminMethods.Admin_updateUserAuthPassword)
app.route('/Admin_updateUserStatus').post(adminMethods.Admin_updateUserStatus)
app.route('/Admin_addNewUser/:phone/:email').post(adminMethods.Admin_addNewUser)
app.route('/Admin_setNewPassword').post(adminMethods.Admin_setNewPassword)
app.route('/getAllGroups').post(adminMethods.getAllGroups)


 
};
