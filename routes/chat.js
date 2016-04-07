var express = require('express');
var router = express.Router();
var chat = require('../db/dao/chat');
var verify = require('../db/dao/verify');
// List all messages
router.get('/', function(req, res) {
    var args = {
        examId: req.session.examId,
        data: req.query
    };
    chat.list(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});
// Create new message
router.post('/', function(req, res) {
    var args = {
        examId: req.session.examId,
        userId: req.user._id,
        data: req.body
    };
    chat.add(args, function(err, data) {
        if (!err && data) {
            res.json(data);
            req.notify('chat-' + args.examId, data);
        }
        else {
            res.status(400).end();
        }
    });
    if (req.body.mark) {
        verify.addWarning(
            {examId: req.session.examId, candidate: req.body.recipient},
            function (err, data) {
                if (!err) {
                    req.notify('warnings/'+args.examId);
                }
            });
    }

});
module.exports = router;