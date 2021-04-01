'use strict';
module.exports = function(app) {

var userAuth = require('../controllers/userAuthController');

//owner routes start
		app.route('/sendOTP').post(userAuth.sendOTP)

		app.route('/verifiyOTP').post(userAuth.verifiyOTP)
};
