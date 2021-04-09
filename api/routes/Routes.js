'use strict';
module.exports = function(app) {

var userAuth = require('../controllers/userAuthController');
var userGroups = require('../controllers/groupController');
var payMethods = require('../controllers/payMethodController');

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
 

};
