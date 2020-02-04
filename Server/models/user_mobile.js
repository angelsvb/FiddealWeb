'use strict';

// Cargamos el módulo de mongoose
let mongoose =  require('mongoose');
let moment = require('moment');
let tools = require('../utilities/tools');
let manager = require('../utilities/manager');

// Usaremos los esquemas
let Schema = mongoose.Schema;

// Creamos el objeto del esquema y sus atributos
let UserMobileSchema = Schema({
    Email: {type:String,required:true},
    Name: {type:String,required:true},
    Surname: {type:String,required:true},
    BornDate: {type:Date,required:true},
    DNI: {type:String,required:true},
    Photo: Buffer,
    CP: {type:Number,required:true},
    Municipi : {type:String,required:true},
    ProvinciaID : {type: Schema.Types.ObjectId, ref: 'Provincia', required:true},
    CountryID :  {type: Schema.Types.ObjectId, ref: 'Country', required:true},
    Phone: {type:Number,required:true},
    PolicyAccepted: {type:Boolean,default:false},
    DateAcceptation: {type:Date, default: moment().toDate()},
    Password: {type:String,required:true},
    ConfirmationPassword: {type:String,required:true},
    DatePassword: {type:Date, default: moment().toDate()},
    RecoveryPasswordCode: String,
    RecoveryPasswordCodeDate : Date,
    ActivationCode : Number,
    IsActive : {type:Boolean, default: false},
    Type: {type:Number,default:1},
    LastUpdate: {type:Date, default: moment().toDate()},
    CreationDate: {type:Date, default: moment().toDate()},
    Business: [{type:Schema.Types.ObjectId, ref:'UserWebProtected'}],
    FidelizationDiscounts : [{type:Schema.Types.ObjectId,ref: 'FidelizationDiscount'}]
});

UserMobileSchema.methods.toProtected = function(){
    tools.deleteProperty(this._doc,"Password");
    tools.deleteProperty(this._doc,"ConfirmationPassword");
    tools.deleteProperty(this._doc,"DatePassword");
    tools.deleteProperty(this._doc,"RecoveryPasswordCode");
    tools.deleteProperty(this._doc,"RecoveryPasswordCodeDate");
    tools.deleteProperty(this._doc,"ActivationCode");
};

UserMobileSchema.methods.deleteValuesOnCreate = function(){
    tools.deleteProperty(this._doc,"RecoveryPasswordCode");
    tools.deleteProperty(this._doc,"RecoveryPasswordCodeDate");
    tools.deleteProperty(this._doc,"Business");
    tools.deleteProperty(this._doc,"FidelizationDiscounts");
    this._doc.DateAcceptation = moment().toDate();
    this._doc.CreationDate = moment().toDate();
    this._doc.IsActive = false;
    this._doc.Type = manager.USER_MOBILE;
};

UserMobileSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
        tools.deleteProperty(this,"Type");
    }
    //
    next();
});

UserMobileSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('UserMobile', UserMobileSchema,'users');