import keras
import numpy as np
# import matplotlib.pyplot as plt
import pandas as pd 
from stockstats import StockDataFrame



class Model:
    # 1. Load model
    # 2. Method for prediction
    target = ['close']
    target = ['close']
    variables_importantes = ['open','high','low','volume']
    variables_extra_df = ['kdjk']



    def __init__(self, routeModel, routeData):
        self.model = keras.models.load_model(routeModel)
        self.data = pd.read_csv(routeData,index_col='Date', parse_dates=['Date'])

    def predict(self, days):
        self.model.predict()

    def dejar_columnas(self, data, columnas):
        return data[columnas]

    def convertir_np_a_dataframe(self, np_arr, variables):
        #sel_arr = np.delete(np_arr, np.s_[:np_arr.shape[1]-len(variables)],1)
        df = pd.DataFrame(np_arr, columns=variables)
        return df
    def generarPredicciones(self, data, num_predictores, num_predicciones, variables_importantes):

        #cargamos data y dejo las columnas que me interesan
        data = self.dejar_columnas(data, variables_importantes+self.variables_extra_df+self.target)
        # print(np.array(data).shape)
        #creo variables auxiliares
        x = data
        y = []

        #convierto a np array
        x = np.array(x)
        # dataNP = x.copy()

        #meto en y nones para poder pintarlo bien
        for _ in range(num_predicciones):
            # print("entrada",x)
            a_predecir = np.expand_dims(x[-num_predictores:,:], axis = 0) #preparo x para predecir
            np_predicho = self.model.predict(a_predecir) #predigo
            # print("predicho",np_predicho)
            
            y.append(np_predicho[:,:])
            dataF_predicho = self.convertir_np_a_dataframe(np_predicho, variables_importantes + self.target) #convertir a datafrme la prediccion
            dataF_X = self.convertir_np_a_dataframe(x, variables_importantes + self.variables_extra_df + self.target) #convertir x a dataframe
            dataF_X = self.dejar_columnas(dataF_X, variables_importantes + self.target)#elimino las columnas extras para concatenar
            dataF_X = pd.concat([dataF_X,dataF_predicho]) #concateno x con la prediccion
            #creacion de variables
            tempStock = StockDataFrame.retype(dataF_X)#convierto la concatenacion a un dataframe especial
            for var_df in self.variables_extra_df:#genero las variables nuevas con la x ya concatenada
                tempStock.get(var_df)
            tempStock = self.dejar_columnas(tempStock, variables_importantes + self.variables_extra_df + self.target)#dejo las columnas que me interesan
            tempStock[self.variables_extra_df] = (tempStock[self.variables_extra_df] - tempStock[self.variables_extra_df].mean(axis = 0)) / (tempStock[self.variables_extra_df].max(axis = 0) - tempStock[self.variables_extra_df].min(axis = 0))
            x = np.array(tempStock)
        return x[-num_predicciones:,:]


    def predecir(self, data, atras = 0, dias_para_predecir = 100, dias_a_predecir = 100):
        maximos = data.max(axis = 0)
        minimos = data.min(axis = 0)
        media = data.mean(axis = 0)
        data = (data - media) / (maximos -minimos)
        # print(data.shape[0]-atras)
        # print(data.iloc[:data.shape[0]-atras,])
        data1 = data.iloc[:data.shape[0]-atras,]
        y = self.generarPredicciones(data1, dias_para_predecir, dias_a_predecir, self.variables_importantes)
        #pinto
        a = y.copy()
        z = self.dejar_columnas(data, self.variables_importantes+self.variables_extra_df+self.target)
        real = np.array(z)
        v = np.copy(z)
        a = np.array(a).squeeze()
        # a = (a * (maximos - minimos)) + media
        a = np.concatenate((v[:,-1:],a[:,-1:]))
        # plt.plot(real[:,-1:], color = "green")
        # plt.plot(a, color = "red")

        return a

    def getPrediction(self, dias,data):
        return self.predecir(data, dias_a_predecir=dias)
