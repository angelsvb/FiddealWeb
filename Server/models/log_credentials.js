'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let moment = require('moment');

let CredentialsLogSchema = Schema({
    Timestamp: {type: Date, default: moment().toDate(), required: true},
    Method: {type: String, default: '', required: true},
    RequestPath: {type: String, default: '', required: true},
    RequestBody: {type: String, default: ''},
    ResponseCode: {type: Number, default: 200},
    ResponseBody: {type: String, default: ''},
    UserId: {type: String, default: ''},
    UserType: {type: Number},
    Agent: {type: String, default: ''},
    IPAddress: {type: String, default: ''}
});

module.exports = mongoose.model('CredentialsLog', CredentialsLogSchema, 'log_credentials');

