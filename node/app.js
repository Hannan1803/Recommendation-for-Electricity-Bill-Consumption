const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/optimize', (req, res) => {
    console.log('Request body:', req.body);

    const applianceData = req.body.applianceData;
    const param1 = req.body.param1;
    const param2 = req.body.param2;

    if (!param1 || isNaN(param1) || !param2 || isNaN(param2)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const inputJson = JSON.stringify({
        applianceData,
        param1,
        param2
    });

    const process = spawn('python', ['optimize_usage.py']);

    process.stdin.write(inputJson);
    process.stdin.end();

    process.stdout.on('data', (data) => {
        console.log('Python script output:', data.toString());

        try {
            const parsedData = JSON.parse(data.toString());
            console.log(`Redirecting to: /html/result.html?data=${encodedData}`);
            
            const encodedData = encodeURIComponent(JSON.stringify(parsedData));
            res.redirect(`/html/result.html?data=${encodedData}`);
            window.location.href = '../html/result.html';

        } catch (error) {
            res.status(500).json({ error: 'Failed to parse Python script output' });
        }
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: data.toString() });
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
