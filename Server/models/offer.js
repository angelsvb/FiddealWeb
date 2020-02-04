'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');
let OfferProductSchema = require('../models/offer_product');

let OfferSchema = Schema({
    Business : {type:Schema.Types.ObjectId,ref:'UserWebProtected',required:true},
    ValidSince : {type:Date,required:true},
    ExpirationDate : {type:Date,required:true},
    OfferType :{type:Number,min:0,max:2,required:true},
    Products : [OfferProductSchema.schema],
    Description : {type:String,required:true},
    Img : String,
    MinDiscount : {type:Number,required:true,min:1,max:99},
    MaxDiscount : {type:Number,required:true,min:1,max:99},
    CreationDate : {type:Date,default:moment().toDate()},
    LastUpdate : {type:Date,default:moment().toDate()}
});

OfferSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew)
        tools.deleteProperty(this,"CreationDate");
    //
    next();
});

OfferSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

//OfferSchema.index({ "Products.Products": 1},{unique:true});

module.exports = mongoose.model('Offer',OfferSchema,'offers');