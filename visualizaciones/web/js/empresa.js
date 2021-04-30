
let empresa;
let nombre;
let dateIndex;
let openIndex;
let closeIndex;
let highIndex;
let lowIndex;
let volumeIndex;
let cciIndex;

const init = function(e) {
    empresa = localStorage.getItem("ticker");
    nombre = localStorage.getItem("nombreEmpresa")
    document.getElementById("nombreEmpresa").innerHTML = nombre;
    getData();
}
const getData = async () => {
    await $.ajax({
        url: "http://127.0.0.1:5000/empresas/"+empresa,
        type: "GET",
        success: function(data){
            setValoresInicio(data);
            renderChart(data);
        },
        error: function(data){
            if(data.status === 500){
                newEmpresa();
            }
        }
    })
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
    let precioCambioRaw = redondear(parseFloat(data[data.length-1][openIndex]),4) - redondear(parseFloat(data[data.length-1][closeIndex]),4);
    let precioCambio = redondear(precioCambioRaw,4)


    console.log("precios del dia " + data[data.length-1][dateIndex]);
    document.getElementById("precioMaximo").innerHTML = precioMaximo;
    document.getElementById("precioMinimo").innerHTML = precioMinimo;
    document.getElementById("volumen").innerHTML = volumen;


    document.getElementById("precioCambio").innerHTML = precioCambio;

    (precioCambio > 0) ? document.getElementById("precioCambio").style.color = "green" : document.getElementById("precioCambio").style.color = "red";
}

const renderChart = (data) => {

    const dataLine = [];
    const dataCandle = [];
    const dataCci = [];
    let minData = [];

    let inicio = data.length-1;
    let finMes = data.length-30;

    for(let i=0; inicio > finMes; inicio--,i++){
        minData[i] = data[inicio];
    }

console.log(minData);

    minData.forEach((x) => {
        //
        const tempLine = {};
        tempLine.x = new Date(x[dateIndex]).getTime();
        tempLine.y = [x[closeIndex]];
        const tempCandle = {};
        tempCandle.x = new Date(x[dateIndex]).getTime();
        tempCandle.y = [x[openIndex], x[highIndex], x[lowIndex], x[closeIndex]];

        const tempCCI = {};
        tempCCI.x = new Date(x[dateIndex]).getTime();
        tempCCI.y = [x[cciIndex]];
        dataCci.push(tempCCI);

        dataLine.push(tempLine);
        dataCandle.push(tempCandle);
    });

    var options3 = {
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
                autoSelected: "pan",
                show: false,
            },
            zoom: {
                enabled: false,
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
    var chart = new ApexCharts(document.querySelector("#chart-candlestick"), options3);
    chart.render();
}

const redondear = (valorRaw, indice) => {
    let valor;
    valorRaw = Math.floor(valorRaw * 100) / 100;
    valor = valorRaw.toFixed(indice);
    return valor;
}

const newEmpresa = () => {
    $.get("http://127.0.0.1:5000/data/"+empresa, function (data) {
       getData();
    });
}

document.addEventListener('DOMContentLoaded', function (){
    init();
});
