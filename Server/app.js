const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { spawn } = require('child_process'); // Import the child_process module


// Middleware to parse JSON data
app.use(express.json());

// Use static html file
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'lotspot.html'))
});


// Variable to store latest parking data
let parkingData = { availableSpots: 0 };

// Route to receive data from AI processing
app.post('/api/update-parking', (req, res) => {
    // Update the parkingData with the received data
    parkingData = req.body;
    res.status(200).json({ message: 'Data updated successfully' });
});

// Route for front end to retrieve parking data
app.get('/api/parking-availability', (req, res) => {
    const parkingLot = req.query.parkingLot;

    if (parkingLot === 'Fontaine') {
        // Spawn the Python script as a child process
        const pythonProcess = spawn('python3', ['roboflowDemo/detection.py']);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        res.json(parkingData);
    } else {
        res.json({
            message: "This specific parking lot is not set up with LotSpot technology yet, working on implementation in the near future!"
        });
    }
});

// Start the server
app.listen(PORT, () => {
});
