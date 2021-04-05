'use strict';
module.exports = function(app) {

var userAuth = require('../controllers/userAuthController');

//owner routes start
		app.route('/sendOTP').post(userAuth.sendOTP)
		app.route('/verifiyOTP').post(userAuth.verifiyOTP)
		app.route('/checkInTable').post(userAuth.checkInTable)
		app.route('/tryLogin').post(userAuth.tryLogin)
		app.route('/finishPersonalisation').post(userAuth.finishPersonalisation)
		app.route('/setPushNotifications').post(userAuth.setPushNotifications)
		app.route('/setEmailNotifications').post(userAuth.setEmailNotifications)
		app.route('/getMyContacts').post(userAuth.getMyContacts)
};
