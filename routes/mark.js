var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res) {
    var args = {
        examId: req.query.examId,
        candidateId: req.query.candidateId
    };
    db.mark.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});

router.post('/', function(req, res) {
    var args = {
        examId: args.examId,
        curatorId: args.curator,
        candidateId: args.candidateId,
        message: args.message
    };
    db.mark.add(args, function(err, data) {
        if (!err && data) {
            res.json(data);
            //req.notify('notes-' + args.examId, {
            //    userId: args.author
            //});
        }
        else {
            res.status(400).end();
        }
    });
});
module.exports = router;