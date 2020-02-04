'use strict';
let mongoose = require('mongoose');
let OpeningHoursSchema = require('../models/schedule_opening_hours');
let Schema = mongoose.Schema;

let OpeningDaySchema = Schema({
    dayNumber : {type:Number,min:1,max:7,required:true},
    openingHours : [OpeningHoursSchema.schema],
    allDay : {type:Boolean,default:false},
    closed : {type:Boolean,default:false}
});
module.exports = mongoose.model('OpeningDay',OpeningDaySchema);