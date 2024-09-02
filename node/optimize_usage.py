import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

# Load dataset from Excel file
df = pd.read_excel('Modified_DATASET_with_all_appliances.xlsx')

# Convert categorical variables to numerical
df['Appliance Category'] = df['Appliance Category'].astype('category').cat.codes

# Features and target variable
X = df[['Power (Watts)', 'Max Average Hours/Day', 'Max Average Power Per Hour (Watts)', 'Efficiency Loss Due to Age (%)', 'Appliance Category']]
y = df['Max Average Power Per Day (Watts-hours)']

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=0)

# Initialize and train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Function to calculate optimized usage of appliances and convert to hours and minutes
def optimized_usage(selected_appliances, total_energy, current_energy):
    optimized_hours = {}

    for appliance in selected_appliances:
        appliance_name = appliance['name']
        quantity = int(appliance['quantity'])
        appliance_data = df[df['Appliance'] == appliance_name]
        if appliance_data.empty:
            print(f"Warning: No data found for appliance '{appliance_name}'. Skipping...")
            continue

        appliance_features = appliance_data[['Power (Watts)', 'Max Average Hours/Day', 'Max Average Power Per Hour (Watts)', 'Efficiency Loss Due to Age (%)', 'Appliance Category']]
        appliance_features_scaled = scaler.transform(appliance_features)
        predicted_consumption_per_unit = model.predict(appliance_features_scaled)[0]

        # Multiply by quantity to account for multiple units of the same appliance
        total_predicted_consumption = predicted_consumption_per_unit * quantity

        max_hours = max(0, (total_energy - current_energy) / total_predicted_consumption)

        hours, minutes = convert_to_hours_minutes(max_hours)
        optimized_hours[appliance_name] = f"{hours} hours and {minutes} minutes for {quantity} units"

    return optimized_hours

# Function to convert decimal hours to hours and minutes
def convert_to_hours_minutes(decimal_hours):
    hours = int(decimal_hours)
    minutes = int((decimal_hours - hours) * 60)
    return hours, minutes

# Example usage with command-line arguments
if __name__ == '__main__':
    try:
        input_data = json.load(sys.stdin)
        total_energy = float(input_data['param1'])
        current_energy = float(input_data['param2'])
        selected_appliances = input_data['applianceData']

        if not isinstance(selected_appliances, list):
            raise ValueError("JSON data should be a list of dictionaries with appliance details")

        optimized_hours = optimized_usage(selected_appliances, total_energy, current_energy)
        print(json.dumps(optimized_hours, indent=2))  # Convert to JSON and print with formatting
    except ValueError as ve:
        print(f"Error: {str(ve)}", file=sys.stderr)
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON", file=sys.stderr)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
