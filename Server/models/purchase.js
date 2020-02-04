'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');
let PurchasedProductSchema = require('../models/purchased_product');

let PurchaseSchema = Schema({
    PurchaseSubtotal : {type:Number,required:true,default:0},
    PurchaseDiscount : {type:Number,default:0},
    PurchaseFidelization : {type:Schema.Types.ObjectId,ref:'FidelizationDiscount'},
    PurchaseTotal: {type:Number,default:0,required:true},
    CreationDate: {type:Date,default:moment().toDate()},

    Products: [{type:PurchasedProductSchema.schema}],
    Business: {type:Schema.Types.ObjectId,ref:'UserWebProtected',required:true},
    User : {type:Schema.Types.ObjectId,ref:'UserMobileProtected'},
    PaymentMethod : {type:Number, default: 1},

    TicketImg : Buffer,
    IsManual : {type:Boolean,default:false},
    AcceptedManual : {type:Boolean},
    ManualRegistrationDate : {type:Date},
    ManualRevisionDate : {type:Date},
    ManualRevisionComments : String
});

PurchaseSchema.pre('save',function(next){
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew)
        tools.deleteProperty(this,"CreationDate");
    //
    next();
});

module.exports = mongoose.model('Purchase',PurchaseSchema,'purchases');