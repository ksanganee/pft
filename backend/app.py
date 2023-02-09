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


amounts = pd.DataFrame([0, 185.4, 0, 83, 0, 0, 458.69, 1459.26, 30, 9, 28, 21, 10, 79.94, 0, 246, 25.06, 7, 137.45, 92, 27, 51.89, 3.11, 27, 20, 0, 7, 0.45, 4.53, 39.02, 5.8, 0.2, 0, 15.99, 0.01, 0, 96, 4, 4.05, 14, 17, 12.1, 30, 0, 9, 0, 26, 24.29, 42, 11, 2.5, 2, 37, 10, 7, 0, 4, 5, 24, 36, 134.67, 16.29, 57, 51.3, 54.29, 35, 9.88, 153, 10, 20, 1433, 12, 7, 27, 102, 30, 24, 18, 3.5, 29.29, 0, 0, 4, 6, 1980, 0, 2, 0, 44, 0, 0, 0, 0, 651, 104.26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 529.81, 42, 21, 2960.26, 43, 0, 25, 33, 5, 30, 0, 105, 0, 117, 0, 45, 10, 55.13, 70, 40, 75, 24, 18.2, 128, 23, 70, 25, 141.75, 33, 44, 22, 0, 15, 47, 42, 39, 0, 4, 0, 25, 24, 0, 15, 8, 35.0, 34, 0, 0, 17, 4, 0, 41, 92.7, 7, 0, 0, 5, 30.27, 11, 6, 17.1, 1053.52, 1, 945.83, 104, 0, 33, 0, 569, 1642.59, 592, 252.15, 0, 0, 54.95,
                       100.16, 35, 4, 19, 19, 7, 715.19, 18, 29, 0, 1439, 16, 5910.92, 31.78, 43, 106.17, 23.05, 8, 23.5, 0, 38, 41, 826.82, 1.55, 6, 15.5, 2149.86, 46, 0, 24, 19.5, 25, 29, 9, 2, 16, 249, 0, 514, 0, 294.25, 15, 130.25, 181.7, 3.5, 6.5, 0, 52.65, 20, 10.18, 487.99, 25, 0, 0, 805.82, 110, 42, 4, 46, 42.05, 0, 16, 19, 2523.41, 26, 0, 11, 16, 66, 8, 52.62, 34, 34, 212, 1359, 72, 0, 138.25, 165.55, 9, 0, 0, 0, 80, 471.3, 92.67, 74, 7, 12, 122, 2090.25, 39, 14, 10, 34, 14, 16, 23, 112.9, 0, 1288, 0, 29, 19, 11, 33, 46, 27, 30, 4, 11, 17, 0, 11, 4, 43, 530.24, 4, 62, 1, 3, 4, 35, 0, 101, 26, 76.5, 0, 23, 0, 4, 3, 16, 503.8, 17, 47, 40, 4, 3, 38, 0, 38, 124.71, 56, 4, 162, 75, 34, 0, 5, 7, 4, 23, 6, 4, 49, 24, 30, 17, 36, 19, 62, 88, 0, 1207, 0, 0, 0, 0, 14, 613.46, 0, 0, 0, 0, 0, 0, 1656.2, 73, 7, 366.38, 155.58, 122.5])

scaler = StandardScaler()
scaled_amounts = amounts.values  # ?
scaled_amounts = scaler.fit_transform(amounts.values)

window_size = 30

train_x, train_y = create_rnn_dataset(scaled_amounts, window_size)

price_model = Sequential()
price_model.add(SimpleRNN(32, input_shape=(1, window_size)))
price_model.add(Dense(1))
price_model.compile(loss="mean_squared_error",
                    optimizer="adam", metrics=["mse"])
price_model.summary()

train_x = np.reshape(train_x, (train_x.shape[0], 1, train_x.shape[1]))
price_model.fit(train_x, train_y, epochs=100, batch_size=1, verbose=1)

app = Flask(__name__)


@app.route("/api/predict", methods=["POST"])
def predict():
    predictions = []
    previous_thirty_days = np.array(json.loads(
        json.loads(request.data)["previous_thirty_days"]))
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
