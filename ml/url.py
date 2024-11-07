import sys
import json
import matplotlib.pyplot as plt

def url_function1(predicted_value_for_url , static_value_for_url):
    try:
        # Plot the predicted unit
        #print("python code started execution")
        predicted_unit_1 = predicted_value_for_url  # First predicted value (kWh)
        predicted_unit_2 = static_value_for_url  # Second predicted value (kWh)

        # Create the bar plot for the two predicted values
        plt.figure(figsize=(6, 6))
        plt.bar([0, 1], [predicted_unit_1, predicted_unit_2], color='skyblue', width=0.4)

        # Adding labels and title
        plt.xlabel('Prediction')
        plt.ylabel('Predicted Unit (kWh)')
        plt.title('Comparision')

        # Add values on top of the bars
        plt.text(0, predicted_unit_1 + 2, str(predicted_unit_1), ha='center')
        plt.text(1, predicted_unit_2 + 2, str(predicted_unit_2), ha='center')

        # Plot the line connecting the points
        plt.plot([0, 1], [predicted_unit_1, predicted_unit_2], color='red', marker='o', linestyle='-', linewidth=2)

        # Specify the folder path where you want to save the plot
        file_path = '../js/predicted_energy_consumption.png'

        # Save the plot
        plt.savefig(file_path)

        # Clear the plot to avoid memory issues in long-running processes
        plt.clf()

        #print(file_path)
        print(f"File Path: {file_path}", file=sys.stderr)

        return file_path

    except Exception as e:
        print(f"Error in url_function: {e}", file=sys.stderr)

if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        
        input_data = json.load(sys.stdin)

        # Extract the values from the input JSON
        predicted_value_for_url = input_data['predicted_value_for_url']
        static_value_for_url = input_data['static_value_for_url']

        # Print the captured inputs for debugging
        #print(f"predicted_value_for_url={predicted_value_for_url}", file=sys.stderr)
        # Make prediction

        # Return the result as JSON
        file_path1 = url_function1(predicted_value_for_url , static_value_for_url)
        result = {"url_link1": file_path1}
        #print("URL.PY LA OIRUNTHU PRINT PANI PAAKREN : " , output_url)
        print(json.dumps(result))


    except Exception as e:
        # Handle any errors and send them back to Node.js
        error_message = {"error": str(e)}
        print(json.dumps(error_message), file=sys.stderr)