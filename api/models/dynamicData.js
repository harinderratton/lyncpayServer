'use strict';

var mongoose = require('mongoose');

var dynamicData = new mongoose.Schema({
	title: {type: String, default:null},
    desc:  {type: String, required : true},

}, {timestamps: true});

module.exports = mongoose.model('DynamicDataTable', dynamicData);
 