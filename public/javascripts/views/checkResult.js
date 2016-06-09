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
            "click .btn-difference": "openDifference",
            "click .btn-next": "openNextTask"
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
        render: function(currentTask) {
            var self = this;
            this.currentTask = currentTask;
            var tpl = _.template(this.templates['main-tpl']);
            var data = {
                i18n: i18n
            };
            this.$el.html(tpl(data));
            this.openSample();
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
            event.stopPropagation();
            this.options.openPopup();
        },
        checkResult: function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            var result = this.options.takeScreenshot("svg", "template-visual", this.checkDiff.bind(this), "sampleSvgel");
            console.log(result);
            if (result) this.openDifference();
        },
        /**
         * @param {String} sampleClass - first canvas class
         * @param {String} resultClass - second canvas class
         *
         */
        checkDiff: function(sampleClass, resultClass) {
            var self = this;
            var userResult = document.getElementsByClassName(resultClass)[0];
            var sample = document.getElementsByClassName(sampleClass)[0];
            app.sampleBase64 = sample.src;
            app.userResultBase64 = userResult.toDataURL("image/png", 0);
            //2 px погрешность
            console.log(imagediff.equal(userResult, sample, 2));
            resemble(userResult.toDataURL()).compareTo(sample.toDataURL()).onComplete(function(data) {
                console.log(data);
                var i = new Image();
                i.src = data.getImageDataUrl();
                console.log(i);
                if (document.querySelector(".panel-difference").firstChild) 
                document.querySelector(".panel-difference").removeChild(document.querySelector(".panel-difference").firstChild);
                document.querySelector(".panel-difference").appendChild(i);
                //TODO
                if (data.misMatchPercentage < 0.1) {
                    var completedCourses = app.profile.get("completedCourses");
                    console.log(completedCourses);
                    if (!completedCourses) {
                        completedCourses.push(self.currentTask.attributes._id);
                        app.profile.set("completedCourses", completedCourses);
                        app.profile.save();
                    } else {
                        if (_.indexOf(completedCourses, self.currentTask.attributes._id) == -1) {
                            completedCourses.push(self.currentTask.attributes._id);
                            app.profile.set("completedCourses", completedCourses);
                            app.profile.save();
                        }
                    }
                    self.$(".btn-next").css("display", "block");
                }
            });
        },
        openSample: function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            this.$(".panel-sample").css("z-index", 100);
            this.$(".panel-result").css("z-index", 1);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-sample").addClass("active");
        },
        openDifference: function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.$(".panel-difference").css("z-index", 100);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-result").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").addClass("active");
        },
        openNextTask: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var nextPage = Number.parseInt(this.currentTask.attributes.number + 1);
            app.router.navigate("main/" + nextPage, {
                trigger: true
            });
        },
        appendImage: function(taskModel) {
            event.preventDefault();
            var tmp = document.createElement("template");
            tmp.className = "template-visual";
            var svgel = document.createElement("svg");
            svgel.className = "svgel";
            
            document.body.appendChild(tmp);
            tmp.appendChild(svgel);
            
            var data = taskModel.attributes.taskData.data;
            var code = atob(taskModel.attributes.code);
            eval(code);
            console.log(code)
            //Задание
            var canvas = document.createElement("canvas");
            canvas.height = 300;
            canvas.width = 530;
            canvas.className = "sampleSvgel";
            
            //tmp.appendChild(canvas);
            document.querySelector(".panel-sample").appendChild(canvas);
            var ctx = canvas.getContext('2d');
            
            var DOMURL = window.URL || window.webkitURL || window;
            
            var svg = svgel.outerHTML;
            var img = new Image();
            var newsvg = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
            console.log(newsvg);
            var url = DOMURL.createObjectURL(newsvg);
            console.log(url);
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                console.log(ctx);
                DOMURL.revokeObjectURL(url);
            }
            img.src = url;
        }
    });
    return View;
});