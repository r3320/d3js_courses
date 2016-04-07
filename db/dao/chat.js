var Chat = require('../models/chat');
var Verify = require('../models/verify');
var storage = require('./storage');
var logger = require('../../common/logger');
// Populate options
var opts = [{
    path: 'author',
    select: 'firstname lastname middlename'
}, {
    path: 'recipient',
    select: 'firstname lastname middlename'
}];
module.exports = {
    list: function(args, callback) {
        Chat.find({
            exam: args.examId
        }).populate(opts).sort('created').exec(callback);
    },
    add: function(args, callback) {
        var chat = new Chat({
            exam: args.examId,
            author: args.userId,
            recipient: args.data.recipient,
            message: args.data.message,
            mark: args.data.mark,
            attach: storage.setId(args.data.attach)
        });
        chat.save(function(err, data) {
            if (err || !data) callback(err, data);
            else {
                Chat.populate(data, opts, callback);
                storage.upload(args.data.attach);
            }
        });
    }
};