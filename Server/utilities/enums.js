'use strict';

exports.eBusinessType = {
    UNDEFINED : 0,
    SHOP : 1,
    RESTAURANT : 2,
    HAIR_SALON : 3,
    VETERINARIAN : 4,
    isValidType : function(type){
        return !(type === 0 || type > 4);
    }
};

let eWeekDay = {
    MONDAY : 1,
    TUESDAY : 2,
    WEDNESDAY : 3,
    THURSDAY : 4,
    FRIDAY : 5,
    SATURDAY : 6,
    SUNDAY : 7
};
exports.eWeekDay = eWeekDay;
exports.getDayString = function(number){
    switch (number) {
        case eWeekDay.MONDAY: return "Monday";
        case eWeekDay.TUESDAY : return "Tuesday";
        case eWeekDay.WEDNESDAY : return "Wednesday";
        case eWeekDay.THURSDAY : return "Thurday";
        case eWeekDay.FRIDAY : return "Friday";
        case eWeekDay.SATURDAY : return "Saturday";
        case eWeekDay.SUNDAY : return "Sunday";
        default: return "Unexpected day number";
    }
};
exports.eStockState = {
    AVAILABLE : 1,
    DEPRECATED : 2,
    OUTLET : 3,
    TO_ARRIVE : 4,
    NON_AVAILABLE : 5,
};
