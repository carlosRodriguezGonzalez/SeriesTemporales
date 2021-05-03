let empresa;
let nombre;
let dateIndex;
let openIndex;
let closeIndex;
let highIndex;
let lowIndex;
let volumeIndex;
let cciIndex;
let dataValues;
const dataLine = [];
const dataCandle = [];
const dataCci = [];

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

        btn_1d.addEventListener('click', function (){
            let minData = setMaxDatos(2);
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
cciIndex = headers.findIndex((x) => x === "cci");

let precioMaximo = redondear(parseFloat(data[data.length-1][highIndex]),3);
let precioMinimo = redondear(parseFloat(data[data.length-1][lowIndex]),3);
let volumen = redondear(parseFloat(data[data.length-1][volumeIndex]),3);
let precioCambioRaw = redondear(parseFloat(data[data.length-1][openIndex]),5) - redondear(parseFloat(data[data.length-1][closeIndex]),5);
let precioCambio = redondear(precioCambioRaw,4)


console.log("precios del dia " + data[data.length-1][dateIndex]);
document.getElementById("precioMaximo").innerHTML = precioMaximo;
document.getElementById("precioMinimo").innerHTML = precioMinimo;
document.getElementById("volumen").innerHTML = volumen;


document.getElementById("precioCambio").innerHTML = precioCambio;

(precioCambio > 0) ? document.getElementById("precioCambio").style.color = "green" : document.getElementById("precioCambio").style.color = "red";
}

const formatData = (data) =>{

    dataCci.length = 0;
    dataCandle.length = 0;

    data.forEach((x) => {
        //
        const tempLine = {};
        tempLine.x = new Date(x[dateIndex]).getTime();
        tempLine.y = [redondear(x[closeIndex],3)];
        const tempCandle = {};
        tempCandle.x = new Date(x[dateIndex]).getTime();
        tempCandle.y = [redondear(x[openIndex],3), redondear(x[highIndex],3), redondear(x[lowIndex],3), redondear(x[closeIndex],3)];

        const tempCCI = {};
        tempCCI.x = new Date(x[dateIndex]).getTime();
        tempCCI.y = [redondear(x[cciIndex],3)];
        dataCci.push(tempCCI);

        dataLine.push(tempLine);
        dataCandle.push(tempCandle);
    });
}

const renderChart = (data) => {

    let xMin;
    let xMax;

    var optionsCandle = {
       series: [
       {
           data: dataCandle,
       },
    ],
       chart: {
       type: "candlestick",
           height: 290,
           id: "candles",
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
                   customIcons: []
               },
               export: {
                   csv: {
                       filename: undefined,
                       columnDelimiter: ',',
                       headerCategory: 'category',
                       headerValue: 'value',
                       dateFormatter(timestamp) {
                           return new Date(timestamp).toDateString()
                       }
                   },
                   svg: {
                       filename: undefined,
                   },
                   png: {
                       filename: undefined,
                   }
               },
               autoSelected: 'zoom'
           },
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
    };

    var chartCandle = new ApexCharts(document.querySelector("#chart-candlestick"), optionsCandle);
    chartCandle.render();

    xMin = data[0][0];
    xMax = data[data.length-1][0];

    var optionsChartBar = {
       series: [
           {
               name: "volume",
               data: dataCci,
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
                   ranges: [
                       {
                           from: -1000,
                           to: 0,
                           color: "#f84960",
                       },
                       {
                           from: 1,
                           to: 10000,
                           color: "#02c076",
                       },
                   ],
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

// max puede ser: 1 dia; 5 dias; 30 dias; 60 dias; 90 dias; 365 dias;
let data = [];
let headers = ["Date","high","low","open","close","volume","cci"];
data.push(headers);

let inicio = dataValues.length-1;
let finMes = dataValues.length-max;

for(; inicio > finMes; inicio--){
   data.push(dataValues[inicio]);
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
            setValoresInicio(minData);
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
    init();
});
