var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var db = require('../index');
var storage = {
    upload: function(files, callback) {
        if (!files) return;
        files.forEach(function(file, i, arr) {
            if (!file.uploadname) return;
            var fullname = path.join('uploads', path.basename(file.uploadname));
            fs.exists(fullname, function(exists) {
                if (!exists) return;
                var writestream = db.gfs.createWriteStream({
                    _id: file.fileId,
                    filename: file.filename
                });
                fs.createReadStream(fullname).pipe(writestream);
                writestream.on('close', function(data) {
                    if (callback) callback(data);
                    fs.unlink(fullname);
                });
            });
        });
    },
    download: function(fileId, callback) {
        db.gfs.findOne({
            _id: fileId
        }, function(err, data) {
            if (!err && data) {
                var readstream = db.gfs.createReadStream({
                    _id: fileId
                });
                readstream.pipe(callback(data));
            }
            else {
                callback();
            }
        });
    },
    remove: function(files, callback) {
        if (!files) return;
        if (!callback) callback = function() {};
        files.forEach(function(file, i, arr) {
            db.gfs.remove({
                _id: file.fileId
            }, callback);
        });
    },
    update: function(files) {
        if (!files) return;
        var attachAdd = [];
        var attachDel = [];
        for (var i = 0, l = files.length; i < l; i++) {
            if (files[i].removed) {
                attachDel.push(files[i]);
            }
            else {
                attachAdd.push(files[i]);
            }
        }
        storage.upload(attachAdd);
        storage.remove(attachDel);
    },
    setId: function(files) {
        if (!files) return;
        var attach = [];
        for (var i = 0, l = files.length; i < l; i++) {
            if (!files[i].fileId) {
                files[i].fileId = mongoose.Types.ObjectId();
            }
            if (!files[i].removed) {
                attach.push(files[i]);
            }
        }
        return attach;
    }
};
module.exports = storage;