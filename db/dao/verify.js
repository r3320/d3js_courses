var crypto = require('crypto');

var Verify = {
    // Добавление
    add: function (args, callback) {
        var verify = require('../models/verify');
        var User = require('../models/user');
        User.findById(args.candidateId, function (err, candidate) {
            if (err || !candidate) callback(err, candidate);

            var passport = {
                firstname: candidate.firstname,
                lastname: candidate.lastname,
                middlename: candidate.middlename,
                gender: candidate.gender,
                birthday: candidate.birthday,
                citizenship: candidate.citizenship,
                documentType: candidate.documentType,
                documentNumber: candidate.documentNumber,
                documentIssueDate: candidate.documentIssueDate
            };
            var verify_data = {
                exam: args.examId,
                curator: args.curatorId,
                candidate: args.candidateId,
                message: args.message,
                submit: args.submit,
                passport: passport,
                warnings: 0
            };
            verify_data.hash = crypto.createHash('md5').update(JSON.stringify(verify_data)).digest('hex');

            verify(verify_data).save(callback);
        });

    },

    update: function (args, callback) {
        var verify = require('../models/verify');

        verify.update(
            {_id: args.verifyId},
            {$set: {submit: args.submit}},
            callback);
    },

    addWarning: function(args, callback) {
        var verify = require('../models/verify');

        verify.update(
            {exam: args.examId, candidate: args.candidateId},
            {$inc: {warnings: 1}},
            callback
        )
    },

    list: function (args, callback) {
        var verify = require('../models/verify');

        var query = {
            exam: args.examId,
            submit: args.submit
        };

        if (args.curatorId) query.curator = args.curatorId;

        verify
            .find(query)
            .populate('candidate')
            .exec(callback);
    }
};

module.exports = Verify;