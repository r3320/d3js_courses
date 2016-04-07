/**
 * Модель экзамена
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = new Schema({
    // Идентификатор экзамена в LMS
    examId: {
        type: String
    },
    // Дата начала экзамена
    beginDate: {
        type: Date
    },
    // Дата окончания экзамена
    endDate: {
        type: Date
    },
    // Тема экзамена
    subject: {
        type: String
    },
    // Город проведения экзамена
    city: {
        type: String
    },
    // Комиссия экзамена
    commission: {
        type: String
    },
    // Центр в котором был проведен экзамен
    center: {
        type: String
    },
    // Тип экзамена
    type: {
        type: String
    }

});
module.exports = mongoose.model('Exam', Exam);