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
            "click .btn-result": "openResult",
            "click .btn-overlay": "openOverlay",
            "click .btn-difference": "openDifference"
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
        render: function() {
            var self = this;
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
            this.options.openPopup();
        },
        checkResult: function(event) {
            if (event) event.preventDefault();
            
            this.options.takeScreenshot(this.checkDiff.bind(this));
            if (!document.querySelector(".userResult")) return;
            
            console.log("TEST");
            //this.checkDiff();
            this.openResult();
            //console.log(canvas);
        },
        checkDiff: function() {
            var userResult = document.querySelector(".panel-result").firstChild;
            var sample = document.querySelector(".panel-sample").firstChild;
            app.sampleBase64 = sample.src;
            app.userResultBase64 = userResult.toDataURL("image/png", 0);
            //app.userResultBase64 = userResult.toDataURL();
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
            });
        },
        openResult: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-result").css("z-index", 100);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-result").addClass("active");
        },
        openSample: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-sample").css("z-index", 100);
            this.$(".panel-result").css("z-index", 1);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-sample").addClass("active");
        },
        openOverlay: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-overlay").css("z-index", 100);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-result").css("z-index", 1);
            this.$(".panel-difference").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-difference").removeClass("active");
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").addClass("active");
        },
        openDifference: function(event) {
            if (event) event.preventDefault();
            
            this.$(".panel-difference").css("z-index", 100);
            this.$(".panel-overlay").css("z-index", 1);
            this.$(".panel-sample").css("z-index", 1);
            this.$(".panel-result").css("z-index", 1);
            
            this.$(".btn-result").removeClass("active");
            this.$(".btn-sample").removeClass("active");
            this.$(".btn-overlay").removeClass("active");
            this.$(".btn-difference").addClass("active");
        },
        /*
        appendImage: function(taskModel) {
            var image = new Image();
            image.src = taskModel.attributes.taskData;
            document.querySelector(".panel-sample").appendChild(image);
        },*/
        appendImage: function(taskModel) {
            event.preventDefault();
            var tmp = document.createElement("template");
            var svgel = document.createElement("svg");
            svgel.className = "svgel";
            
            document.body.appendChild(tmp);
            tmp.appendChild(svgel);
            
            //Задание
            var data = [
                {name: "Nikolay", value: 20},
                {name: "Alena", value: 20},
                {name: "Ruslan", value: 19},
                {name: "Vika", value: 21},
                {name: "Anna", value: 21},
                {name: "Katya", value: 20},
                {name: "Dima", value: 17},
                {name: "Nikita", value: 19},
                {name: "Vlad", value: 20},
                {name: "Artem", value: 21},
                {name: "Nastya", value: 19},
                {name: "Vera", value: 18},
                {name: "Nikita", value: 19},
                {name: "Vlad", value: 20},
                {name: "Artem", value: 18},
                {name: "Nastya", value: 19},
                {name: "Vera", value: 20},
                {name: "Artem", value: 21},
                {name: "Nastya", value: 19},
                {name: "Vera", value: 18},
                {name: "Nikita", value: 19},
                {name: "Vlad", value: 20},
                {name: "Artem", value: 18},
                {name: "Nastya", value: 19},
                {name: "Vera", value: 20}
            ];
            var justValues = [];
            
            data.forEach(function (item, index, array) {
                justValues.push(item.value);
            });
            
            function counter(justValues) {
                var values = [], counts = [], prev;
            
                justValues.sort();
                for ( var i = 0; i < justValues.length; i++ ) {
                    if ( justValues[i] !== prev ) {
                        values.push(justValues[i]);
                        counts.push(1);
                    } else {
                        counts[counts.length-1]++;
                    }
                    prev = justValues[i];
                }
            
                return [values, counts];
            }
            var mas = counter(justValues);
            var values = mas[0];
            var counts = mas[1];
            
            var color = d3.scale.category20();
            
            function getRandom(min, max, precision) {
                return (min + (Math.random() * (max - min))).toFixed(precision);
            }
            
            
            
            //Время ебучих костылей
            //Будет засовывать в массивы по порядку значения, которые рандомятся для
            //куржков и потом по этим значениям проставлять циферки к кружкам.
            var tempX = [];
            var tempY = [];
            //Два сета, чтоб делать на каждый массив shift() и не париться
            var Y = [183, 177, 77, 43, 209];
            var X = [10, 106, 266, 34, 394];
            var Y1 = [183, 177, 77, 43, 209];
            var X1 = [10, 106, 266, 34, 394];
            var svg = d3.select(".svgel").attr("width", 530).attr("height", 300).attr("xmlns", "http://www.w3.org/2000/svg");
            var g = svg.selectAll("g")
            //Вставим столько кругов, сколько уникальных возрастов
                            .data(values).enter().append("g");
            //Чем больше людей с одинаковым возрастом, тем больше круг
            g.append("circle").attr("r", function(d) {
                                return counts[values.indexOf(d)] * 10;
                            })
                            .attr("cy", function() {
                                var y = Y.shift();
                                return y;
                            })
                            .attr("cx", function(d, i) {
                                //return i * 100 + 50;
                                var x = X.shift();
                                return x;
                            })
                            .style("fill", function(d,i) {
                                return color(i);
                            });
            g.append("text").attr("y", function() {
                                //return getRandom(0, 300, 0);
                                var y = Y1.shift();
                                return y - 3;
                            })
                            .attr("x", function(d, i) {
                                var x = X1.shift();
                                return x - 8;
                            })
                            .attr("dy", ".5em")
                            .text(function(d) { return d;});
            //Задание кончилось
            
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