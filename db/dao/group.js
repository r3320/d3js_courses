var Group = {
    // Добавление
    add: function (args, callback) {
        var group = require('../models/group');
        var User = require('../models/user');
        User.findOne({username: args.username}, function(err, user) {
            if (err || !data) callback(err, data);

            group.create(
                {user: user._id, exam: args.examId},
                callback);
        });
    },

    // Список всех участников экзамена
    list: function (examId, callback) {
        var group = require('../models/group');
        group
            .find({exam: examId})
            .populate('user')
            .sort('-_id')
            .exec(callback);
    },
    
    getExam:function(userId, callback) {
        var group = require('../models/group');
        group
            .findOne({user: userId})
            .populate('exam')
            .exec(callback);
    },

    getCurator: function(args, callback) {
        Group.list(args.examId, function(err, groups) {
            if (err || !groups) callback(err);

            var curators = groups.filter(function( group ) {
                return group.user.role ==  2;
            });

            var candidates = groups.filter(function ( group ) {
                return group.user.role ==  1;
            });

            var index = null;
            candidates.forEach(function( group, i ) {
                if (group.user._id.equals(args.userId)) index = i;
            });

            if (index == null) {
                callback(new Error("Candidate not found."), null)
            } else {
                var curator = curators[index % curators.length];
                callback(null, curator.user._id)
            }
        })
    }
};

module.exports = Group;