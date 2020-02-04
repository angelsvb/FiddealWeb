'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OfferProductSchema = Schema({
    Discount: {type:Number,required:true,min:1,max:99},
    Products: [{type:Schema.Types.ObjectId,ref:'Product',required:true}]
});

module.exports = mongoose.model('OfferProduct',OfferProductSchema);