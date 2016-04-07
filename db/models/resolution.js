/**
 * Модель результата экзамена
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam').schema;
var User = require('./user').schema;
var Resolution = new Schema({
    // Идентификатор экзамена (связь N:1)
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    // Кандидат проходивший экзамен
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Успешен результат экзамена или нет
    result: {
        type: Boolean
    },
    // Время получения результата
    created: {
        type: Date,
        default: Date.now
    },
    // Информация о результате экзамена
    message: {
        type: String
    }
});
module.exports = mongoose.model('Resolution', Resolution);