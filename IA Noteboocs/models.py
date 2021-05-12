import numpy as np
from numpy import newaxis
import pandas as pd
from keras.layers.core import Dense, Activation, Dropout
from keras.layers.recurrent import LSTM, GRU, SimpleRNN
from keras.models import Sequential
from keras import optimizers
from keras.utils import normalize
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import matplotlib.dates
import tensorflow as tf
import tensorflow_addons as tfa
import keras
from keras import backend as K
from stockstats import StockDataFrame
from keras import regularizers
from keras import callbacks
import itertools
import os
ruta = './FullData.csv'
def dejarPredictores(data, predictores, valor): #metodo para dejar los predictores y el valor a predecir solamente
  return data[predictores + [valor]] 
def dibujarGraficaTemporal(data , valor): #metodo para plotear
  data[valor].plot() 
def dividirTestTrain(data, porcentaje = 0.9): #metodo para splitear entre test y train
    row = round(porcentaje * data.shape[0])
    train = data[:row]
    test = data[row:]
    return train,test
def dejar_columnas(data, columnas):
      return data[columnas]
#para que este metodo las ultimas columnas que prediga la red neuronal tienen que ser las que no se pueden calcular
#y en el oren dado

def convertir_np_a_dataframe(np_arr, variables):
  #sel_arr = np.delete(np_arr, np.s_[:np_arr.shape[1]-len(variables)],1)
  df = pd.DataFrame(np_arr, columns=variables)
  return df
def cargarDatos(ruta, valor, fecha, len_x, len_y, variablesAPredecir, predictores, division = 0.9): #metodo para cargar los datos
  #carga de datos
  data = pd.read_csv(ruta,index_col=fecha, parse_dates=[fecha]) #leemos los datos con la fecha
  dibujarGraficaTemporal(data,valor) #dibujamos la grafica
  #preparacion y division de datos
  data2 = dejarPredictores(data, predictores, valor) #dejamos los predictores
  #separamos entre x e y 
  y = dejarPredictores(data, variablesAPredecir, valor)
  x = dejarPredictores(data, predictores, valor)
  #preparamos la separacion de los datos 100 -> 1
  data3x = []
  data3y = []
  maximosX = x.max(axis = 0)
  minimosX = x.min(axis = 0)
  maximosY = y.max(axis = 0)
  minimosY = y.min(axis = 0)
  mediaX = x.mean(axis = 0)
  mediaY = y.mean(axis = 0)
  x = (x - mediaX)/(maximosX - minimosX)
  y = (y - mediaY)/(maximosY - minimosY)
  for i in range(data2.shape[0] - (len_x + len_y)): #hacemos la normalizacion por slot y añadimos los slots a sus respectivas listas
    data3x.append(x[i : i + len_x])
    data3y.append(y[i :  i + len_x + len_y])
    data3y[i] = data3y[i][len_x : len_x + len_y]
  #convierto a np array
  data3x = np.array(data3x)
  data3y = np.array(data3y)
  #separo entre test y train
  row = round(division * data3x.shape[0])
  x_train = data3x[:row,] 
  y_train = data3y[:row,]
  y_train = y_train.squeeze()
  x_test = data3x[row:,]
  y_test = data3y[row:,]
  y_test = y_test.squeeze() #quito ceros de shape np array
  return data, x_train , y_train , x_test, y_test
def generarPredicciones(data,model, num_predictores, num_predicciones, variables_importantes, variables_extra_df, target = []):
  #cargamos data y dejo las columnas que me interesan
  data = dejar_columnas(data, variables_importantes+variables_extra_df+target)
  #creo variables auxiliares
  x = data
  y = []
  #convierto a np array
  x = np.array(x)
  dataNP = x.copy()
  #meto en y nones para poder pintarlo bien
  for i in range(num_predicciones):
    a_predecir = np.expand_dims(x[-num_predictores:,:], axis = 0) #preparo x para predecir
    np_predicho = model.predict(a_predecir) #predigo
    y.append(np_predicho[:,:])
    dataF_predicho = convertir_np_a_dataframe(np_predicho, variables_importantes + target) #convertir a datafrme la prediccion
    dataF_X = convertir_np_a_dataframe(x, variables_importantes + variables_extra_df + target) #convertir x a dataframe
    dataF_X = dejar_columnas(dataF_X, variables_importantes + target)#elimino las columnas extras para concatenar
    dataF_X = pd.concat([dataF_X,dataF_predicho]) #concateno x con la prediccion
    #creacion de variables
    tempStock = StockDataFrame.retype(dataF_X)#convierto la concatenacion a un dataframe especial
    for var_df in variables_extra_df:#genero las variables nuevas con la x ya concatenada
      tempStock.get(var_df)
    tempStock = dejar_columnas(tempStock, variables_importantes + variables_extra_df + target)#dejo las columnas que me interesan
    tempStock[variables_extra_df] = (tempStock[variables_extra_df] - tempStock[variables_extra_df].mean(axis = 0)) / (tempStock[variables_extra_df].max(axis = 0) - tempStock[variables_extra_df].min(axis = 0))
    x = np.array(tempStock)
  return x[-num_predicciones:,:]
def predecir(data,model, atras = 0, dias_para_predecir = 100, dias_a_predecir = 100, variables_importantes = [], variables_extra_df = [],target = [],name = ""):
    maximos = data.max(axis = 0)
    minimos = data.min(axis = 0)
    media = data.mean(axis = 0)
    data = (data - media) / (maximos -minimos)
    data1 = data.iloc[:data.shape[0]-atras,]
    y = generarPredicciones(data1, model,dias_para_predecir, dias_a_predecir, variables_importantes, variables_extra_df,target = target)
    #pinto
    a = y.copy()
    z = dejar_columnas(data, variables_importantes+variables_extra_df+target)
    real = np.array(z)
    v = np.copy(z)
    a = np.array(a).squeeze()
    a = np.concatenate((v[:-atras,-1:],a[:,-1:]))
    plt.close()

    plt.plot(real[:,-1:], color = "green")
    plt.plot(a, color = "red")
    plt.savefig(name + 'normal.png')

    plt.close()

    plt.axis([len(real[:,-1:]) - atras -20, len(real[:,-1:]) - atras + 100, -1, 1])
    plt.margins(x=0, y=-0.25)
    plt.plot(real[:,-1:], color = "green")
    plt.plot(a, color = "red")
    plt.savefig(name + 'zoom.png')

    return y
def crearPrediccionnes(ruta):
  principal_target = ['close']
  fecha = 'Date'
  lenx = [100]
  if not os.path.exists('modelos'):
        os.makedirs('modelos')
  for i in lenx:
    variables_a_predecir = ['open','high','low','volume']
    variables_importantes = variables_a_predecir
    variables_extra_df = ['kdjk', 'rsi_6', 'boll', 'cci', 'dma','tr', 'pdi', 'volume_delta', 'trix', 'open_-2_r', 'wr_6']
    target = ['close']
    atras = [ 1, 100, 150]
    neuronas = [100]
    capas = [3]
    y = [ 30]
    predictores = variables_a_predecir + variables_extra_df
    #varsE =[0,3,5,7,6,9,10]
    varsE =[10]
    for numVars in varsE:
      varsExtra = itertools.combinations(variables_extra_df, numVars + 1)
      print(varsExtra)
      for vars in varsExtra:
        print("ENTRENANDO " + str(i) + " --> 1" )
        print("CON LAS VARIABLES GENERADAS: ")
        print(list(vars))
        predictores = variables_a_predecir + list(vars)
        s = "./modelos/" + str(predictores)
        if not os.path.exists(s):
              os.makedirs(s)
        principal_target = 'close'
        fecha = 'Date'
        len_x = i
        len_y = 1
        data, x_train , y_train , x_test, y_test = cargarDatos(ruta, principal_target, fecha, len_x, len_y, variables_a_predecir,predictores)
        for capa in capas:
          for neurona in neuronas:
            print("CON EL NUMERO DE CAPAS CAPAS: ")
            print(capa + 2)
            print("CON EL NUMERO DE NEURONAS POR CAPAS: ")
            print(neurona)
            r = s + "/x" + str(i) + "neuronas"+str(neurona)+"-capa"+str(capa +2)
            if not os.path.exists(r):
              os.makedirs(r)
            filepath=r + "/" + "neuronas"+str(neurona)+"-capa"+str(capa + 2)+"-weights-improvement-{epoch:02d}-{val_loss:.5f}.hdf5"
            early_stopping_monitor = callbacks.EarlyStopping(
                monitor='val_loss',
                min_delta=0,
                patience=0,
                verbose=0,
                mode='min',
                baseline=None,
                restore_best_weights=True
            )
            checkpoint = callbacks.ModelCheckpoint(filepath, monitor='val_loss', verbose=1, save_best_only=True, mode='min')
            callbacks_list = [checkpoint,early_stopping_monitor]
            keras.backend.clear_session()
            model = Sequential()
            model.add(LSTM(neurona, input_shape=(None,x_train.shape[2]), dropout=0.2, recurrent_dropout=0.2, return_sequences=True))
            for c in range(capa):
              model.add(LSTM(neurona, dropout=0.2, recurrent_dropout=0.2, return_sequences=True))
            model.add(LSTM(neurona, dropout=0.2, recurrent_dropout=0.2))
            model.add(Dense(len(variables_a_predecir) + 1 , activation = "linear"))
            model.compile(loss='mse', optimizer='adam',metrics=[tf.keras.metrics.MeanSquaredError()])
            print(model.summary())
            model.fit(x_train, y_train, batch_size=64, epochs=10, validation_data = (x_test, y_test), callbacks=callbacks_list, verbose=1)
            dummy = model.predict(x_test)
            plt.close() 
            plt.plot(dummy[:,-1:],color = "blue")
            plt.plot(y_test[:,-1:],color = "red")
            plt.savefig(filepath + 'test.png')
            plt.close() 
            for a in atras:
              print("ATRAS: "+ str(a))
              for pred in y:
                for x in lenx:
                  name = "ent"+str(i) +"-vars" + str(predictores) + "-capas" + str(capa+2) + "-neuronas" + str(neurona) + "-atras" + str(a) + "-x" + str(x) + "-y" + str(pred)
                  if not os.path.exists(r +"/" + name):
                    os.makedirs(r +"/" + name) 
                  predecir(data = data, model = model, atras = a, dias_para_predecir = x, dias_a_predecir = pred,variables_importantes =variables_importantes , variables_extra_df = list(vars), target = target,
                   name = r +"/" + name + "/")

crearPrediccionnes(ruta = ruta)