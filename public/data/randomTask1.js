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

var svg = d3.select(".svg").attr("width", 530).attr("height", 300);
var g = svg.selectAll("g")
//Вставим столько кругов, сколько уникальных возрастов
                .data(values).enter().append("g");
//Чем больше людей с одинаковым возрастом, тем больше круг
g.append("circle").attr("r", function(d) {
                    return counts[values.indexOf(d)] * 10;
                })
                .attr("cy", function() {
                    var y = getRandom(0, 300, 0);
                    tempY.push(y);
                    console.log(y);
                    return y;
                })
                .attr("cx", function(d, i) {
                    //return i * 100 + 50;
                    var x = counts[values.indexOf(d)] * getRandom(0, 26, 0) * i + 10;
                    console.log(x);
                    tempX.push(x);
                    return x;
                })
                .style("fill", function(d,i) {
                    return color(i);
                });
g.append("text").attr("y", function() {
                    //return getRandom(0, 300, 0);
                    var y = tempY.shift();
                    console.log(y);
                    return y - 3;
                })
                .attr("x", function(d, i) {
                    var x = tempX.shift();
                    console.log(x);
                    return x - 8;
                })
                .attr("dy", ".5em")
                .text(function(d) { return d;});