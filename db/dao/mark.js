var mark = {};

mark.list = function(args, callback) {
    var Mark = require('../models/mark');
    Mark.find({
        exam: args.examId,
        candidate: args.candidateId
    }).sort('time').exec(callback);
};

mark.add = function(args, callback) {
    var Mark = require('../models/mark');
    var mark = new Mark({
        exam: args.examId,
        curator: args.curatorId,
        candidate: args.candidateId,
        message: args.message
    });
    mark.save(callback);
};

module.exports = mark;