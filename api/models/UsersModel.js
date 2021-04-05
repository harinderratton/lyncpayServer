'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	pic: {type: String, default:null},
	fname: String,
	lname: String,
	phone: Number,
	email:{type: String, lowercase: true, trim: true,},
	uid:{type: String, default:null},
	password: String,
	state: {type: String, default:null},
	city: {type: String, default:null},
	country: {type: String, default:null},
	zip: {type: String, default:null},
	status:{type: String},
	stripe_id:{type: String},
	personalised: {type: String, default:0},

}, {timestamps: true});


var OTPSchema = new mongoose.Schema({
	otp: {type: String, required: true},
	phone: {type: String, required: true}

}, {timestamps: true});


module.exports = mongoose.model('OTPTable', OTPSchema);
module.exports = mongoose.model('UserTable', UserSchema);
 
