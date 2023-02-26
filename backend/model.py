import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM

# constants
dataset = "plaid"
epochs = 250


def create_rnn_dataset(data, window_size=1):
    data_x, data_y = [], []
    for i in range(len(data) - window_size - 1):
        a = data[i:(i + window_size), 0]
        data_x.append(a)
        data_y.append(data[i + window_size, 0])
    return np.array(data_x), np.array(data_y)


amounts = pd.read_csv(f"data/{dataset}.csv", header=None).T

scaler = StandardScaler()
scaled_amounts = scaler.fit_transform(amounts.values)

window_size = 30

train_x, train_y = create_rnn_dataset(scaled_amounts, window_size)

price_model = Sequential()
price_model.add(LSTM(64, input_shape=(1, window_size)))
# price_model.add(SimpleRNN(64, input_shape=(1, window_size)))
price_model.add(Dense(1))
price_model.compile(loss="mean_squared_error", optimizer="adam", metrics=["mse"])
price_model.summary()

train_x = np.reshape(train_x, (train_x.shape[0], 1, train_x.shape[1]))
price_model.fit(train_x, train_y, epochs=epochs, batch_size=1, verbose=1)

pickle.dump((price_model, scaler), open(f"models/{dataset}_{epochs}.pkl", "wb"))
