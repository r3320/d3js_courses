//
// Verify view
//
define([
    "i18n",
    "text!templates/main.html",
    "views/taskPopup",
    "views/aceView",
    "views/visual",
    "views/checkResult"
], function(i18n, template, TaskPopupView, AceView, VisualView, CheckResultView) {
    console.log('views/main.js');
    var View = Backbone.View.extend({
        events: {
            "click .active-js": "openJs",
            "click .active-html": "openHtml",
            "click .active-data": "openData",
            "click .logout-btn": "doLogout"
        },
        initialize: function(options) {
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {
                aceView: new AceView({
                    postHtml: this.postHtml.bind(this),
                    postJs: this.postJs.bind(this)
                }),
                visual: new VisualView(),
                checkResult: new CheckResultView({
                    openPopup: this.openPopup.bind(this),
                    takeScreenshot: this.takeScreenshot.bind(this)
                })
            };
            this.firstModelAt = options.page;
            var Tasks = Backbone.Collection.extend({
                //url: "data/tasks.json"
                url: "/course"
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
            //АХТУНГ - aceView.render() возвращает this.editor !!!
            this.htmlAce = this.view.aceView.setElement(this.$('.panel-code-html')).render("", true);
            this.jsAce = this.view.aceView.setElement(this.$('.panel-code-js')).render("javascript", true);
            this.dataAce = this.view.aceView.setElement(this.$('.panel-code-data')).render("data", false);
            
            //this.view.checkResult.setElement(this.$('.panel-check-result')).render();
            this.tasks.fetch({
                success: function(collection, response, options) {
                    //self.currentTask = collection.at(self.firstModelAt);
                    self.currentTask = collection.findWhere({number: eval(self.firstModelAt)});
                    self.view.checkResult.setElement(this.$('.panel-check-result')).render(self.currentTask);
                    self.numberOfTasks = collection.length;
                    self.openPopup(self.currentTask, self.numberOfTasks);
                    //Вставим изображение в панель примера
                    self.view.checkResult.appendImage(self.currentTask);
                    self.dataAceActions(self.currentTask);
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
            if (!taskModel && !numberOfTasks) {
                taskModel = self.currentTask;
                numberOfTasks = self.numberOfTasks;
            }
            this.dialog.realize();
            self.view.taskPopup.setElement(this.dialog.getModalDialog()).render(taskModel, numberOfTasks);
            this.dialog.open();
        },
        postHtml: function(editor) {
            var self = this;
            editor.getSession().on("change", function(event) {
                try {
                    self.view.visual.doc.body.innerHTML = editor.getValue();
                    
                    //Обновим скрипт в iframe из js Ace
                    self.view.visual.loadScript(self.jsAce.getValue());
                } catch(e) {
                    console.log(e);
                }
            });
        },
        postJs: function(editor) {
            var self = this;
            editor.getSession().on("change", function(event) {
                //Обновим iframe контент из html Ace
                self.view.visual.doc.body.innerHTML = self.htmlAce.getValue();
                
                self.lastUpdatedTime = moment.now();
                
                setTimeout(function() {
                    if (!self.lastUpdatedTime || moment().diff(self.lastUpdatedTime) > 1000) {
                        self.view.visual.loadScript(editor.getValue());
                    }
                }, 1000);
                //self.lastUpdatedTime = moment.now();
            });
            self.view.visual.loadScript(editor.getValue());
            console.log("test1");
        },
        openHtml: function(event) {
            event.preventDefault();
            this.$(".active-js").removeClass("active");
            this.$(".active-data").removeClass("active");
            this.$(".panel-code-js").css("z-index", "10");
            this.$(".panel-code-data").css("z-index", "10");
            this.$(".active-html").addClass("active");
            this.$(".panel-code-html").css("z-index", "100");
        },
        openData: function(event) {
            event.preventDefault();
            this.$(".active-js").removeClass("active");
            this.$(".active-html").removeClass("active");
            this.$(".panel-code-js").css("z-index", "10");
            this.$(".panel-code-html").css("z-index", "10");
            this.$(".active-data").addClass("active");
            this.$(".panel-code-data").css("z-index", "100");
        },
        openJs: function(event) {
            event.preventDefault();
            this.$(".active-html").removeClass("active");
            this.$(".active-data").removeClass("active");
            this.$(".panel-code-html").css("z-index", "10");
            this.$(".panel-code-data").css("z-index", "10");
            this.$(".active-js").addClass("active");
            this.$(".panel-code-js").css("z-index", "100");
        },
        doLogout: function(event) {
            event.preventDefault();
            app.logout();
        },
        takeScreenshot: function(callback) {
            return this.view.visual.takeScreenshot(callback);
        },
        dataAceActions: function(currentTask) {
            if (!currentTask.attributes.taskData.data) return;
            
            var figureRe = /},/gi;
            var squareRe = /],/gi;
            var newFigureRe = "},\n";
            var newSquareRe = "],\n";
            
            if (currentTask.attributes.taskData.data) {
                var figureStr = JSON.stringify(currentTask.attributes.taskData.data).replace(figureRe, newFigureRe);
                figureStr = figureStr.replace(squareRe, newSquareRe);
            }
            
            if (currentTask.attributes.taskData.helpData) {
                var squareStr = JSON.stringify(currentTask.attributes.taskData.helpData).replace(squareRe, newSquareRe);
                squareStr = squareStr.replace(figureRe, newFigureRe);
            }
            
            if (currentTask.attributes.taskData.dataInfo) {
                this.dataAce.insert("//" + currentTask.attributes.taskData.dataInfo + "\n");
            }
            if (figureStr) {
                this.dataAce.insert(figureStr);
            }
            
            this.dataAce.insert("\n\n");
            
            if (currentTask.attributes.taskData.helpInfo) {
                this.dataAce.insert("//" + currentTask.attributes.taskData.helpInfo + "\n");
            }
            if (squareStr) {
                this.dataAce.insert(squareStr);
            }
        }
    });
    return View;
});