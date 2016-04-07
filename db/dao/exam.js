exam = {
    findByExamId: function(examId, callback) {
        var Exam = require('../models/exam');
        Exam.findOne({examId: examId}, callback);
    }
}

module.exports = exam;