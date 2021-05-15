import pandas_datareader as pdr
import datetime
from stockstats import StockDataFrame


class scrapperDatasets:
    @classmethod
    def getData(cls, empresa):

        stocks = pdr.get_data_yahoo(empresa,
                                    start=datetime.datetime(2006, 10, 1),
                                    end=datetime.datetime.now())

        return stocks

    @classmethod
    def calculateStocksVariables(cls, data):
        stock = StockDataFrame.retype(data)

        stock.get('rsi_6') # Índice de fuerza relativa (Nos dice si debemos comprar o vender)
        stock.get('macd')  # Media Móvil de Convergencia/Divergencia
        stock.get('boll')  #  Bolingas
        stock.get('volume_delta')  #  Si la venta o la compra esta siendo mas agresiva
        stock.get('mdi')  #  Indicator mean deviation indicator
        stock.get('cr')  # Habla sobre el riesgo (Controlled risk)
        stock.get('open_2_d')  # open delta against next 2 day
        stock.get('open_-2_r') # open price change (in percent) between today and the day before yesterday
        stock.get('volume_-3,2,-1_max') #  Volumen maximo en los ultimos 3 dias
        stock.get('volume_-3~1_min')  #  Volumen minimo en los ultimos 3 dias
        stock.get('kdjk') #  Stochastic Oscillator Indicator. Muy util para corto
        stock.get('wr_10')  # overbought and oversold levels.
        stock.get('wr_6')  # overbought and oversold levels.
        stock.get('cci')  #  Indicador del precio sobre el valor medio
        stock.get('tr')  # Valor de retorno
        stock.get('dma')  #  Media movil por tendencia
        stock.get('pdi') # momentum indicator used by technical traders that shows the percentage change in a triple exponentially smoothed moving average
        stock.get('trix')
        stock.get('vr')  # volatility ratio
        stock.get('close_50_sma') # media movil


        return stock

    @classmethod
    def downloadStocks(cls, stocks, empresa):
        tmpStock = stocks[30:]
        tmpStock.to_csv(f'data/{empresa}.csv')
