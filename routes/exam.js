var express = require('express');
var router = express.Router();
var db = require('../db');
var logger = require('../common/logger');

router.choose_exam = function(req, res, next) {
    db.exam.findByExamId('1', function(err, exam) {
        if (err || !exam) {
            logger.debug("Не найден экзамен");
            return next();
        }

        req.session.examId = exam._id;
        req.session.save(function(err) {
            //if (err) logger.debug("Ошибка сохранения сессии");
            next();
        });
    });
};

router.create_verify = function(req, res, next) {
    db.group.getCurator(
        {examId: req.session.examId, userId: req.user._id},
        function(err, curatorId) {
            if (err || !curatorId) {
                logger.debug(err);
                return next();
            }

            logger.debug("find curator");

            db.verify.add(
                {
                    examId: req.session.examId,
                    curatorId: curatorId,
                    candidateId: req.user._id,
                    message: null,
                    submit: null
                },
                function (err, doc) {
                    logger.debug("created verify");
                    next();
                }
            )
        }
    );
};

router.get('/', function(req, res) {
    db.group.getExam(req.user._id, function(err, data){
        if (err || !data) res.status(400).end();
        else res.json(data.exam);
    })
});

module.exports = router;