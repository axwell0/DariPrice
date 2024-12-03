import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from pycaret.regression import *
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "https://dariprice.onrender.com"}})

final_model = load_model('final_model')
@app.route('/',methods=['GET'])
def hello():
    return '<h2>Hello World</h2>'


@app.route('/api/predict', methods=['POST'])
def predict_house_price():
    data = request.json
    print(f"Received search request: {data}")
    if (data['Type'] == 'House'):
        Type = 'villa'
    else:
        Type = 'appartement'

    response = {

                "id": 1,
                "n_bedrooms": data['n_bedrooms'],
                "n_bathrooms": data['n_bathrooms'],
                "area": data['area'],
                "city": data['city'],
                "state": data['state'],
                "Type": Type,
                "price": int(predict_model(final_model,data=pd.DataFrame(data,index=[0]))['prediction_label'])


    }
    print(response)
    return jsonify(response)
if __name__ == '__main__':
    app.run(debug=False)