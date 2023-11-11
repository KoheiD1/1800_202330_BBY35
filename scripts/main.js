// Create the Leaflet map
var map = L.map('map').setView([49.249999, -123.0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Reference Firestore collection
const parkingLotsRef = db.collection('parkingLots');

// Fetch parking lot data from Firestore
// ... (previous code)

// Fetch parking lot data from Firestore
parkingLotsRef.get()
  .then((snapshot) => {
    var surroundingParkingLots = [];

    snapshot.forEach((doc) => {
      var data = doc.data();
      var parkingLotInfo = {
        lat: data.lat,
        lng: data.lng,
        name: data.name,
        status: data.status,
        status_update: data.last_update,
        price: data.price
      };

      surroundingParkingLots.push(parkingLotInfo);
      console.log('Loaded parking lot:', parkingLotInfo);
    });

    // Create markers and add them to the map after data is fetched
    surroundingParkingLots.forEach((parkingLotInfo) => {
      var marker = L.marker([parkingLotInfo.lat, parkingLotInfo.lng], {
        icon: L.icon({
          iconUrl: '/images/parking-location.png',
        })
      });

      var popupContent = parkingLotInfo.status;

      // Attach a click event handler to show the popup on marker click
      marker.on('click', function () {
        marker.bindPopup(popupContent).openPopup();
      });

      marker.addTo(map); // Add marker to the map
    });

  })
  .catch((error) => {
    console.error('Error fetching parking lot data:', error);
  });

// ... (remaining code)


// Get the elements by their ID
var popupLink = document.getElementById("popup-link");
var popupWindow = document.getElementById("popup-window");
var closeButton = document.getElementById("close-button");

// Show the pop-up window when the link is clicked
popupLink.addEventListener("click", function (event) {
  event.preventDefault();
  popupWindow.style.display = "block";
});

// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function () {
  popupWindow.style.display = "none";
});
