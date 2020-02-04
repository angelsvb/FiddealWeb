'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let manager = require('../utilities/manager');

let FidelizationParamsSchema = Schema({
    discountEquivalence : {type:Number,default:manager.minDiscountEquivalence,min:manager.minDiscountEquivalence,max:manager.maxDiscountEquivalence},
    discountLife : {type:Number,default:manager.minDiscountLife,min:manager.minDiscountLife},
    expires : {type: Boolean,default:true},
    extendOnPurchase : {type:Boolean, default:true}
});

module.exports = mongoose.model('FidelizationParams',FidelizationParamsSchema);

