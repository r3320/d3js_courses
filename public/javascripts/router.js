//
// Router
//
define([], function() {
    console.log('router.js');
    var $body = $('body');
    var $content = $('<div id="content"></div>');
    var Router = Backbone.Router.extend({
        routes: {
            "start": "start",
            "main": "main",
            "*path": "something"
        },
        render: function(View, options) {
            if (app.content) {
                app.content.destroy();
            }
            $body.html($content);
            options = options || {};
            options.el = $('#content');
            app.content = new View(options);
            app.content.render();
        },
        something: function() {
            this.navigate("start", {
                trigger: true
            });
        },
        start: function() {
            var self = this;
            require([
                "views/start"
            ], function(View) {
                self.render(View);
            });
        },
        main: function() {
            var self = this;
            require([
                "views/main"
            ], function(View) {
                self.render(View);
            });
        }
    });
    return Router;
});