const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const xlsx = require('xlsx'); // Added to handle Excel file reading
const { spawn } = require('child_process'); // Import spawn from child_process
const path = require('path');
const { error } = require('console');
const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve static files from the js directory
app.use('../js', express.static(path.join(__dirname, '../js')));

let p_sum;
let total_sum;
let sly;
// Load the dataset from the Excel file
const workbook = xlsx.readFile('../node/Modified_DATASET_with_all_appliances.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Helper function to get the "Max Average Power Per Hour (Watts)" for an appliance
function getPowerPerHour(applianceName) {
    const appliance = data.find(item => item.Appliance.trim().toLowerCase() === applianceName.trim().toLowerCase());
    return appliance ? parseFloat(appliance["Max Average Power Per Hour (Watts)"]) : 0;
}

// Helper function to calculate the total number of days between two dates
function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference > 0 ? daysDifference : 0;
}

app.post('/material', (req, res) => {
    console.log('Request body kula vanten:', req.body);

    const applianceData = req.body.applianceData;
    const currentDate = req.body.currentDate;
    const endDate = req.body.endDate;
    const consumedUnit = req.body.consumedUnit;
    const usageSlabs = req.body.usageSlabs;

    // Check for missing or invalid parameters
    if (!Array.isArray(applianceData) || !currentDate || !endDate || isNaN(consumedUnit) || !Array.isArray(usageSlabs)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Prepare the input for the Python script
    const inputJson = JSON.stringify({
        applianceData,
        currentDate,
        endDate,
        consumedUnit,
        usageSlabs
    });

    // Spawn a child process to run the Python script
    const process = spawn('python', ['../node/optimize_usage.py']);

    // Send input JSON to the Python script
    process.stdin.write(inputJson);
    process.stdin.end();

    let pythonOutput = '';

    // Capture data from the Python script
    process.stdout.on('data', (data) => {
        pythonOutput += data.toString(); // Append data from the Python script
    });

    // Capture error from the Python script
    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: data.toString() });
    });

    // Handle process exit and send the response back to the client
    process.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        if (code !== 0) {
            return res.status(500).json({ error: 'Python script execution failed' });
        }

        // Try to parse the Python script output and send it back as a JSON response
        try {
            const parsedData = JSON.parse(pythonOutput);
            console.log("Optimized usage from Python:", parsedData);
            res.json({ optimalUsage: parsedData.optimalUsage });
        } catch (error) {
            console.error('Failed to parse Python script output:', error);
            res.status(500).json({ error: 'Failed to parse Python script output' });
        }
    });
});


app.post('/optimize', (req, res) => {
    console.log('Request body:', req.body);

    const applianceData = req.body.applianceData;
    const currentDate = req.body.currentDate;
    const endDate = req.body.endDate;
    const totalDays = calculateDaysBetween(currentDate, endDate);
    
    if (totalDays === 0) {
        return res.status(400).json({ error: 'Invalid date range' });
    }

    let totalConsumption = 0;

    // Calculate the total consumption for each appliance
    applianceData.forEach(appliance => {
        const powerPerHour = getPowerPerHour(appliance.name);
        const quantity = parseInt(appliance.quantity, 10) || 1;
        
        if (powerPerHour > 0) {
            const applianceConsumption = powerPerHour * quantity * 24 * totalDays; // 24 hours per day
            totalConsumption += applianceConsumption;
        }
    });

    totalConsumption = totalConsumption / 1000; // Convert to kWh
    let currentConsumedUnits = parseFloat(req.body.param2);
    // Add current consumed units to totalConsumption
    totalConsumption += currentConsumedUnits;

    console.log('Total Consumption:', totalConsumption);
    total_sum = totalConsumption;
    res.json({ totalConsumption });
});

app.post('/predict-unit', (req, res) => {
    console.log('Predict Unit request received');
    // Extract the data sent by the frontend
    const { num_rooms, num_people, is_ac, is_tv, is_flat, ave_monthly_income, num_children } = req.body;
    sly = req.body.ave_monthly_income;

    const inputData = { num_rooms, num_people, is_ac, is_tv, is_flat, ave_monthly_income, num_children };

    // Spawn a Python process to execute the model.py script
    const pythonProcess = spawn('python', ['../ml/model.py']);

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    let resultData = '';

    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            res.status(500).json({ error: 'Python script execution failed' });
        } else {
            try {
                // Parse the result data from Python (prediction value)
                const prediction = JSON.parse(resultData);
                p_sum = prediction.predicted_unit;
                console.log("redict panathu : " , prediction.predicted_unit);
                console.log("app lairunthu pakren :" , prediction);
                // Call the next route (/url-function) to generate the image
                const imageUrl1 = '../js/predicted_energy_consumption.png';
                const imageUrl2 = '../js/static_energy_consumption.png';
                fetch("http://localhost:3000/url-function" , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        salary : sly,
                        predicted_value_for_url : p_sum,
                        static_value_for_url : total_sum
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Atha thaandi vanthuten");
                })
                .catch(error => {
                    console.error("Ivan tha error : " ,error);
                })
                res.json({ prediction: prediction.predicted_unit, imageUrl1: imageUrl1 });

            } catch (err) {
                res.status(500).json({ error: 'Failed to parse Python script output', details: err.message });
            }
        }
    });
});

app.post('/url-function', (req, res) => {
    //console.log('Full Request Body:', req.body);
    // Extract the data sent by the frontend (or wherever the request is coming from)
    const {
        salary : sly,
        predicted_value_for_url : p_sum,
        static_value_for_url : total_sum// Rename to match expected key
    } = req.body;

    // Prepare the input data to be sent to the Python script
    const inputData = {
        salary : sly,
        predicted_value_for_url : p_sum,
        static_value_for_url : total_sum
    };

    // Spawn a Python process to execute the url.py script
    const pythonProcess = spawn('python', ['../ml/url.py']);

    // Send the input data as a JSON string to the Python script's stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    let resultData = '';
    let errorData = '';

    // Capture the output data (prediction result) from Python
    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    // Capture any error messages from Python
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // When the Python process finishes
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            // If the Python process returns an error code, send the error to the client
            console.log("Vera route number 1 : ",  errorData);
            res.status(500).json({ error: 'Python script execution failed', details: errorData });
        } else {
            try {
                // Parse the result data from Python and send it back to the client
                const final_url = JSON.parse(resultData);
                console.log("Final url da athuku keela : " , final_url);
            } catch (err) {
                res.status(500).json({ error: 'Failed to parse Python script output', details: err.message });
            }
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
