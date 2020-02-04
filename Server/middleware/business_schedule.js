'use strict';

let commons = require('../utilities/common_responses');
let texts = require('../utilities/texts');
let errors = require('../utilities/error_codes');
let tools = require('../utilities/tools');

exports.validateFirstSchedule = function(req,res,next){
    if (req.body){
        if (req.CURRENT_USER){
            if (!req.CURRENT_USER.ScheduleInitialized){
                if (req.body.OpeningDays && req.body.OpeningDays.length>0){
                    if (validateFirstScheduleData(req,res)) next();
                }else commons.errorResponse(res,texts.schedule_invalid_body_openingDays,errors.body_validation_error);
            } else commons.errorResponse(res,texts.schedule_already_initialized,errors.schedule_already_initialized)
        }else commons.invalidAuth(res);
    }else commons.errorResponse(res,texts.schedule_empty_body,errors.empty_body_error);
};

exports.validateDaySchedule = function(req,res,next){
    if (req.body){
        if (req.CURRENT_USER){
            if (req.CURRENT_USER.ScheduleInitialized){
                if (req.body.dayNumber && req.body.dayNumber >= 1 && req.body.dayNumber <= 7){
                    if (validateDayScheduleData(req,res))  next();
                }else commons.errorResponse(res,texts.schedule_invalid_body_dayNumber,errors.body_validation_error);
            }else commons.errorResponse(res,texts.schedule_not_initialized,errors.schedule_not_initialized);
        }else commons.invalidAuth(res);
    }else commons.errorResponse(res,texts.schedule_empty_body,errors.empty_body_error);
};

function validateFirstScheduleData(req,res){
    let openingDays = req.body.OpeningDays;
    for (let i=0;i<openingDays.length;i++){
        if (validDayNumber(openingDays[i].dayNumber) && !definedDayPreviously(openingDays,i)){
            if (!validateDayRanges(req,res,openingDays[i]))
                return false;
        }else {
            if (validDayNumber(openingDays[i].dayNumber)) commons.errorResponse(res,texts.schedule_duplicated_day_number(i),errors.schedule_duplicated_day_number);
            else commons.errorResponse(res,texts.schedule_invalid_body_dayNumber,errors.schedule_invalid_body_dayNumber);
            return false;
        }
    }
    return true;
}

function validateDayRanges(req,res,openingDay){
    let ranges = openingDay.openingHours;
    if (openingDay.allDay) {
        openingDay.openingHours = [];
        openingDay.closed = false;
        return true;
    }else if (openingDay.closed){
        openingDay.openingHours = [];
        openingDay.allDay = false;
        return true;
    }
    else if (!ranges || ranges.length === 0){
        commons.errorResponse(res,texts.schedule_opening_day_empty_info,errors.schedule_opening_day_empty_info);
        return false;
    }else {
        for(let i=0;i<ranges.length;i++){
            if (!wellFormedRange(ranges[i]) || interferOtherRanges(ranges,i)){
                commons.errorResponse(res,texts.schedule_not_well_formed_range(ranges[i].start,ranges[i].end,i),errors.schedule_not_well_formed_range);
                return false;
            }
        }
        return true;
    }
}

function wellFormedRange(range){
    if (range.start && !isNaN(tools.hourToInt(range.start)) && range.end && !isNaN(tools.hourToInt(range.end))){
        let numericStart = tools.hourToInt(range.start);
        let numericEnd = tools.hourToInt(range.end);
        return (numericStart >= 0 && numericStart <=1440 && numericStart < numericEnd);
    }else return false;
}

function validDayNumber(number){
    return (number >= 1 && number <= 7);
}

function interferOtherRanges(ranges,currentIndex){
    if (currentIndex === 0) return false;
    else {
        let currentRange = ranges[currentIndex];
        let previousRanges = ranges.slice(0,currentIndex);
        for(let i=0;i<previousRanges;i++){
            let rangeStart = tools.toNumber(previousRanges[i].start);
            let rangeEnd = tools.toNumber(previousRanges[i].end);
            let currentStart = tools.toNumber(currentRange.start);
            let currentEnd = tools.toNumber(currentRange.end);
            if ((currentStart >= rangeStart && currentStart <= rangeEnd) || (currentEnd >= rangeStart && currentEnd <= rangeEnd)) return true;
        }
        return false;
    }
}

function validateDayScheduleData(req,res){
    if (!req.body.dayNumber) {
        commons.errorResponse(res,texts.error_missing_body_property("dayNumber"),errors.body_validation_error);
        return false;
    }else if (!req.body.openingHours && (!req.body.closed && !req.body.allDay)){
        commons.errorResponse(res,texts.error_missing_body_property("openingHours"),errors.body_validation_error);
        return false;
    }
    if (validDayNumber(req.body.dayNumber)){
        return validateDayRanges(req, res, req.body);
    }else {
        commons.errorResponse(res,texts.schedule_invalid_body_dayNumber,errors.schedule_invalid_body_dayNumber);
        return false;
    }
}

function definedDayPreviously(days,currentIndex){
    if (currentIndex === 0) return false;
    else {
        let subarray = days.slice(0,currentIndex);
        return (subarray.find(function(item){
            return item.dayNumber === days[currentIndex].dayNumber
        }));
    }
}

