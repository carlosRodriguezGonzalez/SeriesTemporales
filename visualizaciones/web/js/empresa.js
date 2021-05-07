let empresa;
let nombre;

let dateIndex;
let openIndex;
let closeIndex;
let highIndex;
let lowIndex;
let volumeIndex;
let smaIndex;

let dataValues;
const dataLine = [];
const dataCandle = [];
const dataVolume = [];
const dataSMA = [];

var chartCandle;
var optionsCandle;

const init = async function() {
    empresa = localStorage.getItem("ticker");
    nombre = localStorage.getItem("nombreEmpresa")
    document.getElementById("nombreEmpresa").innerHTML = nombre;


    let btn_1d = document.getElementById("btn_1d");
    let btn_5d = document.getElementById("btn_5d");
    let btn_14d = document.getElementById("btn_14d");
    let btn_30d = document.getElementById("btn_30d");
    let btn_60d = document.getElementById("btn_60d");
    let btn_90d = document.getElementById("btn_90d");
    let btn_1a = document.getElementById("btn_1a");
    let btn_5a = document.getElementById("btn_5a");
    let btn_max = document.getElementById("btn_max");
    btn_1d.addEventListener('click', function (){
        let minData = setMaxDatos(1);
        formatData(minData);
        renderChart(minData);
    });
    btn_5d.addEventListener('click', function (){
        let minData = setMaxDatos(5);
        formatData(minData);
        renderChart(minData);

    });
    btn_14d.addEventListener('click', function (){
        let minData = setMaxDatos(14);
        formatData(minData);
        renderChart(minData);
    });
    btn_30d.addEventListener('click', function (){
        let minData = setMaxDatos(30);
        formatData(minData);
        renderChart(minData);
    });
    btn_60d.addEventListener('click', function (){
        let minData = setMaxDatos(60);
        formatData(minData);
        renderChart(minData);
    });
    btn_90d.addEventListener('click', function (){
        let minData = setMaxDatos(90);
        formatData(minData);
        renderChart(minData);
    });
    btn_1a.addEventListener('click', function (){
        let minData = setMaxDatos(365);
        formatData(minData);
        renderLine();
    });
    btn_5a.addEventListener('click', function (){
        let minData = setMaxDatos(1826);
        formatData(minData);
        renderLine();
    });
    btn_max.addEventListener('click', function (){
        let minData = setMaxDatos(0);
        formatData(minData);
        renderLine();
    });

    await getData();
}

const setValoresInicio = (data) => {

const headers = data.shift();

dateIndex = headers.findIndex((x) => x === "Date");
openIndex = headers.findIndex((x) => x === "open");
closeIndex = headers.findIndex((x) => x === "close");
highIndex = headers.findIndex((x) => x === "high");
lowIndex = headers.findIndex((x) => x === "low");
volumeIndex = headers.findIndex((x) => x === "volume");
smaIndex = headers.findIndex((x) => x === "open_2_sma");

let precioMaximo = redondear(parseFloat(data[data.length-1][highIndex]),3);
let precioMinimo = redondear(parseFloat(data[data.length-1][lowIndex]),3);
let volumen = redondear(parseFloat(data[data.length-1][volumeIndex]),3);
let precioCambioRaw = redondear(parseFloat(data[data.length-1][closeIndex]),5) - redondear(parseFloat(data[data.length-1][openIndex]),5);
let precioCambio = redondear(precioCambioRaw,4);
let precioCompra = redondear(parseFloat(data[data.length-1][closeIndex]),2);


console.log("precios del dia " + data[data.length-1][dateIndex]);
document.getElementById("precioMaximo").innerHTML = precioMaximo;
document.getElementById("precioMinimo").innerHTML = precioMinimo;
document.getElementById("volumen").innerHTML = volumen;
document.getElementById("precioCambio").innerHTML = precioCambio;
document.getElementById("FormRow-BUY-price1").value = precioCompra;

(precioCambio > 0) ? document.getElementById("precioCambio").style.color = "green" : document.getElementById("precioCambio").style.color = "red";

}

const formatData = (data) =>{

    dataVolume.length = 0;
    dataCandle.length = 0;
    dataSMA.length = 0;
    dataLine.length = 0;

    data.forEach((x,index) => {
        if (index === 0) return;
        //
        const tempLine = {};
        tempLine.x = new Date(x[dateIndex]).getTime();
        tempLine.y = [redondear(x[closeIndex],3)];

        const tempCandle = {};
        tempCandle.x = new Date(x[dateIndex]).getTime();
        tempCandle.y = [+redondear(x[openIndex],3), +redondear(x[highIndex],3), +redondear(x[lowIndex],3), +redondear(x[closeIndex],3)];

        const tempVolume = {};
        tempVolume.x = new Date(x[dateIndex]).getTime();
        tempVolume.y = [redondear(x[volumeIndex],3)];

        const tempSMA = {};
        tempSMA.x = new Date(x[dateIndex]).getTime();
        tempSMA.y = +redondear(x[smaIndex],3);


        dataLine.push(tempLine);
        dataCandle.push(tempCandle);
        dataVolume.push(tempVolume);
        dataSMA.push(tempSMA)

    });
}

const renderLine = () => {

    let chartOld = document.getElementById("chart-candlestick");
    let chartNew = document.getElementById("chart-line");
    chartOld.hidden = true;
    chartNew.hidden = false;


    var optionsLine = {
        series: [
            {
                data: dataLine,
            },
        ],
        chart: {
            animations: {
                enabled: false,
            },
        },
        xaxis: {
            type: "datetime",
        },
        tooltip: {
            shared: true,
            custom: function ({seriesIndex, dataPointIndex, w}) {
                return (
                    '<div class="arrow_box">' +
                    "<span>" + "Cierre: " + w.globals.series[seriesIndex][dataPointIndex] + "</span>" +
                    "</div>"
                )
            },
        },
        stroke: {
            width: 1.25,
            colors: ["#f00"],
        },
    };

    var chartLine = new ApexCharts(document.querySelector("#chart-line"), optionsLine);
    chartLine.render();
}

const renderChart = (data) => {
    let chartOld = document.getElementById("chart-line");
    let chartNew = document.getElementById("chart-candlestick");
    chartOld.hidden = true;
    chartNew.hidden = false;


    let xMin;
    let xMax;

    // TODO: esta grafica muestra la media movil pero habria que configurarla + varios bugs de la libreria; por ahora no se utiliza
    var optionsCandleIndicator = {
        series: [{
            name: 'SMA',
            type: 'line',
            data: dataSMA,
        }, {
            name: 'Velas',
            type: 'candlestick',
            data: dataCandle,
        }],
        chart: {
            height: 350,
            type: 'line',
        },
        tooltip: {
            shared: true,
            custom: [function({seriesIndex, dataPointIndex, w}) {
                return "SMA: " + w.globals.series[seriesIndex][dataPointIndex]
            }, function({ seriesIndex, dataPointIndex, w }) {
                var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
                var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
                var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                return (
                    '<div class="arrow_box">' +
                        "<span>" + "Apertura: " + o + "</span>" +
                        "<br>" +
                        "<span>" + "Máximo: " + h + "</span>" +
                        "<br>" +
                        "<span>" + "Minimo: " + l + "</span>" +
                        "<br>" +
                        "<span>" + "Cierre: " + c + "</span>" +
                    "</div>"
                )
            }]
        },
        toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
                customIcons: [],
            },
            export: {
                csv: {
                    filename: undefined,
                    columnDelimiter: ",",
                    headerCategory: "category",
                    headerValue: "value",
                },
                svg: {
                    filename: undefined,
                },
                png: {
                    filename: undefined,
                },
            },
            autoSelected: "zoom",
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#02c076",
                    downward: "#f84960",
                },
            },
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: ["#81ADC8"],
            width: 2,
            dashArray: 0,
        },
        xaxis: {
            type: 'datetime'
        }
    };


    chartCandle.updateSeries([{
        data: dataCandle
    }])

    xMin = data[0][0];
    xMax = data[data.length-1][0];

    var optionsChartBar = {
       series: [
           {
               name: "volume",
               data: dataVolume,
           },
       ],
       chart: {
           height: 160,
           type: "bar",
           brush: {
               enabled: false,
               target: "candles",
           },
           selection: {
               enabled: true,
               xaxis: {
                   min: new Date(xMin-1).getTime(),
                   max: new Date(xMax+1).getTime(),
               },
               fill: {
                   color: "#ccc",
                   opacity: 0.4,
               },
               stroke: {
                   color: "#0D47A1",
               },
           },
       },
       dataLabels: {
           enabled: false,
       },
       plotOptions: {
           bar: {
               columnWidth: "80%",
               colors: {
                   ranges: [{
                       from: 0,
                       to: 100000000000000,
                       color: "#E39C87",
                   }],
               },
           },
       },
       stroke: {
           width: 0,
       },
       xaxis: {
           type: "datetime",
           axisBorder: {
               offsetX: 13,
           },
       },
       yaxis: {
           labels: {
               show: false,
           },
       },
    };

    var chartBar = new ApexCharts(document.querySelector("#chart-bar"), optionsChartBar);
    chartBar.render();


}

const setMaxDatos = (max) => {

    // max puede ser: 1 dia; 5 dias; 30 dias; 60 dias; 90 dias; *365 dias;
    let data = [];
    let headers = ["Date","high","low","open","close","volume","open_2_sma"];
    data.push(headers);

    let inicio = dataValues.length-1;
    let finMes = inicio-max;

    if(max === 1){
        data.push(dataValues[inicio])
    }else {
        if(max === 0){
            finMes = 0;
        }
        for (; inicio > finMes; inicio--) {
            data.push(dataValues[inicio]);
        }
    }
console.log(data)
    return data;
}

const redondear = (valorRaw, indice) => {

    let valor;
    valorRaw = Math.floor(valorRaw * 100) / 100;
    valor = valorRaw.toFixed(indice);

    return valor;
}

const newEmpresa = () => {
$.get("http://127.0.0.1:5000/data/"+empresa, function () {
  getData();
});
}

const getData = async () => {
    await $.ajax({
        url: "http://127.0.0.1:5000/empresas/"+empresa,
        type: "GET",
        success: function(data){
            dataValues = data;
            let minData = setMaxDatos(30);
            setValoresInicio(dataValues);
            formatData(minData);
            renderChart(minData);
        },
        error: function(data){
            if(data.status === 500){
                newEmpresa();
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', function (){

    optionsCandle = {
        series: [],
        chart: {
            type: "candlestick",
            height: 350,
            id: "candles",
        },
        toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
                customIcons: [],
            },
            export: {
                csv: {
                    filename: undefined,
                    columnDelimiter: ",",
                    headerCategory: "category",
                    headerValue: "value",
                },
                svg: {
                    filename: undefined,
                },
                png: {
                    filename: undefined,
                },
            },
            autoSelected: "zoom",
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: "#02c076",
                    downward: "#f84960",
                },
            },
        },
        xaxis: {
            type: "datetime",
        },
        noData: {
            text: 'Cargando...'
        }
    };

    chartCandle = new ApexCharts(document.querySelector("#chart-candlestick"), optionsCandle);
    chartCandle.render();

    init();
});
