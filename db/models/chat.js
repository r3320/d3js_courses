/**
 * Модель сообщений
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam').schema;
var User = require('./user').schema;
var Attach = require('./attach').schema;
var Chat = new Schema({
    // Идентификатор комнаты (связь N:1)
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam'
    },
    // Получатель сообщения
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // Автор сообщения
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Время сообщения
    created: {
        type: Date,
        default: Date.now
    },
    // Текст сообщения
    message: {
        type: String
    },
    // Замечание
    mark: {
        type: Boolean
    },
    // Ссылка на вложение
    attach: [Attach]
});
module.exports = mongoose.model('Chat', Chat);