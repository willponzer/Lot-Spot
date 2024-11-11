// Function to fetch parking data based on user selections
async function fetchParkingData() {
    const userType = document.getElementById('userType').value;
    const parkingLot = document.getElementById('parkingLot').value;

    if (!userType || !parkingLot) {
        document.getElementById('availableSpots').textContent = "Please select options above";
        return;
    }

    try {
        document.getElementById('availableSpots').textContent = "Loading..."; // Show loading message
        const response = await fetch(`/api/parking-availability?userType=${userType}&parkingLot=${parkingLot}`);
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("Parking data:", data);
        displayParkingData(data);
    } catch (error) {
        console.error("Failed to fetch parking data:", error);
        document.getElementById('availableSpots').textContent = "Error loading data";
    }
}

// Function to display parking data
function displayParkingData(data) {
    document.getElementById('availableSpots').textContent = data.availableSpots;
}

// Set event listeners on dropdowns to fetch data on change
document.getElementById('userType').addEventListener('change', fetchParkingData);
document.getElementById('parkingLot').addEventListener('change', fetchParkingData);

// Auto-refresh data every 10 seconds
setInterval(fetchParkingData, 10000);
