from flask import Flask, jsonify, Response
from flask_jsonpify import jsonpify
import os
import datetime
from scrapperDatasets import scrapperDatasets
from flask_cors import CORS
import pandas as pd


app = Flask(__name__)
CORS(app)
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

    if head[0] != datetime.datetime.now():
        getNewBusiness(empresa)

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
