/**
 * Модель групп (известны на момент старта экзамена)
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam').schema;
var User = require('./user').schema;
var Group = new Schema({
    // Идентификатор экзамена
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    // Участник экзамена
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Group', Group);