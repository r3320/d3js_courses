var logger = require('../../common/logger');
var db = require('../');
var fs = require('fs');

var fixtures = {
    addUsers: function() {
        var users = JSON.parse(fs.readFileSync('db/fixtures/users.json', 'utf8'));
        var User = require('../models/user');
        logger.info("Создание пользователей.");
        users.forEach(function(user) {
            var u = new User(user);
            u.save(function(err) {
                if (err) logger.debug(err);
            });
        });
    },

    addGroups: function() {
        var groups = JSON.parse(fs.readFileSync('db/fixtures/groups.json', 'utf8'));
        var User = require('../models/user');
        var Exam = require('../models/exam');
        var Group = require('../models/group');
        logger.info("Создание групп.");
        groups.forEach(function(group) {
            User.findOne({username: group.username}, function(err, user) {
                if (err) return logger.debug(err);

                Exam.findOne({examId: group.examId}, function(err, exam) {
                    if (err) return logger.debug(err);

                    Group.create({exam: exam._id, user: user._id}, function(err, doc) {
                        if (err) logger.debug(err);
                    })
                })
            })
        });
    },

    addExams: function() {
        var exams = JSON.parse(fs.readFileSync('db/fixtures/exams.json', 'utf8'));
        var Exam = require('../models/exam');
        logger.info("Создание экзаменов.");
        exams.forEach(function(exam){
            Exam.create(exam, function(err, doc) {
                if (err) logger.debug(err);
            });
        });
    }
};

module.exports = fixtures;