import numpy as np
import pandas as pd
import joblib
import sys
import json
import matplotlib.pyplot as plt

# Load the trained model and scaler
model = joblib.load('../ml/lightgbm_unit_prediction_model.pkl')
scaler = joblib.load('../ml/lightgbm_scaler.pkl')

# Load the original dataset to determine the feature names used during training
original_data = pd.read_excel('../ml/DataSet.xlsx')

# Get the original feature names used for training
original_feature_names = [col for col in original_data.columns if col != 'unit']

# Function to predict unit based on user input
def predict_unit(num_rooms, num_people, is_ac, is_tv, is_flat, ave_monthly_income, num_children):
    # Create a DataFrame from the input
    input_data = pd.DataFrame({
        'num_rooms': [num_rooms],
        'num_people': [num_people],
        'is_ac': [is_ac],
        'is_tv': [is_tv],
        'is_flat': [is_flat],
        'ave_monthly_income': [ave_monthly_income],
        'num_children': [num_children]
    })

    # One-hot encode categorical variables (if necessary)
    input_data = pd.get_dummies(input_data, drop_first=True)

    # Add missing columns with 0s based on original feature names
    for col in original_feature_names:
        if col not in input_data.columns:
            input_data[col] = 0  # Fill missing columns with 0

    # Reorder the columns to match the training feature order
    input_data = input_data[original_feature_names]

    # Scale the features
    input_data_scaled = scaler.transform(input_data)

    # Make a prediction
    predicted_unit = model.predict(input_data_scaled)

    # Print the predicted unit for debugging
    print(f"Predicted unit: {predicted_unit[0]}", file=sys.stderr)
    
    return predicted_unit[0]


# Main function to handle inputs from Node.js
if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        
        input_data = json.load(sys.stdin)

        # Extract the values from the input JSON
        num_rooms = input_data['num_rooms']
        num_people = input_data['num_people']
        is_ac = input_data['is_ac']
        is_tv = input_data['is_tv']
        is_flat = input_data['is_flat']
        ave_monthly_income = input_data['ave_monthly_income']
        num_children = input_data['num_children']

        # Print the captured inputs for debugging
        print(f"Inputs received: num_rooms={num_rooms}, num_people={num_people}, is_ac={is_ac}, "
              f"is_tv={is_tv}, is_flat={is_flat}, ave_monthly_income={ave_monthly_income}, "
              f"num_children={num_children}", file=sys.stderr)

        # Make prediction
        predicted_unit = predict_unit(num_rooms, num_people, is_ac, is_tv, is_flat, ave_monthly_income, num_children)
        # Return the result as JSON
        result = {"predicted_unit": predicted_unit}
        print(json.dumps(result))

    except Exception as e:
        # Handle any errors and send them back to Node.js
        error_message = {"error": str(e)}
        print(json.dumps(error_message), file=sys.stderr)
