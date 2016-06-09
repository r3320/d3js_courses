//
define([
    "i18n",
    "text!templates/start.html",
], function(i18n, template) {
    console.log('views/start.js');
    var View = Backbone.View.extend({
        events: {
            //"click .start-btn": "start"
            "click .logout-btn": "doLogout"
        },
        initialize: function(options) {
            var self = this;
            // Variables
            this.historyFlag = false;
            this.options = options || {};
            // Templates
            this.templates = _.parseTemplate(template);
            // Sub views
            this.view = {};
            
            var Courses = Backbone.Collection.extend({
                url: "/course",
                sort_key: "number", // default sort key
                comparator: function(item) {
                    return item.get(this.sort_key);
                },
                sortByField: function(fieldName) {
                    this.sort_key = fieldName;
                    this.sort();
                }
            });
            this.courses = new Courses();
            this.firstModelAt = 1;
            this.listenTo(this.courses, 'add', this.appendCourse);
            
            this.courseView = Backbone.View.extend({
                tagName: "tr",
                events: {
                    "click .start-course-btn": "start"
                },
                initialize: function() {
                    this.tpl = _.template(self.templates['course-td-tpl']);
                    this.listenTo(this.model, 'change', this.render);
                    this.listenTo(this.model, 'remove', this.remove);
                    this.listenTo(this.model, 'destroy', this.remove);
                },
                render: function(number) {
                    this.number = number;
                    var data = {
                        course: this.model.attributes
                    };
                    this.$el.html(this.tpl(data));
                    return this;
                },
                start: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    app.router.navigate("main/" + this.number, {
                        trigger: true
                    });
                }
            });
        },
        render: function() {
            var self = this;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            self.courses.fetch();
            //this.courses.fetch();
            this.$outputCoursesBody = this.$(".courses-body");
            return this;
        },
        destroy: function() {
            for (var v in this.view) {
                if (this.view[v]) this.view[v].destroy();
            }
            this.remove();
        },
        appendCourse: function(courseModel) {
            var self = this;
            var view = new this.courseView({
                model: courseModel
            });
            this.$outputCoursesBody.append(view.render(this.firstModelAt).el);
            this.firstModelAt++;
        },
        doLogout: function(event) {
            event.preventDefault();
            app.logout();
        }
    });
    return View;
});