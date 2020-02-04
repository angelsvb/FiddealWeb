'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');
let PurchasedProductSchema = require('../models/purchased_product');

let PurchaseReturn = Schema({
    Products: [{type:PurchasedProductSchema.schema}],
    Business: {type:Schema.Types.ObjectId, ref:'UserWebProtected', required:true},
    CreationDate: {type:Date, default:moment().toDate()},
    PaymentMethod: {type: Number, default: 1}
});

PurchaseReturn.pre('save', function(next) {
   if(!this.isNew) tools.deleteProperty(this, "CreationDate");
   next();
});

module.exports = mongoose.model('Returns', PurchaseReturn, 'returns');