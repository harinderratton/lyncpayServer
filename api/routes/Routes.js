'use strict';
module.exports = function(app) {

var userAuth = require('../controllers/userAuthController');
var userGroups = require('../controllers/groupController');
var payMethods = require('../controllers/payMethodController');
var dataControllerMethods = require('../controllers/generalDataController');

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


//payment methods routes start
app.route('/addNewCreditCard').post(payMethods.addNewCreditCard)
app.route('/getMyPaymethods').post(payMethods.getMyPaymethods)


//general data controller routes start
app.route('/getLyncpayUsers').post(dataControllerMethods.getLyncpayUsers)
app.route('/updateUserProfileData/:phone/:email/:id').post(dataControllerMethods.updateUserProfileData)
app.route('/updateUserAuthPassword').post(dataControllerMethods.updateUserAuthPassword)
app.route('/getNonLyncpayUsers').post(dataControllerMethods.getNonLyncpayUsers)
app.route('/inviteContactOnLyncpay').post(dataControllerMethods.inviteContactOnLyncpay)
 

};
