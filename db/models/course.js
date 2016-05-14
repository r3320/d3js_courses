/**
 * Модель курсов
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Course = new Schema({
    // Номер
    number: {
        type: Number
    },
    // Название курса
    taskName: {
        type: String
    },
    // Замечание
    taskDescription: {
        type: String
    },
});
module.exports = mongoose.model('Course', Course);