'use strict';

let dbName = 'tfg';
let dbPort = 27017;
let host = "localhost";
let publicHost = "api.fiddeal.com";

exports.server_port = 8080;
exports.db_user = "serverUser";
exports.db_pwd = "fiddealtestTFG2018";
exports.dbName = dbName;
exports.dbURL = 'mongodb://'+host+':'+dbPort+'/'+dbName;
exports.host = host;
exports.publicHost = publicHost;

exports.autoMailAccount = 'fiddeal.auto@gmail.com';
exports.autoMailSmtpPort = 465;
exports.autoMailSmtpServer = 'smtp.gmail.com';
exports.autoMailPwd = 'ytodmnqttzygecrr';

exports.supportMailAddress = "info@fiddeal.com";

exports.dateFormat = "DD/MM/YYYY";
exports.datetimeFormat = "DD/MM/YYYY HH:mm";
exports.minUseAge = 18;

exports.USER_WEB = 2;
exports.USER_MOBILE = 1;
exports.TOKEN_KEY = "fiddealtfgpavelkhralovich";
exports.ENCODING_ALGORITHM = 'HS256';
exports.ACTIVATION_CODE_MIN = 10000000;
exports.ACTIVATION_CODE_MAX = 99999999;
exports.minDiscountEquivalence = 0.01;
exports.maxDiscountEquivalence = 1;
exports.minDiscountLife = 1;

/**
 * @return {boolean}
 */
exports.HTTPSActive = function(){
    return false;
};