/**
 * Модель кандидата, проходящего экзамен
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user').schema;
var Exam = require('./exam').schema;
var Questions = require('./questions').schema;
var ExamSession = new Schema({
    // Пользователь
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //Всего вопросов
    total: {
        type: Number
    },
    //Уже ответил на
    //answered: {
    //    type: Number
    //},
    //Сейчас на
    current: {
        type: Number
    },
    //Массив вопросов
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Questions'
    }],
    //Информация о экзамене
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam'
    }
});

module.exports = mongoose.model('ExamSession', ExamSession);