var Course = require('../models/course');
module.exports = {
    add: function(args, callback) {
        var course = new Course({
            number: args.data.number,
            taskName: args.data.taskName,
            taskDescription: args.data.taskDescription
        });
        course.save(callback);
    },
    list: function (args, callback) {
        //Course.find({}, callback);
        Course.find({}).sort({"number": 1}).exec(callback);
    }
}