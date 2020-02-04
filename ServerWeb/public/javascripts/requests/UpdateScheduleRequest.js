let HTTPRequest = require('../utilities/HTTPRequest');
let texts = require('../utilities/texts');

class UpdateScheduleRequest extends HTTPRequest {
    constructor() {
        super();
        this.dayNumber = undefined;
        this.openingHours = undefined;
        this.allDay = false;
        this.closed = false;
    }

    getPath() {
        return '/business/schedule'
    }

    getStaticBodyParams(obj){
        super.getStaticBodyParams(obj);
        obj[UpdateScheduleRequest.dayNumber] = this.dayNumber;
        obj[UpdateScheduleRequest.closed] = this.closed;
        obj[UpdateScheduleRequest.allDay] = this.allDay;
        obj[UpdateScheduleRequest.openingHours] = this.openingHours;
    }

    needAuth(){
        return true;
    }

    hasType(){
        return true;
    }

    getErrorCodeText(errorCode){
        switch (errorCode) {
            case 12 : return texts.schedule_already_initialized;
            case 13 : return texts.schedule_not_initialized;
            case 14: return texts.schedule_invalid_body_dayNumber;
            case 15: return texts.schedule_duplicated_day_number;
            case 16: return texts.schedule_opening_day_empty_info;
            case 17: return texts.schedule_not_well_formed_range;
            default: super.getErrorCodeText(errorCode);
        }
    }
}

UpdateScheduleRequest.dayNumber = "dayNumber";
UpdateScheduleRequest.closed = "closed";
UpdateScheduleRequest.allDay = "allDay";
UpdateScheduleRequest.openingHours = "openingHours";

module.exports = UpdateScheduleRequest;