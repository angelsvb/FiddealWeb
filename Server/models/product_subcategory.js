'use strict';

let mongoose = require('mongoose');
let moment = require('moment');
let tools = require('../utilities/tools');
let Schema = mongoose.Schema;

let ProductSubcategorySchema = Schema({
    Name : {type:String,required:true},
    CreationDate : {type:Date,default: moment().toDate()},
    ParentCategory : {type: Schema.Types.ObjectId, ref: 'ProductCategory'}
});

ProductSubcategorySchema.pre('save',function(next){
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
    }
    //
    next();
});

module.exports = mongoose.model('ProductSubcategory',ProductSubcategorySchema);