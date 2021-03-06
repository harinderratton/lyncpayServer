"use strict";

var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    pic: { type: String, default: null },
    name: { type: String, default: null },
    phone: Number,
    email: { type: String, lowercase: true, trim: true },
    uid: { type: String, default: null },
    password: String,
    state: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    zip: { type: String, default: null },
    status: { type: String, default: 1 },
    stripe_id: { type: String },
    personalised: { type: String, default: 0 },
    pushNotifications: { type: String, default: 0 }, //1 for enable, 3 for disabled
    isAccountCompleted: { type: String, default: 0 },
    emailNotifications: { type: String, default: 1 },
  },
  { timestamps: true }
);

var OTPSchema = new mongoose.Schema(
  {
    otp: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

//type 1 is for if user is added to any group
//type 2 is for if expense is added to any user
var NotificationsSchema = new mongoose.Schema(
  {
    fromId: {
      type: String,
    },
    toId: {
      type: String,
    },
    type: {
      type: String,
    },
    isRead: {
      type: String,
    },
    isNewEntry: {
      type: String,
      default: 1,
    },
    data_params: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", OTPSchema);
module.exports = mongoose.model("User", UserSchema);
module.exports = mongoose.model("Notification", NotificationsSchema);
