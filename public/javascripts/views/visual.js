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
            app.iframe = this.doc;
            this.doc.body.setAttribute("margin", "0px");
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
        },
        takeScreenshot: function(callback) {
            var self = this;
            if (!this.doc.querySelector("svg")) return;
            if (document.querySelector(".panel-result").firstChild) {
                document.querySelector(".panel-result").removeChild(document.querySelector(".panel-result").firstChild);
            }
            /*html2canvas(this.doc.body, {
                onrendered: function(canvas) {
                    //Do things with output canvas
                    //self.doc.body.appendChild(canvas);
                    document.querySelector(".panel-result").appendChild(canvas);
                },
                width: 530,
                height: 300
            });*/
            var canvas = document.createElement("canvas");
            canvas.height = 300;
            canvas.width = 530;
            canvas.className = "userResult";
            
            document.querySelector(".panel-result").appendChild(canvas);
            
            var ctx = canvas.getContext('2d');
            
            var DOMURL = window.URL || window.webkitURL || window;
            
            //var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="svg" width="530" height="300"><g><circle r="10" cy="183" cx="10" style="fill: rgb(31, 119, 180);"></circle><text y="180" x="2" dy=".5em">17</text></g><g><circle r="40" cy="177" cx="106" style="fill: rgb(174, 199, 232);"></circle><text y="174" x="98" dy=".5em">18</text></g><g><circle r="80" cy="77" cx="266" style="fill: rgb(255, 127, 14);"></circle><text y="74" x="258" dy=".5em">19</text></g><g><circle r="80" cy="43" cx="34" style="fill: rgb(255, 187, 120);"></circle><text y="40" x="26" dy=".5em">20</text></g><g><circle r="40" cy="209" cx="394" style="fill: rgb(44, 160, 44);"></circle><text y="206" x="386" dy=".5em">21</text></g></svg>';
            var svg = this.doc.querySelector("svg").outerHTML;
            var img = new Image();
            var newsvg = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
            console.log(newsvg);
            var url = DOMURL.createObjectURL(newsvg);
            console.log(callback);
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                console.log(ctx);
                DOMURL.revokeObjectURL(url);
                callback();
            }
            img.src = url;
        }
    });
    return View;
});