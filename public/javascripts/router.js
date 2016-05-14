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
            "main/:page": "main",
            "login": "login",
            "*path": "something"
        },
        render: function(View, options, auth) {
            if (auth || app.isAuth()) {
                if (app.content) {
                    app.content.destroy();
                }
                $body.html($content);
                options = options || {};
                options.el = $('#content');
                console.log(options.page)
                app.content = new View(options);
                app.content.render();
            } else {
                this.navigate("login", {
                    trigger: true
                });
            }
        },
        login: function() {
            var self = this;
            require([
                "views/login"
            ], function(View) {
                self.render(View, null, true);
            });
        },
        something: function() {
            if (app.isAuth()) {
                var role = app.profile.get("role");
                var navigate = "login";
                switch (role) {
                    case 1:
                        navigate = "start";
                        break;
                    case 2:
                        navigate = "start";
                        break;
                    case 3:
                        navigate = "start";
                        break;
                }
                this.navigate(navigate, {
                    trigger: true
                });
            }
            else {
                this.navigate("login", {
                    trigger: true
                });
            }
        },
        start: function() {
            var self = this;
            require([
                "views/start"
            ], function(View) {
                self.render(View);
            });
        },
        main: function(page) {
            var self = this;
            require([
                "views/main"
            ], function(View) {
                if (page) {
                    self.render(View, {page: page}, true);
                } else {
                    //self.render(View, null ,true);
                    this.navigate("start", {
                        trigger: true
                    });
                }
            });
        }
    });
    return Router;
});