'use strict';
var constants = require('../constants/constants'),
errors = ["", null, undefined];

//modules
var mongoose = require('mongoose'),
path = require('path'),
passwordHash = require('password-hash'),
otpGenerator = require('otp-generator'),
FCM = require('fcm-node'),
fcm = new FCM(constants.FCM_SERVER_KEY),
arraySort = require('array-sort'),
NodeGeocoder = require('node-geocoder'),
fs = require('fs'),
sg = require('sendgrid')(constants.SENDGRID_ID),
multer = require('multer'),
stripe = require('stripe')(constants.STRIPE_KEY),
filesUpload = require('../logic/uploadFiles');

 

//tables
var GroupTable = mongoose.model('GroupTable'),
UserTable = mongoose.model('UserTable'),
CreditCardTable = mongoose.model('CreditCardTable');

//exported functions
exports.addNewCreditCard = addNewCreditCard;
 

async function addNewCreditCard(req, res, next) {

	try {
 
      const {userId, cardHolderName, cardNumber, cardCVV, cardExpiryDate, token, cardHolderEmail } = req.body;
      if(errors.indexOf(userId)>=0) return res.json({ status: false, msg: "Please provide the userId." });
      if(errors.indexOf(cardHolderName)>=0) return res.json({ status: false, msg: "Please provide the cardHolderName." });
      if(errors.indexOf(cardNumber)>=0) return res.json({ status: false, msg: "Please provide the cardNumber." });
      if(errors.indexOf(cardCVV)>=0) return res.json({ status: false, msg: "Please provide the cardCVV." });
      if(errors.indexOf(cardExpiryDate)>=0) return res.json({ status: false, msg: "Please provide the cardExpiryDate." });
      if(errors.indexOf(cardHolderEmail)>=0) return res.json({ status: false, msg: "Please provide the cardHolderEmail." });
      if(errors.indexOf(token)>=0) return res.json({ status: false, msg: "Please provide the token." });
 

            // Create a Customer:
            const customer = await stripe.customers.create({
            source: token,
            email: cardHolderEmail,
            });

            console.log('customercustomer', customer)

            return res.json({ status: false, msg: "Please provide the token." });

           
    //   var doesCardExist
    //   var newData = new CreditCardTable({
    //     cardHolderName:  cardHolderName,
    //     cardNumber: cardNumber,
    //     cardCvv:  cardCVV,
    //     cardExpiryDate:cardExpiryDate
    //   })

    //   newData.save(function(err, response){

    //     if(err == null) return res.json({ status: true, msg: 'New card is added'});
    //     else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 

    //   })
   

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}


 
 
 


 


 