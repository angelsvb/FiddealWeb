'use strict';

let mongoose = require('mongoose');
let SubcategorySchema = require('../models/product_subcategory');
let moment = require('moment');
let tools = require('../utilities/tools');

let Schema = mongoose.Schema;

let ProductCategorySchema = Schema({
    Name : {type:String,required:true},
    CreationDate : {type:Date,default: moment().toDate()},
    LastUpdate : {type:Date, default:moment().toDate()},
    Subcategories : [SubcategorySchema.schema]
});

ProductCategorySchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
    }
    //
    next();
});

ProductCategorySchema.static.findSubcategories = function(category, callback){
    return this.findOne({_id : category}, callback);
};


ProductCategorySchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

module.exports = mongoose.model('ProductCategory',ProductCategorySchema);