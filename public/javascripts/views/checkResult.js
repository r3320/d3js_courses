//
define([
    "i18n",
    "text!templates/checkResult.html"
], function(i18n, template) {
    console.log('views/checkResult.js');
    var View = Backbone.View.extend({
        className: "ace-view",
        events: {
            "click .btn-theory": "openTheory"
        },
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
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.remove();
        },
        openTheory: function(event) {
            event.preventDefault();
            this.options.openPopup();
        }
    });
    return View;
});