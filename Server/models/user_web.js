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

let UserWebSchema = Schema({
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
    PolicyAccepted : {type:Boolean},
    DateAcceptation: {type:Date, default: moment().toDate()},
    IsActive : {type:Boolean},
    ActivationCode : {type:Number},
    Password: {type:String,required:true},
    DatePassword: {type:Date, default: moment().toDate()},
    ConfirmationPassword: {type:String,required:true},
    RecoveryPasswordCode: {type: String},
    RecoveryPasswordCodeDate : {type: Date},
    Productes : [{type: Schema.Types.ObjectId, ref:'Product'}],
    Ofertes : [{type:Schema.Types.ObjectId, ref:'Offer'}],
    Categories : [ProductCategorySchema.schema],
    Type: {type:Number,default:manager.USER_WEB},
    LastUpdate: {type:Date, default: moment().toDate()},
    CreationDate: {type:Date,default: moment().toDate()},
    FidelizationParams : { type: FidelizationParamsSchema.schema, default: FidelizationParamsSchema }
});

UserWebSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
        tools.deleteProperty(this,"Type");
    }
    //
    next();
});

UserWebSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

UserWebSchema.methods.deleteValuesOnCreate = function(){
    tools.deleteProperty(this._doc,"RecoveryPasswordCode");
    tools.deleteProperty(this._doc,"RecoveryPasswordCodeDate");
    tools.deleteProperty(this._doc,"Business");
    tools.deleteProperty(this._doc,"FidelizationDiscounts");
    tools.deleteProperty(this._doc,"Schedule");
    tools.deleteProperty(this._doc,"Productes");
    tools.deleteProperty(this._doc,"Ofertes");
    tools.deleteProperty(this._doc,"Categories");
    this._doc.ScheduleInitialized = false;
    this._doc.DateAcceptation = moment().toDate();
    this._doc.CreationDate = moment().toDate();
    this._doc.IsActive = false;
    this._doc.Type = manager.USER_WEB;
};

UserWebSchema.methods.toProtected = function(){
    tools.deleteProperty(this._doc,"Password");
    tools.deleteProperty(this._doc,"ConfirmationPassword");
    tools.deleteProperty(this._doc,"DatePassword");
    tools.deleteProperty(this._doc,"RecoveryPasswordCode");
    tools.deleteProperty(this._doc,"RecoveryPasswordCodeDate");
    tools.deleteProperty(this._doc,"ActivationCode");
};

UserWebSchema.methods.containsSubcategory = function(subcategoryId){
    let categories = this._doc.Categories;
    if (categories){
        for(let i=0;i<categories.length;i++){
            let currentCategory = categories[i];
            let subcategory = currentCategory.Subcategories.find(function(item){
                return item._id.toString() === subcategoryId;
            });
            if (subcategory) return subcategory;
        }
    }else return undefined;
};

UserWebSchema.index({ Email: 1, Type: 1 }, { unique: true });

module.exports = mongoose.model('UserWeb', UserWebSchema,'users');