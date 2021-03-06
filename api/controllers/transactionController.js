"use strict";
let constants = require("../constants/constants"),
  errors = ["", null, undefined];

//modules
let mongoose = require("mongoose"),
  path = require("path"),
  FCM = require("fcm-node"),
  fcm = new FCM(constants.FCM_SERVER_KEY),
  arraySort = require("array-sort"),
  NodeGeocoder = require("node-geocoder"),
  fs = require("fs"),
  sg = require("sendgrid")(constants.SENDGRID_ID),
  multer = require("multer"),
  filesUpload = require("./../logic/uploadFiles");

//tables
let GroupTable = mongoose.model("Group"),
  UserTable = mongoose.model("User"),
  NotificationsTable = mongoose.model("Notification"),
  ExpenseTable = mongoose.model("Expense"),
  TransactionTable = mongoose.model("Transaction"),
  PaymentRequestTable = mongoose.model("PaymentRequest");
//exported functions
exports.payToFriend = payToFriend;
exports.paymentRequestToFriend = paymentRequestToFriend;

async function payToFriend(req, res, next) {
  try {
    let upload = await filesUpload.UPLOAD(
      req,
      res,
      "data/transactions/pictures"
    );

    const { senderId, recieverId, amount, description, paymentMethod } =
      upload.req.body;
    if (
      errors.indexOf(senderId) >= 0 ||
      errors.indexOf(recieverId) >= 0 ||
      errors.indexOf(amount) >= 0
    ) {
      return res.json({
        status: false,
        msg: "Please provide all required Info.",
      });
    }

    let data = {
      senderId: senderId,
      recieverId: recieverId,
      amount: amount,
      paymentMethod: paymentMethod,
      description: description,
      status: "Paid",
    };

    if (errors.indexOf(upload.req.file) === -1) {
      data.picture = upload.req.file.filename;
    }

    let newTransaction = new TransactionTable(data);
    let result = newTransaction.save();
    res.send({ status: true, result: result });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}

async function paymentRequestToFriend(req, res, next) {
  try {
    let upload = await filesUpload.UPLOAD(
      req,
      res,
      "data/transactions/pictures"
    );

    const { senderId, recieverId, amount, description } = upload.req.body;
    if (
      errors.indexOf(senderId) >= 0 ||
      errors.indexOf(recieverId) >= 0 ||
      errors.indexOf(amount) >= 0
    ) {
      return res.json({
        status: false,
        msg: "Please provide all required Info.",
      });
    }

    let data = {
      senderId: senderId,
      recieverId: recieverId,
      amount: amount,
      description: description,
      status: "Paid",
    };

    if (errors.indexOf(upload.req.file) === -1) {
      data.picture = upload.req.file.filename;
    }

    let newPaymentRequest = new PaymentRequestTable(data);
    let result = newPaymentRequest.save();
    res.send({ status: true, result: result });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}
