'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PurchasedProductSchema = Schema({
    Amount: {type:Number, required:true, min:1},
    Price: {type:Number, required:true, min:0},
    //PercentageDiscount: {type: Number, min: 0, max:99, default: 0},
    Product : {type:Schema.Types.ObjectId,ref:'Product',required:true},
    //Offer : {type:Schema.Types.ObjectId,ref:'Offer'}
});

module.exports = mongoose.model('PurchasedProduct',PurchasedProductSchema);