let empresa;
let nombre;

let dateIndex;
let openIndex;
let closeIndex;
let highIndex;
let lowIndex;
let volumeIndex;
let smaIndex;
let dmaIndex;
let rsiIndex;
let kdjkIndex;
let cciIndex;
let trIndex;
let pdiIndex;
let volumeDeltaIndex;
let trixIndex;
let wrIndex;

let dataValues;
const dataLine = [];
const dataCandle = [];
const dataVolume = [];
const dataSMA = [];
const dataDMA = [];
const dataRSI = [];
const dataKDJK = [];
const dataCCI = [];
const dataTR = [];
const dataPDI = [];
const dataVolumeDelta = [];
const dataTrix = [];
const dataWR = [];

var chartCandle;
var chartLine;
var optionsCandle;
var smaChart;
var optionsSma;
var dmaChart;
var optionsDMA;
var kdjkBar;
var optionsKdjk;
var volumeDeltaBar;
var optionsVolumeDelta;
var rsiBar;
var optionsRSI;
var cciBar;
var optionsCci;
var trBar;
var optionsTr;
var trixBar;
var optionsTrix;
var wrBar;
var optionsWr;
var pdiChart;
var optionsPdi;


const init = async function() {
    empresa = localStorage.getItem("ticker");
    nombre = localStorage.getItem("nombreEmpresa")
    document.getElementById("nombreEmpresa").innerHTML = nombre;

    if(nombre != "Banco Santander, S.A. (SAN)") {
        document.getElementById("btn_san").hidden = true;
    }


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
        updateChart(minData);
    });
    btn_5d.addEventListener('click', function (){
        let minData = setMaxDatos(5);
        formatData(minData);
        updateChart(minData);

    });
    btn_14d.addEventListener('click', function (){
        let minData = setMaxDatos(14);
        formatData(minData);
        updateChart(minData);
    });
    btn_30d.addEventListener('click', function (){
        let minData = setMaxDatos(30);
        formatData(minData);
        updateChart(minData);
    });
    btn_60d.addEventListener('click', function (){
        let minData = setMaxDatos(60);
        formatData(minData);
        updateChart(minData);
    });
    btn_90d.addEventListener('click', function (){
        let minData = setMaxDatos(90);
        formatData(minData);
        updateChart(minData);
    });
    btn_1a.addEventListener('click', function (){
        let minData = setMaxDatos(365);
        formatData(minData);
        renderLine(dataLine);
    });
    btn_5a.addEventListener('click', function (){
        let minData = setMaxDatos(1826);
        formatData(minData);
        renderLine(dataLine);
    });
    btn_max.addEventListener('click', function (){
        let minData = setMaxDatos(0);
        formatData(minData);
        renderLine(dataLine);
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
    smaIndex = headers.findIndex((x) => x === "close_50_sma");
    dmaIndex = headers.findIndex((x) => x === "dma");
    rsiIndex = headers.findIndex((x) => x === "rsi_6");
    kdjkIndex = headers.findIndex((x) => x === "kdjk");
    cciIndex = headers.findIndex((x) => x === "cci");
    trIndex = headers.findIndex((x) => x === "tr");
    pdiIndex = headers.findIndex((x) => x === "pdi");
    volumeDeltaIndex = headers.findIndex((x) => x === "volume_delta");
    trixIndex = headers.findIndex((x) => x === "trix");
    wrIndex = headers.findIndex((x) => x === "wr_6");

    let precioMaximo = redondear(parseFloat(data[data.length-1][highIndex]),3);
    let precioMinimo = redondear(parseFloat(data[data.length-1][lowIndex]),3);
    let volumen = redondear(parseFloat(data[data.length-1][volumeIndex]),3);
    let precioCambioRaw = redondear(parseFloat(data[data.length-1][closeIndex]),5) - redondear(parseFloat(data[data.length-1][openIndex]),5);
    let precioCambio = redondear(precioCambioRaw,4);
    let precioCompra = redondear(parseFloat(data[data.length-1][closeIndex]),3);


    console.log("precios del dia " + data[data.length-1][dateIndex]);
    document.getElementById("precioMaximo").innerHTML = precioMaximo;
    document.getElementById("precioMinimo").innerHTML = precioMinimo;
    document.getElementById("volumen").innerHTML = volumen;
    document.getElementById("precioCambio").innerHTML = precioCambio;
    document.getElementById("FormRow-BUY-price1").value = parseFloat(precioCompra)*10;

    (precioCambio > 0) ? document.getElementById("precioCambio").style.color = "green" : document.getElementById("precioCambio").style.color = "red";

}

const formatData = (data) =>{

    dataVolume.length = 0;
    dataCandle.length = 0;
    dataLine.length = 0;
    dataSMA.length = 0;
    dataDMA.length = 0;
    dataRSI.length = 0;
    dataKDJK.length = 0;
    dataCCI.length = 0;
    dataTR.length = 0;
    dataPDI.length = 0;
    dataVolumeDelta.length = 0;
    dataTrix.length = 0;
    dataWR.length = 0;

    data.forEach((x,index) => {
        if (index === 0) return;
        //
        const tempLine = {};
        tempLine.x = new Date(x[dateIndex]).getTime();
        tempLine.y = [redondear(x[closeIndex],4)];

        const tempCandle = {};
        tempCandle.x = new Date(x[dateIndex]).getTime();
        tempCandle.y = [+redondear(x[openIndex],4), +redondear(x[highIndex],4), +redondear(x[lowIndex],4), +redondear(x[closeIndex],4)];

        const tempVolume = {};
        tempVolume.x = new Date(x[dateIndex]).getTime();
        tempVolume.y = [redondear(x[volumeIndex],3)];

        const tempSMA = {};
        tempSMA.x = new Date(x[dateIndex]).getTime();
        tempSMA.y = +redondear(x[smaIndex],3);

        const tempDMA = {};
        tempDMA.x = new Date(x[dateIndex]).getTime();
        tempDMA.y = +redondear(x[dmaIndex],3);

        const tempRSI = {};
        tempRSI.x = new Date(x[dateIndex]).getTime();
        tempRSI.y = +redondear(x[rsiIndex],3);

        const tempKDJK = {};
        tempKDJK.x = new Date(x[dateIndex]).getTime();
        tempKDJK.y = +redondear(x[kdjkIndex],3);

        const tempCCI = {};
        tempCCI.x = new Date(x[dateIndex]).getTime();
        tempCCI.y = +redondear(x[cciIndex],3);

        const tempTR = {};
        tempTR.x = new Date(x[dateIndex]).getTime();
        tempTR.y = +redondear(x[trIndex],3);

        const tempPDI = {};
        tempPDI.x = new Date(x[dateIndex]).getTime();
        tempPDI.y = +redondear(x[pdiIndex],3);

        const tempVolumeDelta = {};
        tempVolumeDelta.x = new Date(x[dateIndex]).getTime();
        tempVolumeDelta.y = +redondear(x[volumeDeltaIndex],3);

        const tempTrix = {};
        tempTrix.x = new Date(x[dateIndex]).getTime();
        tempTrix.y = +redondear(x[trixIndex],3);

        const tempWR = {};
        tempWR.x = new Date(x[dateIndex]).getTime();
        tempWR.y = +redondear(x[wrIndex],3);


        dataLine.push(tempLine);
        dataCandle.push(tempCandle);
        dataVolume.push(tempVolume);
        dataSMA.push(tempSMA);
        dataDMA.push(tempDMA);
        dataRSI.push(tempRSI);
        dataKDJK.push(tempKDJK);
        dataCCI.push(tempCCI);
        dataTR.push(tempTR);
        dataPDI.push(tempPDI);
        dataVolumeDelta.push(tempVolumeDelta);
        dataTrix.push(tempTrix);
        dataWR.push(tempWR);
    });
}

const formatPrediction = (data) => {
    document.getElementById("chart-bar").hidden = true;
    const line = [];
    let sum = 1;
    let slicedData = data.slice(dataValues.length-1,data.length-1);

    let lastDay = new Date(dataValues[dataValues.length-1][dateIndex]);

    slicedData.forEach((x,index) => {

        let tempLine = {};

        if(index === 0){
            tempLine.x = lastDay.getTime();
            tempLine.y = redondear(dataValues[dataValues.length-1][closeIndex],3);
        }else{
            tempLine.x = addDays(lastDay,sum).getTime();
            sum = sum + 1;
            let temp = redondear(x[0],3);
            tempLine.y =  parseFloat(temp) + 1.0;
        }

        line.push(tempLine);
    });

    console.log(line);
    return line
}

const renderLine = (data) => {

    let chartOld = document.getElementById("chart-candlestick");
    let chartNew = document.getElementById("chart-line");
    chartOld.hidden = true;
    chartNew.hidden = false;
    document.getElementById("chart-bar").hidden = false;



    var optionsLine = {
        series: [
            {
                data: data,
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

    chartLine = new ApexCharts(document.querySelector("#chart-line"), optionsLine);
    chartLine.render();
}

const updateChart = (data) => {

    let chartOld = document.getElementById("chart-line");
    let chartNew = document.getElementById("chart-candlestick");
    chartOld.hidden = true;
    chartNew.hidden = false;
    document.getElementById("chart-bar").hidden = false;

    chartCandle.updateSeries([{
        data: dataCandle
    }]);
    smaChart.updateSeries([{
        data: dataSMA
    }]);
    dmaChart.updateSeries([{
        data: dataDMA
    }]);
    kdjkBar.updateSeries([{
        data: dataKDJK
    }]);
    volumeDeltaBar.updateSeries([{
        data: dataVolumeDelta
    }]);
    rsiBar.updateSeries([{
        data: dataRSI
    }]);
    cciBar.updateSeries([{
        data: dataCCI
    }]);
    trBar.updateSeries([{
        data: dataTR
    }]);
    trixBar.updateSeries([{
        data: dataTrix
    }]);
    wrBar.updateSeries([{
        data: dataWR
    }]);


    let xMin;
    let xMax;
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

const renderIndicators = (data) => {

    let xMin;
    let xMax;
    xMin = data[0][0];
    xMax = data[data.length-1][0];

    optionsSma = {
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
    smaChart = new ApexCharts(document.querySelector("#chart-sma"), optionsSma);
    smaChart.render();

    optionsDMA = {
        series: [{
            name: 'DMA',
            type: 'line',
            data: dataDMA,
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
                return "DMA: " + w.globals.series[seriesIndex][dataPointIndex]
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
    dmaChart = new ApexCharts(document.querySelector("#chart-dma"), optionsDMA);
    dmaChart.render();

    optionsVolumeDelta = {
        series: [
            {
                name: "volume Delta",
                data: dataVolumeDelta,
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
                columnWidth: '80%',
                colors: {
                    ranges: [{
                        from: -1000000000000000,
                        to: 0,
                        color: '#E50000'
                    }, {
                        from: 1,
                        to: 1000000000000000,
                        color: '#007300'
                    }],

                },
            }
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
    volumeDeltaBar = new ApexCharts(document.querySelector("#chart-volume-delta"), optionsVolumeDelta);
    volumeDeltaBar.render();

    optionsPdi = {
        series: [
            {
                name: "valores",
                data: data,
            },
            {
                name: "pdi",
                data: dataPDI,
            }
        ],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            }
        },
        xaxis: {
        },
        stroke: {
            width: [5,5,4],
            curve: 'straight'
        },
    };
    pdiChart = new ApexCharts(document.querySelector("#chart-pdi"), optionsPdi);
    pdiChart.render();

    // lineas en bar

    optionsKdjk = {
        series: [{
            name: 'kdjk',
            data: dataKDJK
        }],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xMin-1).getTime(),
                    max: new Date(xMax+1).getTime(),
                }
            },
        },
        colors: ['#5A875A'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    kdjkBar = new ApexCharts(document.querySelector("#chart-kdjk"), optionsKdjk);
    kdjkBar.render();

    optionsRSI = {
        series: [
            {
                name: "RSI",
                data: dataRSI,
            },
        ],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                    xaxis: {
                        min: new Date(xMin-1).getTime(),
                        max: new Date(xMax+1).getTime(),
                    }
                },
        },
        colors: ['#EA8705'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    rsiBar = new ApexCharts(document.querySelector("#chart-rsi"), optionsRSI);
    rsiBar.render();

    optionsCci = {
        series: [
            {
                name: "CCI",
                data: dataCCI,
            },
        ],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xMin-1).getTime(),
                    max: new Date(xMax+1).getTime(),
                }
            },
        },
        colors: ['#E05C7B'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    cciBar = new ApexCharts(document.querySelector("#chart-cci"), optionsCci);
    cciBar.render();

    optionsTr = {
        series: [
            {
                name: "TR",
                data: dataTR,
            },
        ],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xMin-1).getTime(),
                    max: new Date(xMax+1).getTime(),
                }
            },
        },
        colors: ['#20768E'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    trBar = new ApexCharts(document.querySelector("#chart-tr"), optionsTr);
    trBar.render();

    optionsTrix = {
        series: [
            {
                name: "TRIX",
                data: dataTrix,
            },
        ],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xMin-1).getTime(),
                    max: new Date(xMax+1).getTime(),
                }
            },
        },
        colors: ['#B1CEEE'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    trixBar = new ApexCharts(document.querySelector("#chart-trix"), optionsTrix);
    trixBar.render();

    optionsWr = {
        series: [
            {
                name: "WR",
                data: dataWR,
            },
        ],
        chart: {
            height: 130,
            type: "area",
            brush: {
                enabled: false,
                target: "candles",
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date(xMin-1).getTime(),
                    max: new Date(xMax+1).getTime(),
                }
            },
        },
        colors: ['#56D0A9'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.61,
            }
        },
        dataLabels: {
            enabled: false,
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
    wrBar = new ApexCharts(document.querySelector("#chart-wr"), optionsWr);
    wrBar.render();

}

const setMaxDatos = (max) => {

    // max puede ser: 1 dia; 5 dias; 30 dias; 60 dias; 90 dias; 365 dias; 1826; 0(historico completo)
    let data = [];
    let headers = ["Date","high","low","open","close","volume","close_50_sma","dma","rsi_6","kdjk","cci","tr","pdi","volume_delta","trix","wr_6"];
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
            renderIndicators(minData);
            updateChart(minData);
        },
        error: function(data){
            if(data.status === 500){
                newEmpresa();
            }
        }
    })
}

const prediction = () => {
    let dias = document.getElementById("diasPredecir").value;
    $.get("http://127.0.0.1:5000/pruebi/"+dias, function (data){
        console.log(data);
        let predictionData = formatPrediction(data);
        renderLine(predictionData);
    });
}

const showIndicator = (e) => {
    let indicator = e.id.split("_");
    let chart = document.getElementById("chart-"+indicator[0]);

    if(e.checked === true){

        if(indicator[0] === "sma"){
            document.getElementById("chart-candlestick").style.display = "none";
            document.getElementById("chart-dma").style.display = "none";
        }else if(indicator[0] === "dma"){
            document.getElementById("chart-candlestick").style.display = "none";
            document.getElementById("chart-sma").style.display = "none";
        }
        chart.style.display = "flex";
    }else {
        if(indicator[0] === "sma" || indicator[0] === "dma"){
            document.getElementById("chart-candlestick").style.display = "flex";
        }
        chart.style.display = "none";
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const redondear = (valorRaw, indice) => {

    let valor;
    valorRaw = Math.floor(valorRaw * 100) / 100;
    valor = valorRaw.toFixed(indice);

    return valor;
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

    document.getElementById("chart-sma").style.display = "none";
    document.getElementById("chart-dma").style.display = "none";
    document.getElementById("chart-pdi").style.display = "none";
    document.getElementById("chart-volume-delta").style.display = "none";
    document.getElementById("chart-kdjk").style.display = "none";
    document.getElementById("chart-rsi").style.display = "none";
    document.getElementById("chart-cci").style.display = "none";
    document.getElementById("chart-tr").style.display = "none";
    document.getElementById("chart-trix").style.display = "none";
    document.getElementById("chart-wr").style.display = "none";

    init();
});
