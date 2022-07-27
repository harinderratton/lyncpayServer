"use strict";

var mongoose = require("mongoose");

var paymentRequestSchema = new mongoose.Schema(
  {
    senderId: { type: String, default: null },
    recieverId: { type: String, required: true },
    amount: { type: Number },
    description: { type: String, default: null },
    picture: { type: String, default: null },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRequest", paymentRequestSchema);
