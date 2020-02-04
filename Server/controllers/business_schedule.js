'use strict';

let commons = require('../utilities/common_responses');
let ScheduleSchema = require('../models/schedule');
let ScheduleDaySchema = require('../models/schedule_opening_days');
let tools = require('../utilities/tools');

exports.setFirstSchedule = function(req,res){
    if (req.CURRENT_USER){
        req.CURRENT_USER.ScheduleInitialized = true;
        req.CURRENT_USER.Schedule = new ScheduleSchema(req.body);
        req.CURRENT_USER.save(commons.defaultSaveDbCallback(res));
    }else commons.undefinedErrorResponse(res);
};
exports.updateScheduleDay = function(req,res){
    if (req.CURRENT_USER){
        let dayToUpdate = req.CURRENT_USER.Schedule.OpeningDays.find(function(item){
           return item.dayNumber === tools.toNumber(req.body.dayNumber);
        });
        if (dayToUpdate) updateDay(req,res,dayToUpdate);
        else createDay(req,res)
    }else commons.undefinedErrorResponse(res);
};

function createDay(req,res){
    let new_day = undefined;
    if (req.body.closed) {
        new_day = new ScheduleDaySchema({
            allDay: false,
            closed: true,
            dayNumber: tools.toNumber(req.body.dayNumber)
        });
        new_day._doc.dayNumber = tools.toNumber(req.body.dayNumber);
    }
    else if (req.body.allDay){
        new_day = new ScheduleDaySchema({
           allDay: true,
            closed: false,
           dayNumber: tools.toNumber(req.body.dayNumber)
        });
        new_day._doc.dayNumber = tools.toNumber(req.body.dayNumber);
    }else {
        new_day = new ScheduleDaySchema(req.body);
        new_day._doc.allDay = false;
        new_day._doc.closed = false;
    }
    req.CURRENT_USER.Schedule.OpeningDays.push(new_day);
    req.CURRENT_USER.save(commons.defaultSaveDbCallback(res));
}

function updateDay(req,res,dayToUpdate) {
    if (req.body.closed){
        dayToUpdate.closed = true;
        dayToUpdate.allDay = false;
        dayToUpdate.openingHours = [];
    }else if (req.allDay){
        dayToUpdate.allDay = true;
        dayToUpdate.closed = false;
        dayToUpdate.openingHours = [];
    }else{
        let new_day = new ScheduleDaySchema(req.body);
        tools.deleteFromArray(req.CURRENT_USER.Schedule.OpeningDays,dayToUpdate);
        req.CURRENT_USER.Schedule.OpeningDays.push(new_day);
    }
    req.CURRENT_USER.save(commons.defaultSaveDbCallback(res));
}