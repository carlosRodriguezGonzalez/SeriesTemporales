from flask import Flask, jsonify
from flask_jsonpify import jsonpify
import os
from scrapperDatasets import scrapperDatasets
import pandas as pd

app = Flask(__name__)


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
    fields = ['Date', "high", "low", "open", "close", "volume"]

    data = pd.read_csv(f'data/{empresa}.csv', usecols=fields)

    df_list = data.values.tolist()

    head = list(data.columns)
    df_list.insert(0, head)

    return jsonify(df_list)