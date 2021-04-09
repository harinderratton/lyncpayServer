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
exports.getMyPaymethods = getMyPaymethods;
 

async function addNewCreditCard(req, res, next) {

	try {
 
      const {userId, cardHolderName, cardNumber, cardCVV, cardExpiryDate, token, cardHolderEmail } = req.body;

      console.log(cardNumber);
      if(errors.indexOf(userId)>=0) return res.json({ status: false, msg: "Please provide the userId." });
      if(errors.indexOf(cardHolderName)>=0) return res.json({ status: false, msg: "Please provide the cardHolderName." });
      if(errors.indexOf(cardNumber)>=0) return res.json({ status: false, msg: "Please provide the cardNumber." });
      if(errors.indexOf(cardHolderEmail)>=0) return res.json({ status: false, msg: "Please provide the cardHolderEmail." });
      if(errors.indexOf(token)>=0) return res.json({ status: false, msg: "Please provide the token." });
 
            // Create a Customer:
            const customer = await stripe.customers.create({
            source: token,
            email: cardHolderEmail,
            });

            if(errors.indexOf(customer)>=0) return res.json({ status: false, msg: "we Could not add this card at this moment." });
            else saveCard();
        
           function saveCard(){

            var newData = new CreditCardTable({
              cardHolderName:  cardHolderName,
              cardNumber: cardNumber.slice(12, 16),
              userId: userId,
              customerId: customer.id,
              default_source: customer.default_source
            })
  
            newData.save(function(err, response){
  
              if(err == null) return res.json({ status: true, msg: 'New card is added'});
              else return res.json({ status: false, msg: "Something Went Wrong. Please Try Again!" }); 
  
            })

           }

   

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}




async function getMyPaymethods(req, res, next) {

	try {
 
      const {id} = req.body;
      if(errors.indexOf(id)>=0) return res.json({ status: false, msg: "Please provide the id." });
 
      CreditCardTable.find({userId: id},function(err, response){

        if(response.length !=0) return res.json({ status: true, data: response});
        else return res.json({ status: false, msg: "No saved cards found!" }); 

      })
   

	} catch (err) {
    console.log('Catch Error', err);
		return res.status(401).send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
	}

}



 
 
 


 


 