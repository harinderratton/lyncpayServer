'use strict';

var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    admin: {type: String, required: true},
	pic: {type: String, default:null},
    name:  {type: String, required: true},
    members: {type: [], default:[]},
    paymentStatus:  {type: String, default: 1},

}, {timestamps: true});


module.exports = mongoose.model('GroupTable', groupSchema);
 
