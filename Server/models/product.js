'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');
let tools = require('../utilities/tools');
let enums = require('../utilities/enums');
let CategorySchema = require('./product_category');

let ProductSchema = Schema({
    Name: String,
    Price: {type:Number,required: true},
    OutletPrice : Number,
    Img : Buffer,
    Reference : {type:String,required:true},
    Business:{type: Schema.Types.ObjectId, ref: 'UserWebProtected'},

    Stock : {type:Number, default:0},
    StockState : {type:Number, default:enums.eStockState.NON_AVAILABLE},
    ExpectedArrival : Date,
    Description : {type:String,required:true},
    Offer:{type: Schema.Types.ObjectId, ref: 'Offer'},
    Subcategory:{type: Schema.Types.ObjectId, ref: 'ProductSubcategory'},
    CreationDate: {type:Date, default: moment().toDate()},
    LastUpdate: {type:Date, default: moment().toDate()},
    IsVisible : {type:Boolean, default:true}
});

ProductSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
    }
    //
    next();
});

ProductSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

ProductSchema.index({ Name: 1, Business:1 }, { unique: true });
ProductSchema.index({ Reference: 1, Business:1 }, { unique: true });

ProductSchema.statics.findByCategory = function (category, req, res, callback) {
    let subcategories = CategorySchema.findSubcategories(category);
    if (!subcategories.length) return undefined;
    else return this.find({subcatecategory: {$in: subcategories}})
}

module.exports = mongoose.model('Product',ProductSchema,'products');