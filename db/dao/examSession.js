var ExamSession = {

    // Поиск. По id юзера и id экзамена
    find: function (args, callback) {
        var examSession = require('../models/examSession');
        examSession
            .findOne({user: args.userId, exam: args.examId})
            .populate('questions')
            .exec(callback);
    },

    // Обновление. Предполагается что обновить можно лишь номер текущего задания
    update: function (args, callback) {
        var examSession = require('../models/examSession');
        examSession.update({user: args.userId, exam: args.examId},
            {$set: {current: args.current}}, callback);
    },

    // Создание сессии со списком вопросов для кандидата
    create: function (args, callback) {
        var examSession = require('../models/examSession');
        var question = require('../models/question');
        var User = require('./models/user');

        User.findOne({username: args.username}, function(err, user) {
            if (err) callback(err);

            question.collection.insert(args.questions, function(err, docs) {
                if (err) callback(err);

                var questions = [];
                docs.forEach(function(q) {
                    questions.push(q._id);
                });

                examSession.create({
                    user: user._id,
                    total: args.total,
                    current: args.current,
                    questions: questions,
                    exam: args.examId
                }, callback);
            });
        });

    }
};

module.exports = ExamSession;