'use strict';

let express = require('express');
let ScheduleController = require('../controllers/business_schedule');
let ScheduleMiddleware = require('../middleware/business_schedule');
let authentication = require('../middleware/authentication');

let api = express.Router();

//Inicialitzar horari d'un establiment
api.post('/business/schedule',authentication.getValidateTokenMiddleware(ScheduleMiddleware.validateFirstSchedule,true,true),ScheduleController.setFirstSchedule);
//Editar horari d'un establiment
api.put('/business/schedule',authentication.getValidateTokenMiddleware(ScheduleMiddleware.validateDaySchedule,true,true),ScheduleController.updateScheduleDay);

module.exports = api;