var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res) {
    var examId = req.session.examId;
    db.verify.list({examId: examId,  submit: true}, function(err, data) {
        if (err) res.status(400).end();
        else res.json(data);
    });
});

module.exports = router;