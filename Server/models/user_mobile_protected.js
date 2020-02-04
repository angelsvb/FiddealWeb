'use strict';

// Cargamos el módulo de mongoose
let mongoose =  require('mongoose');
let moment = require('moment');
let tools = require('../utilities/tools');
let manager = require('../utilities/manager');

// Usaremos los esquemas
var Schema = mongoose.Schema;

// Creamos el objeto del esquema y sus atributos
var UserMobileProtectedSchema = Schema({
    Email: {type:String,required:true},
    Name: {type:String,required:true},
    Surname: {type:String,required:true},
    BornDate: {type:Date,required:true},
    DNI: {type:String,required:true},
    Photo: Buffer,
    CP: {type:Number,required:true},
    Municipi : {type:String,required:true},
    ProvinciaID : {type: Schema.Types.ObjectId, required:true},
    CountryID :  {type: Schema.Types.ObjectId, required:true},
    Phone: {type:Number,required:true},
    PolicyAccepted: {type:Boolean,default:false},
    DateAcceptation: {type:Date, default: moment().toDate()},
    Password: {type:String,select: false,required:true},
    ConfirmationPassword: {type:String,select: false,required:true},
    DatePassword: {type:Date, default: moment().toDate(),select: false},
    RecoveryPasswordCode: {type:String,select: false},
    RecoveryPasswordCodeDate : {type:Date,select: false},
    ActivationCode : {type:Number,select: false},
    IsActive : {type:Boolean, default: false,select: false},
    Type: {type:Number,default:1},
    LastUpdate: {type:Date, default: moment().toDate()},
    CreationDate: {type:Date, default: moment().toDate()},
    Business: [{type:Schema.Types.ObjectId, ref:'UserWebProtected'}],
    FidelizationDiscounts : [{type:Schema.Types.ObjectId,ref: 'FidelizationDiscount'}]
});

UserMobileProtectedSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
        tools.deleteProperty(this,"Type");
    }
    //
    next();
});

UserMobileProtectedSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('UserMobileProtected', UserMobileProtectedSchema,'users');