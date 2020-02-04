'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OpeningHoursSchema = Schema({
    start: {type: String, required: true},
    end: {type: String, required: true}
});
module.exports = mongoose.model('OpeningHours',OpeningHoursSchema);