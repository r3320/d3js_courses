var User = require('../models/user');
var storage = require('./storage');
var config = require('nconf');
module.exports = {
    auth: {
        local: function(username, password, done) {
            User.findOne({
                username: username
            }).select("+hashedPassword +salt").exec(function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!user.isActive()) {
                    return done(null, false, {
                        message: 'User is inactive.'
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        },
        openedu: function(prof, done) {
            var userData = {
                username: prof.username,
                firstname: prof.firstname,
                lastname: prof.lastname,
                email: prof.email,
                password: null,
                provider: config.get('auth:openedu:provider') || 'openedu'
            };
            User.findOne({
                username: userData.username
            }).exec(function(err, data) {
                if (err) {
                    return done(err);
                }
                if (!data) {
                    var user = new User(userData);
                    user.save(function(err, data) {
                        return done(err, data);
                    });
                }
                else {
                    if (!data.isActive()) {
                        return done(null, false, {
                            message: 'User is inactive.'
                        });
                    }
                    return done(null, data);
                }
            });
        },
        ifmosso: function(prof, done) {
            var userData = {
                username: prof.ssoid,
                firstname: prof.firstname,
                lastname: prof.lastname,
                middlename: prof.middlename,
                genderId: prof.gender,
                birthday: prof.birthdate,
                email: prof.email,
                password: null,
                provider: config.get('auth:ifmosso:provider') || 'ifmosso'
            };
            User.findOne({
                username: userData.username
            }).exec(function(err, data) {
                if (err) {
                    return done(err);
                }
                if (!data) {
                    var user = new User(userData);
                    user.save(function(err, data) {
                        return done(err, data);
                    });
                }
                else {
                    if (!data.isActive()) {
                        return done(null, false, {
                            message: 'User is inactive.'
                        });
                    }
                    return done(null, data);
                }
            });
        }
    },
    search: function(args, callback) {
        var query = {};
        if (args.data.role) query.role = Number(args.data.role);
        var rows = args.data.rows ? Number(args.data.rows) : 50;
        var page = args.data.page ? Number(args.data.page) - 1 : 0;
        // Query
        User.count(query, function(err, count) {
            if (err || !count) return callback(err);
            User.find(query).sort('lastname firstname middlename')
                .skip(rows * page).limit(rows).exec(function(err, data) {
                    callback(err, data, count);
                });
        });
    },
    get: function(args, callback) {
        //User.findById(args.userId).exec(callback);
        User.findById(args.userId).populate('completedCourses').exec(callback);
    },
    update: function(args, callback) {
        var data = args.data || {};
        var attach = data.attach;
        data.attach = storage.setId(data.attach);
        User.findByIdAndUpdate(args.userId, {
            '$set': data
        }, {
            'new': true
        }, function(err, user) {
            console.log(user);
            console.log(err);
            callback(err, user);
            // save virtual field
            if (data.password) {
                user.password = data.password;
                user.save();
            }
            // store attach
            //if (!err && data) storage.update(attach);
        });
    },
    add: function(args, callback) {
        var user = new User({
            firstname: args.data.firstname,
            password: args.data.password,
            lastname: args.data.lastname,
            middlename: args.data.middlename,
            gender: args.data.gender,
            birthday: args.data.birthday,
            email: args.data.email,
            citizenship: args.data.citizenship,
            documentType: args.data.documentType,
            documentNumber: args.data.documentNumber,
            documentIssueDate: args.data.documentIssueDate,
            address: args.data.address,
            description: args.data.description,
            role: args.data.role,
            active: args.data.active,
            username: args.data.username,
            provider: args.data.provider
        });
        user.save(callback);
    },
    remove: function(args, callback) {
        User.findOneAndRemove({
            _id: args.userId
        }, callback);
    }
};