import sys
import json
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.io as pio

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

# Install Kaleido (uncomment this line if you haven't installed it yet)
# !pip install -U kaleido

#import plotly.graph_objects as go

def generate_bar_chart(salary, electricity_bill):
    # Calculate the percentage of income spent on electricity
    percentage = (electricity_bill / salary) * 100
    remaining_percentage = 100 - percentage

    # Define the labels and values for the bar chart
    labels = ['Electricity Bill', 'Remaining Income']
    values = [percentage, remaining_percentage]

    # Create the bar chart
    plt.bar(labels, values, color=['blue', 'green'])

    # Add title and labels
    plt.title("Electricity Bill as % of Income")
    plt.ylabel("Percentage")

    # Save the chart as a PNG file
    file_path = 'electricity_cost_bar_chart.png'  # specify your desired directory
    plt.savefig(file_path)

    # Close the plot to release resources
    plt.close()

    print(f"Figure saved as PNG file at {file_path}")


    #print(f"Figure saved as PNG file at {file_path}")

# Example usage

#After running this, open the HTML file in a browser and use a tool like Snipping Tool (Windows) or built-in screenshot tools (Mac, Linux) to capture the chart.


if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        
        input_data = json.load(sys.stdin)

        # Extract the values from the input JSON
        salary = input_data['salary']
        print("Itha da python la vaaguna salary : " , salary)
        predicted_value_for_url = input_data['predicted_value_for_url']
        static_value_for_url = input_data['static_value_for_url']

        electricity_bill = 0
        temp_static = static_value_for_url - 100  # Initializing temp_static

        if temp_static < 500:
            electricity_bill += temp_static * 4.7
        elif 500 <= temp_static < 1000:
            electricity_bill += 500 * 4.7
            temp_static -= 500
            electricity_bill += temp_static * 9.7
        else: 
            electricity_bill += 500 * 4.7
            temp_static -= 500
            electricity_bill += 500 * 9.7
            temp_static -= 500
            electricity_bill += temp_static * 11

        print("Itha da electricity bill cost : " , electricity_bill)

        # Print the captured inputs for debugging
        #print(f"predicted_value_for_url={predicted_value_for_url}", file=sys.stderr)
        # Make prediction

        # Return the result as JSON
        #generate_bar_chart(salary, electricity_bill)
        file_path1 = url_function1(predicted_value_for_url , static_value_for_url)
        result = {"url_link1": file_path1}
        #print("URL.PY LA OIRUNTHU PRINT PANI PAAKREN : " , output_url)
        print(json.dumps(result))


    except Exception as e:
        # Handle any errors and send them back to Node.js
        error_message = {"error": str(e)}
        print(json.dumps(error_message), file=sys.stderr)