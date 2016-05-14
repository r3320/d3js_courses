var express = require('express');
var router = express.Router();
var courses = require('../db/dao/course');
// List all courses
router.get('/', function(req, res) {
    var args = {};
    courses.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Create new course
router.post('/', function(req, res) {
    var args = {
        data: req.body
    };
    courses.add(args, function(err, data) {
        if (!err && data) {
            res.status(200).end();
        }
        else {
            res.status(400).end();
        }
    });
});
module.exports = router;