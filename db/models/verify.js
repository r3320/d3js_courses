/**
 * Модель идентификации
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam').schema;
var User = require('./user').schema;
var Attach = require('./attach').schema;
var Verify = new Schema({
    // Идентификатор экзамена (связь N:1)
    exam: {
        type: Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    // Автор замечания
    curator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Кандидат получивший замечание
    candidate: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Время замечания
    created: {
        type: Date,
        default: Date.now
    },
    // Какое-то число привязанное к участнику // TODO
    num: {
        type: Number
    },
    // Успешна ли идентификация.
    submit: {
        type: Boolean
    },
    // Хэш для сверки
    hash: {
        type: String,
        unique: true
    },
    // Данные пользователя
    passport: {
        type: Schema.Types.Mixed
    },
    // Кол-во предупреждений
    warnings: {
        type: Number
    },
    // Текст замечания
    attach: [Attach]  // TODO
});

var Model = mongoose.model('Verify', Verify);

//Verify.pre('save', function(next, done) {
//    Model.find({hash: this.hash}, function(err, docs) {
//        if (err) done(err);
//        else if (docs) done(new Error("Verify with same hash already exists"));
//        else done();
//    });
//    next();
//});

module.exports = Model;