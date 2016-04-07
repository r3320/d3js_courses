define([
    "i18n",
    "text!templates/taskPopup.html",
], function(i18n, template) {
    console.log('views/taskPopup.js');
    var View = Backbone.View.extend({
        className: "taskPopup",
        initialize: function(options) {
            // Variables
            var self = this;
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
        },
        render: function(taskModel, numberOfTasks) {
            var self = this;
            var data = {
                i18n: i18n,
                taskModelAttributes: taskModel.attributes,
                numberOfTasks: numberOfTasks
            };
            var tpl = _.template(this.templates['main-tpl']);
            this.$el.html(tpl(data));
            return this;
        },
        destroy: function() {
            this.remove();
        }
    });
    return View;
});