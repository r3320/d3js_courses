//
define([
    "i18n",
    "text!templates/checkResult.html"
], function(i18n, template) {
    console.log('views/checkResult.js');
    var View = Backbone.View.extend({
        className: "ace-view",
        events: {
            "click .btn-theory": "openTheory",
            "click .btn-check": "checkResult",
            "click .btn-sample": "openSample",
            "click .btn-result": "openResult",
            "click .btn-overlay": "openOverlay",
            "click .btn-difference": "openDifference"
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
        },
        checkResult: function(event) {
            if (event) event.preventDefault();
            //Вернет canvas
            this.options.takeScreenshot();
            this.openResult();
            //console.log(canvas);
        },
        openResult: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-result").css("z-index", 100);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-result").addClass("active");
        },
        openSample: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-sample").css("z-index", 100);
            this.$(".panel-result").css("z-index", 1);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-sample").addClass("active");
        },
        openOverlay: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-overlay").css("z-index", 100);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-result").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").addClass("active");
        },
        openDifference: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-difference").css("z-index", 100);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-result").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").addClass("active");
        }
    });
    return View;
});