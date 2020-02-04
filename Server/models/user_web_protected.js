'use strict';

let mongoose = require('mongoose');
let moment = require('moment');
let ProductCategorySchema = require('../models/product_category');
let FidelizationParamsSchema = require('../models/fidelization_params');
let ScheduleSchema = require('../models/schedule');
let Schema = mongoose.Schema;
let manager = require('../utilities/manager');
let tools = require('../utilities/tools');
let enums = require('../utilities/enums');

let UserWebProtectedSchema = Schema({
    Email: {type:String,required:true},
    Name: {type:String,required:true},
    CIF : {type:String,required:true},
    TypeBusiness : {type:Number,default:enums.eBusinessType.SHOP,required:true},
    CP: {type:Number,required:true},
    Photo : Buffer,
    Phone: {type:Number,required:true},
    WebPage: String,
    Description:{type:String, required:true},
    Address : {type:String,required:true},
    Municipi : {type:String,required:true},
    ProvinciaID : {type: Schema.Types.ObjectId, ref: 'Provincia', required:true},
    CountryID :  {type: Schema.Types.ObjectId, ref: 'Country', required:true},
    Schedule : ScheduleSchema.schema,
    ScheduleInitialized : {type:Boolean,default:false},
    DateAcceptation: {type:Date, default: moment().toDate()},
    PolicyAccepted : {type:Boolean, default: false},
    IsActive : {type:Boolean,default:false},
    ActivationCode : {type:Number,select:false},
    Password: {type:String,required:true,select:false},
    DatePassword: {type:Date, default: moment().toDate(), select: false},
    ConfirmationPassword: {type: String, select: false,required:true},
    RecoveryPasswordCode: {type: String, select: false},
    RecoveryPasswordCodeDate : {type: Date, select: false},
    Productes : [{type: Schema.Types.ObjectId, ref:'Product'}],
    Ofertes : [{type:Schema.Types.ObjectId, ref:'Offer'}],
    Categories : [ProductCategorySchema.schema],
    Type: {type:Number,default:manager.USER_WEB},
    LastUpdate: {type:Date, default: moment().toDate()},
    CreationDate: {type:Date,default: moment().toDate()},
    FidelizationParams : { type: FidelizationParamsSchema.schema, default: FidelizationParamsSchema.schema }
});

UserWebProtectedSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
        tools.deleteProperty(this,"Type");
    }
    //
    next();
});

UserWebProtectedSchema.pre('findOneAndUpdate',function(next){
    this._update.LastUpdate = moment().toDate();
    next();
});

UserWebProtectedSchema.methods.containsSubcategory = function(subcategoryId){
    let categories = this._doc.Categories;
    if (categories){
        for(let i=0;i<categories.length;i++){
            let currentCategory = categories[i];
            let subcategory = currentCategory.find(function(item){
                return item._id.toString === subcategoryId;
            });
            if (subcategory) return subcategory;
        }
    }else return undefined;
};

UserWebProtectedSchema.index({ Email: 1, Type: 1 }, { unique: true });

module.exports = mongoose.model('UserWebProtected', UserWebProtectedSchema,'users');