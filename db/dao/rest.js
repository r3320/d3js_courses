module.exports = {
    create: function(args, callback) {
        try {
            var model = require('../models/' + args.collection);
            model.create(args.data, callback);
        }
        catch (err) {
            return callback(err);
        }
    },
    read: function(args, callback) {
        try {
            var model = require('../models/' + args.collection);
            var transaction = model.find(args.query);
            if (args.skip) transaction.skip(args.skip);
            if (args.limit) transaction.limit(args.limit);
            if (args.sort) transaction.sort(args.sort);
            if (args.select) transaction.select(args.select);
            if (args.populate) transaction.populate(args.populate);
            transaction.exec(callback);
        }
        catch (err) {
            return callback(err);
        }
    },
    update: function(args, callback) {
        try {
            var model = require('../models/' + args.collection);
            model.findByIdAndUpdate(args.documentId, args.data, {
                'new': true
            }, callback);
        }
        catch (err) {
            return callback(err);
        }
    },
    delete: function(args, callback) {
        try {
            var model = require('../models/' + args.collection);
            model.findByIdAndRemove(args.documentId, callback);
        }
        catch (err) {
            return callback(err);
        }
    }
};