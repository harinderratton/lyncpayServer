'use strict';
module.exports = function(app) {

var users = require('../controllers/UsersCtrl');

//owner routes start
		app.route('/sendOTP')
		.post(users.sendOTP)
};
