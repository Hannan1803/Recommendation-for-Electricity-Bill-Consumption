import sys
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
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

# Initialize and train the Random Forest Regressor model
model = RandomForestRegressor(n_estimators=100, random_state=0)
model.fit(X_train, y_train)

# Function to calculate optimized usage of appliances and convert to hours and minutes
def optimized_usage_for_slabs(selected_appliances, consumed_unit, usage_slabs):
    slab_results = {}

    for slab in usage_slabs:
        optimized_hours = {}

        for appliance in selected_appliances:
            appliance_name = appliance['name']
            quantity = int(appliance['quantity'])
            appliance_data = df[df['Appliance'] == appliance_name]
            
            if appliance_data.empty:
                print(f"Warning: No data found for appliance '{appliance_name}'. Skipping...", file=sys.stderr)
                continue

            appliance_features = appliance_data[['Power (Watts)', 'Max Average Hours/Day', 'Max Average Power Per Hour (Watts)', 'Efficiency Loss Due to Age (%)', 'Appliance Category']]
            appliance_features_scaled = scaler.transform(appliance_features)
            
            try:
                predicted_consumption_per_unit = model.predict(appliance_features_scaled)[0]
            except Exception as e:
                print(f"Error predicting consumption for appliance '{appliance_name}': {str(e)}", file=sys.stderr)
                continue

            # Multiply by quantity to account for multiple units of the same appliance
            total_predicted_consumption = predicted_consumption_per_unit * quantity

            # Calculate the max hours the appliance can be used per day to stay within the slab limit
            if total_predicted_consumption > 0:
                max_hours = max(0, (slab - consumed_unit) / total_predicted_consumption)
            else:
                max_hours = 0

            hours, minutes = convert_to_hours_minutes(max_hours)
            optimized_hours[appliance_name] = f"{hours} hours and {minutes} minutes for {quantity} units\n"

        slab_results[f"Slab {slab} units"] = optimized_hours

    return slab_results

# Function to convert decimal hours to hours and minutes
def convert_to_hours_minutes(decimal_hours):
    hours = int(decimal_hours)
    minutes = int((decimal_hours - hours) * 60)
    return hours, minutes

# Example usage with command-line arguments
if __name__ == '__main__':  
    try:
        # Read input from stdin (for use with a web service)
        input_data = json.load(sys.stdin)

        # Extract values from the incoming request
        selected_appliances = input_data['applianceData']
        cdate = input_data['currentDate']
        edate = input_data['endDate']
        consumed_unit = float(input_data['consumedUnit'])
        usage_slabs = input_data['usageSlabs']

        if not isinstance(selected_appliances, list):
            raise ValueError("JSON data should be a list of dictionaries with appliance details")

        # Calculate the optimized hours for each slab
        slab_results = optimized_usage_for_slabs(selected_appliances, consumed_unit, usage_slabs)

        # Include slab results in the output
        result = {
            'optimalUsage': slab_results
        }

        # Convert result to JSON and print (response to the request)
        print(json.dumps(result, indent=2))

    except ValueError as ve:
        print(f"Error: {str(ve)}", file=sys.stderr)
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON", file=sys.stderr)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
