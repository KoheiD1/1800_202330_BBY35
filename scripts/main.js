// Create the Leaflet map
var map = L.map('map').setView([49.249999, -123.0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Reference Firestore collection
const parkingLotsRef = db.collection('parkingLots');

// Fetch parking lot data from Firestore


// Fetch parking lot data from Firestore
parkingLotsRef.get()
  .then((snapshot) => {
    var surroundingParkingLots = [];

    snapshot.forEach((doc) => {
      var data = doc.data();
      var ID = doc.id;
      var parkingLotInfo = {
        parkID:ID,
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

      var popupParkInfo = `<b>${parkingLotInfo.name}</b><br>Status: ${parkingLotInfo.status}<br>Price: ${parkingLotInfo.price}`;

      // Attach a click event handler to show the popup on marker click
      marker.on('click', function () {
        var parkingLotID = parkingLotInfo.parkID;
        localStorage.setItem('parkingLotID', parkingLotID);//set local storage
        marker.bindPopup(popupParkInfo).openPopup();
        popupWindow.style.display = "none";
      });

      marker.addTo(map); // Add marker to the map
    });

  })
  .catch((error) => {
    console.error('Error fetching parking lot data:', error);
  });


// Get the elements by their ID
var popupLink = document.getElementById("popup-link");
var userReport = document.getElementById("user-Report");
var closeButton = document.getElementById("close-button");

// Show the pop-up window when the link is clicked
popupLink.addEventListener("click", function (event) {
    event.preventDefault();
    userReport.style.display = "block";
});

// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function () {
  userReport.style.display = "none";
});

