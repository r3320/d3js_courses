//
define([
    "i18n",
    "text!templates/aceView.html",
    "ace/ace"
], function(i18n, template, ace) {
    console.log('views/aceView.js');
    var View = Backbone.View.extend({
        className: "ace-view",
        initialize: function(options) {
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {};
            this.ace = ace;
        },
        render: function(mode, postInIframe) {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n,
                ace: ace
            };
            this.$el.html(tpl(data));
            console.log("aceViewRender");
            
            this.mode = mode;
            var elementToEdit = this.$("#editor")[0];
            this.editor = ace.edit(elementToEdit);
            this.editor.setTheme("ace/theme/textmate");
            console.log(mode);
            if (mode && _.isString(mode) && mode != "") {
                if (mode == "js") {
                    mode = "javascript";
                }
                this.editor.getSession().setMode("ace/mode/"+mode);
                if (postInIframe) this.options.postJs(this.editor);
            } else {
                this.editor.getSession().setMode("ace/mode/html");
                if (postInIframe) this.options.postHtml(this.editor);
            }
            return this.editor;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.remove();
        }
    });
    return View;
});