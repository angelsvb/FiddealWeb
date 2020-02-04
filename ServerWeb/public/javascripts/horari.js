let $ = require('jquery');
require('./utilities/templates');
require('jquery.nicescroll');
let http_client = require('./utilities/HTTPClient');
let Tools = require('./utilities/tools.js');
let Storage = require('./utilities/storage');
let Texts = require('./utilities/texts');
let Handlebars = require('handlebars');
let UpdateScheduleRequest = require('./requests/UpdateScheduleRequest');

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.initializeAfter = function() {
    Handlebars.translatePage("horari");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted){
        if (!Storage.getUser()) showUserMissingDataWarning();
    }
    let name = Texts.business_name_placeholder;
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current:Texts.option_schedule});

    Tools.setScroll("#column_buttons");
    Tools.setScroll("#grid_container");
    Tools.setScroll("#grid_header");

    $('input').prop('disabled', true);

    parseScheduleData(Storage.getUser().Schedule);

    $('.form_action').click(function(item){
        if (item.currentTarget.src.includes('save')){
            let id = item.currentTarget.id;
            let header = id.substr(0,id.indexOf('_'));

            if (allDaysClosed()){
                Tools.showInformationDialog(Texts.schedule_cant_close_allways);
                return;
            }

            let request = new UpdateScheduleRequest();
            let resultOK = parseOpeningDay(header,request);
            if (resultOK) {
                http_client.requestPUT(request,() => {
                    $('#'+id).attr('src','../images/ic_action_edit.svg');
                    $('#'+header+'_1').prop('disabled',true);
                    $('#'+header+'_2').prop('disabled',true);
                    $('#'+header+'_3').prop('disabled',true);
                    $('#'+header+'_4').prop('disabled',true);
                    $('#'+header+'_closed').prop('disabled',true);
                    $('#'+header+'_24h').prop('disabled',true);

                    Storage.setUser(request.entity.data);
                });
            }
        }else{
            let id = item.currentTarget.id;
            let header = id.substr(0,id.indexOf('_'));
            $('#'+id).attr('src','../images/ic_action_save.svg');

            let closed_check = $('#'+header+'_closed');
            closed_check.prop('disabled',false);
            let allday_check = $('#'+header+'_24h');
            allday_check.prop('disabled',false);

            if (!closed_check.is(":checked") && !allday_check.is(":checked")){
                $('#'+header+'_1').prop('disabled',false);
                $('#'+header+'_2').prop('disabled',false);
                $('#'+header+'_3').prop('disabled',false);
                $('#'+header+'_4').prop('disabled',false);
            }
        }
    });
};

window.parseOpeningDay = function(dayId,request){
    Tools.disableInputError('#'+dayId+'_1_error');
    Tools.disableInputError('#'+dayId+'_2_error');
    Tools.disableInputError('#'+dayId+'_3_error');
    Tools.disableInputError('#'+dayId+'_4_error');

    let closedAllDay = Tools.getViewValue('#'+dayId+'_closed');
    let openedAllDay = Tools.getViewValue('#'+dayId+'_24h');
    if (closedAllDay || openedAllDay){
        if (closedAllDay) {
            request.openingHours = [];
            request.closed = true;
            request.allDay = false;
            request.dayNumber = getDayNumber(dayId);
        }
        else {
            request.openingHours = [];
            request.closed = false;
            request.allDay = true;
            request.dayNumber = getDayNumber(dayId);
        }
        return true;
    }else{
        let r1 = validateRange1(dayId);
        if (r1 && r1.validationOK){
            let r2 = validateRange2(dayId,r1.data);
            request.dayNumber = getDayNumber(dayId);
            request.openingHours = [];
            request.openingHours.push(r1.data);
            request.closed = false;
            request.allDay = false;
            if (r2){
                if (r2.validationOK){
                    request.openingHours.push(r2.data);
                    return true;
                }else return undefined;
            }else return true;
        }else return false;
    }
};

window.parseScheduleData = function(schedule){
    $.each(schedule.OpeningDays,function(){
        let dayNumber = this.dayNumber;
        let dayNumberId = getDayNumberId(dayNumber);
        if (dayNumber >= 1 && dayNumber <= 7){
            if (this.allDay){
                $('#'+dayNumberId+'_24h').prop('checked',true);
            }else if (this.closed){
                $('#'+dayNumberId+'_closed').prop('checked',true);
            }else{
                if (this.openingHours.length === 1){
                    let r1 = this.openingHours[0];
                    parseRange(r1,dayNumberId)
                }else if (this.openingHours.length >= 1){
                    let r1 = this.openingHours[0];
                    parseRange(r1,dayNumberId);
                    let r2 = this.openingHours[1];
                    parseRange(r2,dayNumberId,true)
                }
            }
        }
    });
};

window.parseRange = function(range,dayId,isSecond = false){
    if (range && range.start && range.end){
        let strTimeIni = Math.floor(range.start/60).toString() + ":" + ("0" + range.start % 60).slice(-2);
        let strTimeFi = Math.floor(range.end/60).toString() + ":" + ("0" + range.end % 60).slice(-2);
        if (!isSecond){
            $('#'+dayId+'_1').val(strTimeIni);
            $('#'+dayId+'_2').val(strTimeFi);
        }else{
            $('#'+dayId+'_3').val(strTimeIni);
            $('#'+dayId+'_4').val(strTimeFi);
        }
    }else return undefined;
};

window.getDayNumberId = function(dayNumber){
    switch (dayNumber) {
        case 1: return "monday";
        case 2: return "tuesday";
        case 3: return "wednesday";
        case 4: return "thursday";
        case 5: return "friday";
        case 6: return "saturday";
        case 7: return "sunday";
        default: return undefined;
    }
};

window.getDayNumber = function(dayNumberId){
    switch (dayNumberId) {
        case "monday": return 1;
        case "tuesday": return 2;
        case "wednesday": return 3;
        case "thursday": return 4;
        case "friday": return 5;
        case "saturday": return 6;
        case "sunday": return 7;
        default: return undefined;
    }
};