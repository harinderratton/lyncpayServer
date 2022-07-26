"use strict";

var mongoose = require("mongoose");

var dynamicDataSchema = new mongoose.Schema(
  {
    title: { type: String, default: null },
    desc: { type: String, required: true },
    page: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DynamicData", dynamicDataSchema);
