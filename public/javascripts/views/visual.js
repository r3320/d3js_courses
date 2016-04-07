//
define([
    "i18n",
    "text!templates/visual.html"
], function(i18n, template) {
    console.log('views/visual.js');
    var View = Backbone.View.extend({
        className: "visual-view",
        initialize: function(options) {
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {};
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            return this;
        },
        destroy: function() {
            this.remove();
        }
    });
    return View;
});