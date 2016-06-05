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
                "bower_components/d3/d3.min.js",
                "bower_components/moment/moment.js"
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
            app.iframe = this.doc;
            this.doc.body.setAttribute("style", "margin: 0;");
            this.doc.body.setAttribute("overflow-y", "hidden;");
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
        loadScript: function(scriptClassName, scriptContent) {
            var el = this.doc.getElementsByClassName(scriptClassName)[0];
            if (el) {
                el.parentNode.removeChild(el);
            }
            this.scr = this.doc.createElement('script');
            this.scr.className = scriptClassName;
            this.scr.textContent = scriptContent;
            this.doc.head.appendChild(this.scr);
        },
        /**
         * @param {String} userSvgClass - svg студента, но основе которого делаем канвас
         * @param {String} outputClass - Класс контейнера, куда вставим новый канвас
         * @param {checkDiff} callback(sampleClass, resultClass) - метод checkDiff из view checkResult
         * @param {String} sampleSvgel - Класс примера, который передадим в callback
         * return true - если метод выполнился успешно, false - если нечего проверять
         */
        takeScreenshot: function(userSvgClass, outputClass, callback, sampleSvgel) {
            var self = this;
            //Проверяем, есть ли svg в iframe
            var userSvgElem = this.doc.getElementsByTagName(userSvgClass)[0];
            if (!userSvgElem) return false;
            //Проверяем, есть ли в <template=outputClass> канвас с результатом студента .user-result
            var outputElem = document.getElementsByClassName(outputClass)[0];
            var userResult = outputElem.getElementsByClassName("user-result")[0];
            //Если есть - удаляем
            if (userResult) {
                outputElem.removeChild(userResult);
            }
            
            var canvas = document.createElement("canvas");
            canvas.height = 300;
            canvas.width = 530;
            canvas.className = "user-result";
            
            outputElem.appendChild(canvas);
            
            var ctx = canvas.getContext('2d');
            
            var DOMURL = window.URL || window.webkitURL || window;
            
            var svgOuterHtml = userSvgElem.outerHTML;
            
            var img = new Image();
            var newsvg = new Blob([svgOuterHtml], {type: 'image/svg+xml;charset=utf-8'});
            
            var url = DOMURL.createObjectURL(newsvg);
            
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                console.log(ctx);
                DOMURL.revokeObjectURL(url);
                callback(sampleSvgel, "user-result");
            }
            img.src = url;
            return true;
        }
    });
    return View;
});