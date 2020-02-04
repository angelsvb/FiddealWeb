'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');

let NewsletterSchema = Schema({
    Email: {type: String, required: true},
    Type: {type: Number, min: 1, max: 2, required: true},
    Name: {type: String, default: ''},
    Active: {type: Boolean, default: true},
    CreationDate : {type:Date,default:moment().toDate()},
    LastUpdate : {type:Date,default:moment().toDate()}
});

NewsletterSchema.pre('save', function(next) {
    this.LastUpdate = moment().toDate();
    if (!this.isNew)
        tools.deleteProperty(this,"CreationDate");
    next();
});

NewsletterSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

NewsletterSchema.index({ "Email": 1, "Type": 1 }, {unique:true});

module.exports = mongoose.model('Newsletter', NewsletterSchema, 'newsletter_subscriptions');