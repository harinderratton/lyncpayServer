'use strict';

var mongoose = require('mongoose');

var creditCardSchema = new mongoose.Schema({
    cardHolderName: {type: String, required: true, lowercase: true},
	cardNumber: {type: String, required: true, trim: true},
    cardCvv:   {type: String, required: true, trim: true},
    cardExpiryDate: {type: String, required: true},
    status:  {type: String, default: 1},

}, {timestamps: true});


module.exports = mongoose.model('CreditCardTable', creditCardSchema);
 
