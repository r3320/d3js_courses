/**
 * Модель вопросов кандидата на экзамене
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = new Schema({
    //Название вопроса
    name: {
        type: String
    },
    //Текст вопроса
    text: {
        type: String
    },
    //Отвечен или нет
    answered: {
        type: Boolean
    }
});

module.exports = mongoose.model('Question', Question);