"use strict";

var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema(
  {
    senderId: { type: String, default: null },
    recieverId: { type: String, required: true },
    amount: { type: Number },
    paymentMethod: { type: String, default: null },
    description: { type: String, default: null },
    picture: { type: String, default: null },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
