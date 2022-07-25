'use strict';

var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
	pic: {type: String, default:null},
    name:  {type: String, required : true},
	phone: {type: String, required : true},
    address:  {type: String, default:null},
	email: {type: String, lowercase: true, trim: true, required : true}, 
	password:  {type: String, required : true},
	state: {type: String, default:null},
	city: {type: String, default:null},
	country: {type: String, default:null},
	zip: {type: String, default:null},
	status:{type: String},
 

}, {timestamps: true});

module.exports = mongoose.model('AdminTable', AdminSchema);
 