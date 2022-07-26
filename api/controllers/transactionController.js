"use strict";
var constants = require("../constants/constants"),
  errors = ["", null, undefined];

//modules
var mongoose = require("mongoose"),
  path = require("path"),
  passwordHash = require("password-hash"),
  otpGenerator = require("otp-generator"),
  FCM = require("fcm-node"),
  fcm = new FCM(constants.FCM_SERVER_KEY),
  arraySort = require("array-sort"),
  NodeGeocoder = require("node-geocoder"),
  fs = require("fs"),
  sg = require("sendgrid")(constants.SENDGRID_ID),
  multer = require("multer"),
  filesUpload = require("./../logic/uploadFiles");

//tables
var GroupTable = mongoose.model("Group"),
  UserTable = mongoose.model("User"),
  NotificationsTable = mongoose.model("Notification"),
  ExpenseTable = mongoose.model("Expense"),
  TransactionTable = mongoose.model("transaction");

//exported functions
exports.payToFriend = payToFriend;

async function payToFriend(req, res, next) {
  try {
    const { id } = req.body;
    if (errors.indexOf(id) >= 0)
      return res.json({ status: false, msg: "Please provide the id." });
    let upload = filesUpload.uploadPic("data/user/pictures");
    console.log(upload);
    upload(req, res, (err) => {
      console.log(req.file.filename);
    });
  } catch (err) {
    console.log("Catch Error", err);
    return res
      .status(401)
      .send({ status: false, msg: "Something Went Wrong. Please Try Again!" });
  }
}
