//
// Verify view
//
define([
    "i18n",
    "text!templates/main.html",
    "views/taskPopup",
    "views/aceView",
    "views/visual"
], function(i18n, template, TaskPopupView, AceView, VisualView) {
    console.log('views/main.js');
    var View = Backbone.View.extend({
        initialize: function(options) {
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {
                aceView: new AceView({
                    postInIframe: this.postInIframe.bind(this)
                }),
                visual: new VisualView()
            };
            this.firstModelAt = 0;
            var Tasks = Backbone.Collection.extend({
                url: "data/tasks.json"
            });
            this.tasks = new Tasks();
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            this.view.visual.setElement(this.$(".panel-view-result")).render();
            this.htmlViewEl = this.view.aceView.setElement(this.$('.panel-code-html')).render("", true);
            this.jsViewEl = this.view.aceView.setElement(this.$('.panel-code-js')).render("javascript", false)
            //this.$('panel-code-html').html(this.view.aceView.render().el);
            this.tasks.fetch({
                success: function(collection, response, options) {
                    var currentTask = collection.at(self.firstModelAt);
                    var numberOfTasks = collection.length;
                    console.log(currentTask);
                    self.openPopup(currentTask, numberOfTasks);
                }
            });
            return this;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.remove();
        },
        openPopup: function(taskModel, numberOfTasks) {
            var self = this;
            this.view.taskPopup = new TaskPopupView();
            this.dialog = new BootstrapDialog({
                onhidden: function() { 
                    self.view.taskPopup.destroy();
                },
                draggable: true
            });
            this.dialog.realize();
            self.view.taskPopup.setElement(this.dialog.getModalDialog()).render(taskModel, numberOfTasks);
            this.dialog.open();
        },
        postInIframe: function(editor) {
            var iframe = this.view.visual.$(".visual-iframe")[0];
            var doc = iframe.contentDocument;
            console.log(doc);
            editor.getSession().on("change", function() {
                doc.write(editor.getValue());
            });
        }
    });
    return View;
});