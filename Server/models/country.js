'use strict';

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var ProvinciaSchema = require('../models/provincia');

var CountrySchema = Schema({
    name: {type:String,required:true},
    prefix: {type:Number,required:true},
    id: {type:Number,required:true},
    provincies: [ProvinciaSchema.schema]
});

CountrySchema.index({ name: 1, prefix: 1 }, { unique: true });

module.exports = mongoose.model('Country', CountrySchema,'countries');