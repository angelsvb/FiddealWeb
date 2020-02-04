let nodemailer = require('nodemailer');
let manager = require('./manager');
let errors = require('./error_codes');
let moment = require('moment');
let logging = require('./logging');

exports.sendMail = function (subject,content,isHTMLContent,destination,functionNext) {
    let transporter;
    let mail;

    let loggingObject = {};

    try{
        loggingObject[logging.MAILING_HOST] = manager.autoMailSmtpServer;
        loggingObject[logging.MAILING_PORT] = manager.autoMailSmtpPort;
        loggingObject[logging.MAILING_SECURE] = true;
        loggingObject[logging.MAILING_TIMESTAMP] = moment().toDate();

         transporter = nodemailer.createTransport({
            host : manager.autoMailSmtpServer,
            port : manager.autoMailSmtpPort,
            secure : true,
            auth : {
                user : manager.autoMailAccount,
                pass : manager.autoMailPwd
            }, tls : {
                rejectUnauthorized: false
             }
        });
    }catch(err) {
        loggingObject[logging.MAILING_ERROR] = errors.support_error_creating_transporter;
        logging.saveMailingLog(loggingObject);

        functionNext(errors.support_error_creating_transporter,undefined);
        return
    }

    try{
        loggingObject[logging.MAILING_FROM] = "Fiddeal <auto "+manager.autoMailAccount+">";
        loggingObject[logging.MAILING_TO] = destination;
        loggingObject[logging.MAILING_SUBJECT] = subject;
        loggingObject[logging.MAILING_MESSAGE] = content;

        mail = {
            from: "Fiddeal <auto "+manager.autoMailAccount+">",
            to: destination,
            subject : subject
        };
        if (isHTMLContent)
            mail['html'] = content;
        else mail['text'] = content;
    }catch (err){
        loggingObject[logging.MAILING_ERROR] = errors.support_error_creating_mail;
        logging.saveMailingLog(loggingObject);

        functionNext(errors.support_error_creating_mail);
        return
    }

    try{
        transporter.sendMail(mail, (error, info) => {
            if (error) {
                loggingObject[logging.MAILING_ERROR] = errors.support_error_sending_mail;
                logging.saveMailingLog(loggingObject);

                functionNext(errors.support_error_sending_mail,undefined);
            }
            else {
                loggingObject[logging.MAILING_ID] = info.messageId;
                logging.saveMailingLog(loggingObject);

                functionNext(errors.request_ok,info);
            }
        });
    }catch (err){
        loggingObject[logging.MAILING_ERROR] = errors.support_undefined_error_sending_mail;
        logging.saveMailingLog(loggingObject);

        functionNext(errors.support_undefined_error_sending_mail);
    }
};