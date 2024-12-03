import json

import numpy as np
import pandas as pd
from flask import render_template, Flask, request
from pycaret.regression import load_model,predict_model
app = Flask(__name__)

final_model = load_model('final_model')


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get form data
        area = float(request.form['area'])
        n_bedrooms = int(request.form['n_bedrooms'])
        n_bathrooms = int(request.form['n_bathrooms'])
        property_type = request.form['property_type']
        state = request.form['state']
        city = request.form['city']

        input_data = pd.DataFrame({
            'area': area,
            'n_bedrooms': n_bedrooms,
            'n_bathrooms': n_bathrooms,
            'Type': property_type,
            'state': state,
            'city': city
        },index=[0])
        estimated_price = int(predict_model(final_model,data=input_data)['prediction_label'])

        # Render result template
        return render_template('result.html', estimated_price=estimated_price)
    else:
        with open('state_cities.json','r') as f:
            state_cities = json.load(f)
        return render_template('index.html',states_cities=state_cities)

if __name__ == '__main__':
    app.run(debug=True)