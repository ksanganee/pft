from flask import Flask, request, json, jsonify

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import SimpleRNN, Dense
import tensorflow as tf

def create_rnn_dataset(data, window_size=1):
    data_x, data_y = [], []
    for i in range(len(data) - window_size - 1):
        a = data[i:(i + window_size), 0]
        data_x.append(a)
        data_y.append(data[i + window_size, 0])
    return np.array(data_x), np.array(data_y)

amounts = pd.read_csv("data/mine.csv", header=None).T
# amounts = pd.read_csv("data/plaid.csv", header=None).T

scaler = StandardScaler()
scaled_amounts = scaler.fit_transform(amounts.values)

window_size = 30

train_x, train_y = create_rnn_dataset(scaled_amounts, window_size)

price_model = Sequential()
price_model.add(SimpleRNN(64, input_shape=(1, window_size)))
price_model.add(Dense(1))
price_model.compile(loss="mean_squared_error",
                    optimizer="adam", metrics=["mse"])
price_model.summary()

train_x = np.reshape(train_x, (train_x.shape[0], 1, train_x.    shape[1]))
price_model.fit(train_x, train_y, epochs=250, batch_size=1, verbose=1)

app = Flask(__name__)


@app.route("/api/predict", methods=["POST"])
def predict():
    predictions = []
    previous_thirty_days = np.array(
        json.loads(request.data)["previous_thirty_days"])
    print(previous_thirty_days)
    forecast_amount = json.loads(request.data)["forecast_amount"]
    for _ in range(forecast_amount):
        scaled_previous_thirty_days = scaler.transform(
            previous_thirty_days.reshape(-1, 1))
        model_input = np.reshape(scaled_previous_thirty_days, (
            scaled_previous_thirty_days.shape[1], 1, scaled_previous_thirty_days.shape[0]))
        pred = scaler.inverse_transform(price_model.predict(model_input))
        predictions.append(f"{pred[0][0]}")
        previous_thirty_days = np.append(previous_thirty_days, pred)
        previous_thirty_days = previous_thirty_days[1:]
    print(predictions)
    return jsonify(predictions)
