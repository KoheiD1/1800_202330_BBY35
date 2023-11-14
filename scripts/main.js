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
      var markerColor;
    
      switch (parkingLotInfo.status.toLowerCase()) {
        case 'empty':
          markerColor = 'green';
          break;
        case 'half-full':
          markerColor = 'orange';
          break;
        case 'full':
          markerColor = 'red';
          break;
        default:
          markerColor = 'gray'; // Set a default color for unknown statuses
      }
    
      var marker = L.marker([parkingLotInfo.lat, parkingLotInfo.lng], {
        icon: L.icon({
          iconUrl: `./images/parking-location-${markerColor}.png`,
          iconSize: [25, 25],
        }),
      });
    
      var popupParkInfo = `<div id="user-report">
        <h1>${parkingLotInfo.name}</h1>
        <p>Have a safe drive and let us know how full the parking lot is.</p>
        <p>${parkingLotInfo.status}</p>
        <p>${parkingLotInfo.price}</p>
        <input type="radio" value="full" name="status">
        <label>full</label>
        <input type="radio" value="half-full" name="status">
        <label>half-full</label>
        <input type="radio" value="empty" name="status">
        <label>empty</label>
        <button id="save-button" onclick="updateStatus('${parkingLotInfo.parkID}')">Confirm</button>
        <button id="close-button">Close</button>
      </div>`;
    
      // Attach a click event handler to show the popup on marker click
      marker.on('click', function () {
        if (!marker.isPopupOpen()) {
          marker.bindPopup(popupParkInfo).openPopup();
          bindPopupListeners(marker, parkingLotInfo);
        }
      });
    
      marker.addTo(map);
    });
    
    function bindPopupListeners(marker, parkingLotInfo) {
      var saveButton = document.getElementById('save-button');
      var closeButton = document.getElementById('close-button');
    
      saveButton.addEventListener('click', function () {
        console.log('Save button clicked for parking lot:', parkingLotInfo.parkID);
        updateStatus(parkingLotInfo.parkID);
        map.closePopup();
      });
    
      closeButton.addEventListener('click', function () {
        map.closePopup();
      });
    }
    
    function updateStatus(parkingLotID) {
      console.log('Updating status for parking lot:', parkingLotID);
      // Implement the logic to update the status in Firestore
    }
  });