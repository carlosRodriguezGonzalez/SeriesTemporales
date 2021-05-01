
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

    let minData = setMaxDatos(30,data);

    minData.forEach((x) => {
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

    var chartCandle = new ApexCharts(document.querySelector("#chart-candlestick"), optionsCandle);
    chartCandle.render();

    xmin = minData[0][0];
    console.log(xmin)
    xmax = minData[minData.length-1][0];
    console.log(xmax)

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
                enabled: true,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xmin).getTime(),
                    max: new Date(xmax).getTime(),
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

const setMaxDatos = (max, data) => {

    // max puede ser: 1 dia; 5 dias; 30 dias; 60 dias; 90 dias; 365 dias;
    let minData = [];
    let inicio = data.length-1;
    let finMes = data.length-max;

    for(let i=0; inicio > finMes; inicio--,i++){
        minData[i] = data[inicio];
    }
    return minData;
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
