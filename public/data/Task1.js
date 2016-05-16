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

//xmlns="http://www.w3.org/2000/svg" Добавить в <svg>

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
var svg = d3.select(".svg").attr("width", 530).attr("height", 300);
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