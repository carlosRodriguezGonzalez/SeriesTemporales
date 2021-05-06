from flask import Flask, jsonify, Response
from flask_jsonpify import jsonpify
import os
import datetime
from scrapperDatasets import scrapperDatasets
from model import Model
import pandas as pd
import numpy as np
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

CORS(app)

sanModel = Model("./data/models/model.h5","./data/SAN.csv")

def cleanFileName(s):
    return s.split('.')[0]


@app.route('/')
def getMainData():
    datasets = os.listdir('data')

    result = list(map(cleanFileName, datasets))

    return jsonify(result)


@app.route('/data/<empresa>')
def getNewBusiness(empresa):
    stocks = scrapperDatasets.getData(empresa)
    calculatedStocks = scrapperDatasets.calculateStocksVariables(
        stocks)
    scrapperDatasets.downloadStocks(calculatedStocks, empresa)
    return 'a'


@app.route('/empresas/<empresa>')
def getDataFromEmpresa(empresa):
    fields = ['Date', "high", "low", "open", "close", "volume", "cci"]

    data = pd.read_csv(f'data/{empresa}.csv', usecols=fields)

    df_list = data.values.tolist()

    head = list(data.columns)

    currentTime = str(datetime.datetime.now().strftime("%Y-%m-%d"))
    currentDay = currentTime[8:10]
    print(currentDay)

    dfTime = df_list[len(df_list)-1][0]
    dfDay = dfTime[8:10]
    print(dfDay)

    # hay que sacar los findes de semana --> problema para los dias de fiesta en general es un problema lo de tenerlos actualizados
    # por ahora depende de que el cliente acceda a la empresa para que se actualicen
    if currentDay != dfDay:
        print(f'descargando nueva version de {empresa}')
        os.remove(f'data/{empresa}.csv')
        getNewBusiness(empresa)
        return


    df_list.insert(0, head)

    return jsonify(df_list)


@app.route('/empresas/<empresa>/CSV')
def getDataFromEmpresaCSV(empresa):
    fields = ['Date', "high", "low", "open", "close", "volume"]

    data = pd.read_csv(f'data/{empresa}.csv', usecols=fields)

    return Response(
        data.to_csv(),
        mimetype="text/csv",
        headers={"Content-disposition":
                 "attachment; filename=data.csv"})

@app.route('/pruebi')
def makePrediction():
    
    return np.array_str(sanModel.getPrediction(100))

