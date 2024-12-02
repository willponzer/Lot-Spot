const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

// Use static html file
app.use(express.static(path.join(__dirname)));

// Function to get the most recent video file
function getMostRecentVideo() {
    const videoDir = path.join(__dirname, 'video_recordings');
    try {
        const files = fs.readdirSync(videoDir)
            .filter(file => file.endsWith('.mp4'))
            .map(file => ({
                name: file,
                path: path.join(videoDir, file),
                mtime: fs.statSync(path.join(videoDir, file)).mtime
            }))
            .sort((a, b) => b.mtime - a.mtime); // Sort by modification time, newest first

        return files.length > 0 ? files[0].path : null;
    } catch (error) {
        console.error('Error reading video directory:', error);
        return null;
    }
}

// Function to run the detection script
function runDetection() {
    const videoPath = getMostRecentVideo();
    if (!videoPath) {
        console.error('No videos found in directory');
        return;
    }

    console.log(`Processing video: ${videoPath}`);
    const pythonScript = path.join(__dirname, 'detection.py');
    
    exec(`python "${pythonScript}" "${videoPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running detection script: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Detection script stderr: ${stderr}`);
        }
        console.log(`Detection completed: ${stdout}`);
    });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'lotspot.html'));
});

// Variable to store latest parking data
let parkingData = { availableSpots: 0 };

// Route to receive data from AI processing
app.post('/api/update-parking', (req, res) => {
    parkingData = req.body;
    console.log('Parking data updated:', parkingData);
    res.status(200).json({ message: 'Data updated successfully' });
});

// Route for front end to retrieve parking data
app.get('/api/parking-availability', (req, res) => {
    res.json(parkingData);
});

// Ensure video_recordings directory exists
const videoDir = path.join(__dirname, 'video_recordings');
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}

// Start processing loop
setInterval(runDetection, 5000); // Run every 5 seconds

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // Run initial detection
    runDetection();
});