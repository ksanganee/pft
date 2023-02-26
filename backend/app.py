from flask import Flask, request, json, jsonify

import pickle
import numpy as np
import tensorflow as tf

# constants
dataset = "plaid"
epochs = 250

price_model, scaler = pickle.load(open(f"models/{dataset}_{epochs}.pkl", "rb"))

app = Flask(__name__)

@app.route("/api/predict", methods=["POST"])
def predict():
    predictions = []
    previous_thirty_days = np.array(
        json.loads(request.data)["previous_thirty_days"])
    print("previous_thirty_days:", previous_thirty_days)
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
    print("predictions:", predictions)
    return jsonify(predictions)
