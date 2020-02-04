'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');

let MailingLogSchema = Schema({
    Timestamp: {type: Date, default: moment().toDate(), required: true},
    Host: {type: String, default: '', required: true},
    Port: {type: Number, default: 0, required: true},
    Secure: {type: Boolean, default: false, required: true},
    ErrorMessage: {type: String, default: ''},
    MailFrom: {type: String, default: ''},
    MailTo: {type: String, default: ''},
    MailSubject: {type: String, default: ''},
    MailMessage: {type: String, default: ''},
    MailId: {type: String, default: ''},
});

module.exports = mongoose.model('MailingLog', MailingLogSchema, 'log_mailing');