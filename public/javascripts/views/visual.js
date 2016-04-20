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
            // Scripts for iframe
            this.defaultScripts = [
                "bower_components/jquery/dist/jquery.min.js",
                "bower_components/d3/d3.min.js"
            ];
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            var iframe = this.$(".visual-iframe")[0];
            this.doc =  iframe.contentDocument || iframe.contentWindow.document;
            
            this.loadDefaultScripts();
            return this;
        },
        loadDefaultScripts: function() {
            for (var s in this.defaultScripts) {
                var el = this.doc.createElement("script");
                el.src = this.defaultScripts[s];
                this.doc.head.appendChild(el);
            }
        },
        destroy: function() {
            this.remove();
        },
        loadScript: function(scriptContent) {
            if (this.doc.querySelector(".d3script")) {
                var el = this.doc.querySelector(".d3script");
                el.parentNode.removeChild(el);
            }
            this.scr = this.doc.createElement('script');
            this.scr.className = "d3script";
            this.scr.textContent = scriptContent;
            this.doc.head.appendChild(this.scr);
        }
    });
    return View;
});