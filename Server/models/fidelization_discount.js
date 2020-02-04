'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');

let FidelizationDiscountSchema = Schema({
    Business : {type:Schema.Types.ObjectId,ref:'UserWebProtected',required:true},
    User : {type:Schema.Types.ObjectId,ref:'UserMobileProtected',required:true},
    LastPurchase : {type:Date},
    Discount : {type:Number,default:0},
    ExpirationDate : {type:Date},
    Used : {type:Boolean,default:false},
    UseDate : Date,
    Purchases : [{type:Schema.Types.ObjectId,ref:'Purchase',required:true}],
    CreationDate : {type:Date,default:moment().toDate()},
    LastUpdate : {type:Date,default:moment().toDate()}
});

function roundToTwo(num) {
    let oRes =  +(Math.round(num + "e+2")  + "e-2");
    if (oRes === 0) return 0.01;
    else return oRes;
}

FidelizationDiscountSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    this.Discount = roundToTwo(this.Discount);
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew)
        tools.deleteProperty(this,"CreationDate");
    //
    next();
});

FidelizationDiscountSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    this.Discount = roundToTwo(this.Discount);
    next();
});

module.exports = mongoose.model('FidelizationDiscount',FidelizationDiscountSchema,'discounts');