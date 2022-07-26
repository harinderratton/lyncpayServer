"use strict";

var mongoose = require("mongoose");

var friendsSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    friendId: { type: String, required: true },
    status: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friend", friendsSchema);
