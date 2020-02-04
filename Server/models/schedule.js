'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let OpeningDaySchema = require('../models/schedule_opening_days');
let moment = require('moment');
let tools = require('../utilities/tools');

let ScheduleSchema = Schema({
    OpeningDays:[OpeningDaySchema.schema],
    CreationDate:Date,
    LastUpdate:Date
});

ScheduleSchema.pre('save',function(next){
    this.LastUpdate = moment().toDate();
    //AFEGIR CAMPS NO MODIFICABLES
    if (!this.isNew){
        tools.deleteProperty(this,"CreationDate");
    }
    //
    next();
});

ScheduleSchema.pre('findOneAndUpdate',function(next){
    this.LastUpdate = moment().toDate();
    next();
});

module.exports = mongoose.model('Schedule', ScheduleSchema);