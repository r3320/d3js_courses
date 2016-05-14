//
// Login view
//
define([
    "i18n",
    "text!templates/login.html"
], function(i18n, template) {
    console.log('login.js');
    var View = Backbone.View.extend({
        events: {
            "submit": "submit"
        },
        initialize: function() {
            this.templates = _.parseTemplate(template);
        },
        destroy: function() {
            this.remove();
        },
        render: function() {
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            this.$Form = this.$("form[name='auth-plain']");
            this.$Username = this.$("input[name='username']");
            this.$Password = this.$("input[name='password']");
            this.$Form.validator();
            return this;
        },
        submit: function(e) {
            var self = this;
            if (!e.isDefaultPrevented()) {
                app.login(this.getUsername(), this.getPassword(),
                    function() {
                        self.resetForm();
                    });
            }
            return false;
        },
        resetForm: function() {
            this.$Username.focus();
            this.$Form.trigger("reset");
        },
        getUsername: function() {
            return this.$Username.val();
        },
        getPassword: function() {
            return this.$Password.val();
        }
    });
    return View;
});