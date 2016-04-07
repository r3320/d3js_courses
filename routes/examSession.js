var express = require('express');
var router = express.Router();
var db = require('../db');

// получить сессию эказмена для кандидата
router.get('/', function(req, res) {
    var args = {
        examId: req.session.examId,
        userId: req.query.userId
    };
    db.examSession.find(args, function(err, data) {
        if (!err && data) {
            // Подсчитывает общее кол-во отвеченных вопросов
            data.answered = 0;
            data.questions.forEach(function(q) {
                data.answered += q.answered ? 1 : 0;
            });

            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});

module.exports = router;