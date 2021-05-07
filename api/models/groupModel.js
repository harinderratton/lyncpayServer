'use strict';

var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
    admin: {type: String, required: true},
	pic: {type: String, default:null},
    name:  {type: String, required: true},
    members: {type: [], default:[]},
    paymentStatus:  {type: String, default: 1},

}, {timestamps: true});



var contactInvitationSchema = new mongoose.Schema({
    phone: {type: String, required: true},
	senderId: {type: String, required: true},
    status:  {type: String, default: 1},

}, {timestamps: true});


var expenseSchema = new mongoose.Schema({
    groupId: {type: String, required: true},
	pic: {type: SVGAnimatedString},
    description: {type: String},
    userId: {type: String, required: true},
    amount: {type: String, required: true},
    status: {type: String, default: 1},

}, {timestamps: true});


module.exports = mongoose.model('contactInvitationTable', contactInvitationSchema);
module.exports = mongoose.model('GroupTable', groupSchema);
module.exports = mongoose.model('ExpenseTable', expenseSchema);
 
