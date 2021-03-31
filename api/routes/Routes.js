'use strict';
module.exports = function(app) {

var users = require('../controllers/UsersCtrl');

//owner routes start
		app.route('/test')
		.post(function(){
			console.log('bruuuahhh')
		})
};
