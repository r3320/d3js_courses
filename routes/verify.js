var express = require('express');
var router = express.Router();
var db = require('../db');
var fs = require('fs');

// Получить список всех кандидатов на проверку
router.get('/', function(req, res) {
    var examId = req.session.examId;
    db.verify.list({examId: examId, curatorId: req.user._id, submit: null}, function(err, data) {
        if (err) res.status(400).end();
        else res.json(data);
    });
});

// подтвердить идентификацию кандидата
router.put('/:verifyId', function(req, res) {
    var args = {
        verifyId: req.params.verifyId,
        submit: req.body.submit
    };
    db.verify.update(args, function(err) {
        if (err) res.status(400).end();
        else res.status(200).end();
    });
});
module.exports = router;