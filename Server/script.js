const parkingLotsByUserType = {
    resident: [
        "McCann/Sheahan",
        "Fontaine",
        "Hoop",
        "St. Ann's/North End",
        "Beck East",
        "Beck West",
        "Riverview",
        "Lower West Cedar",
        "Fulton/Tennis Court",
        "Upper West Cedar"
    ],
    fs: [
        "McCann/Sheahan",
        "Foy",
        "Dyson",
        "Donnelly",
        "Fontaine",
        "Beck East",
        "Beck West",
        "Midrise",
        "Steel Plant",
        "Riverview",
        "Allied Health & Science",
        "69 West Cedar",
        "51/57 Fulton"
    ],
    commuter: [
        "McCann/Sheahan",
        "Fontaine",
        "Beck East",
        "Beck West",
        "Riverview",
        "Lower West Cedar",
        "69 West Cedar",
        "Fulton/Tennis Court",
        "Upper West Cedar"
    ],
    visitor: ["Midrise", "Donnelly"]
};

// Function to update parking lot dropdown based on user type
document.getElementById("userType").addEventListener("change", () => {
    const userType = document.getElementById("userType").value;
    const parkingLotSelect = document.getElementById("parkingLot");

    parkingLotSelect.innerHTML = '<option value="">Choose a lot</option>'; // Reset options

    if (userType && parkingLotsByUserType[userType]) {
        parkingLotsByUserType[userType].forEach((lot) => {
            const option = document.createElement("option");
            option.value = lot; // Keep the value as the formatted name
            option.textContent = lot; // Display the nicely formatted name
            parkingLotSelect.appendChild(option);
        });
    }
});

// Function to fetch parking data
async function fetchParkingData() {
    const userType = document.getElementById("userType").value;
    const parkingLot = document.getElementById("parkingLot").value;

    if (!userType || !parkingLot) {
        document.getElementById("availableSpots").textContent = "Please select a Parking Lot!";
        return;
    }

    try {
        document.getElementById("availableSpots").textContent = "Loading...";
        const response = await fetch(`/api/parking-availability?userType=${userType}&parkingLot=${encodeURIComponent(parkingLot)}`);

        // Handle specific case for unavailable parking lot
        if (response.status === 404) {
            document.getElementById("availableSpots").textContent =
                "This specific parking lot is not set up with LotSpot technology yet, working on implementation in the near future!";
            return;
        }

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        // Check if data is empty or unavailable
        if (!data || typeof data.availableSpots !== "number") {
            document.getElementById("availableSpots").textContent =
                "This specific parking lot is not set up with LotSpot technology yet, working on implementation in the near future!";
            return;
        }

        const spots = data.availableSpots;
        document.getElementById("availableSpots").textContent = `Available spots: ${spots}`;
    } catch (error) {
        console.error("Failed to fetch parking data:", error);
        document.getElementById("availableSpots").textContent = "Error loading data";
    }
}

// Set event listeners on dropdowns to fetch data on change
document.getElementById("userType").addEventListener("change", fetchParkingData);
document.getElementById("parkingLot").addEventListener("change", fetchParkingData);
