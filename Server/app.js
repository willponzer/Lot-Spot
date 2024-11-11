const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());

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
    res.json(parkingData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
