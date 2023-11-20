// Create the Leaflet map
var map = L.map('map').setView([49.249999, -123.0], 16);
var sidebar = document.getElementById('sidebar');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Reference Firestore collection
const parkingLotsRef = db.collection('parkingLots');

// Fetch parking lot data from Firestore and listen for real-time updates
parkingLotsRef.onSnapshot((snapshot) => {
  // Clear existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  var surroundingParkingLots = [];

  // This is grabbing a snapshot of the parkinglot info of the certain parking lots

  snapshot.forEach((doc) => {
    var data = doc.data();
    var ID = doc.id;
    var parkingLotInfo = {
      parkID: ID,
      lat: data.lat,
      lng: data.lng,
      name: data.name,
      status: data.status,
      status_update: data.last_update,
      price: data.price
    };

    surroundingParkingLots.push(parkingLotInfo);
    console.log('Loaded parking lot:', parkingLotInfo);

    createMarkerAndPopup(parkingLotInfo);
  });

  // Function that makes the markers diffrent color depending on there
  // Parking lot status
  function createMarkerAndPopup(parkingLotInfo) {
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

    // This is the actual marker.
    var marker = L.marker([parkingLotInfo.lat, parkingLotInfo.lng], {
      icon: L.icon({
        iconUrl: `./images/parking-location-${markerColor}.png`,
        iconSize: [25, 25],
      }),
    });


   marker.on('click',function(){
    sidebar.innerHTML=`
    <h1>${parkingLotInfo.name}</h1>
    <p>Have a safe drive and let us know how full the parking lot is.</p>
    <p>${parkingLotInfo.status}</p>
    <p>${parkingLotInfo.price}</p>
    <a href="https://www.google.com/maps?daddr=${parkingLotInfo.lat},${parkingLotInfo.lng}" class="btn btn-outline-secondary" role="button" aria-pressed="true" target = "_blank">Navigate</a>
    <br>
    <input type="radio" value="full" name="status">
    <label>full</label>
    <input type="radio" value="half-full" name="status">
    <label>half-full</label>
    <input type="radio" value="empty" name="status">
    <label>empty</label>
    <button id="save-button">Confirm</button>
    <button id="close-button">Close</button>
 `;
  document.getElementById('invisible').style.display = 'block';
   })

    marker.addTo(map);
  }

  // This is the code that sets the markers to the actually parking
  //  information alos creats savebutton and closeButtons for them
  function bindPopupListeners(marker, parkingLotInfo) {
    var saveButton = document.getElementById('save-button');
    var closeButton = document.getElementById('close-button');

    //This is the code for the save button
    // I made it so that the status of the parking lot is updated here after
    // refrencing the parkingLotInfo.parkID
    saveButton.addEventListener('click', function () {
      console.log('Save button clicked for parking lot:', parkingLotInfo.parkID);
      updateStatus(parkingLotInfo.parkID);
      map.closePopup();
    });

    // This is the code for the closebutton if clicke it just closes the popup
    closeButton.addEventListener('click', function () {
      map.closePopup();
    });
  }

  function updateStatus(parkingLotID) {
    console.log('Updating status for parking lot:', parkingLotID);
    // Implement the logic to update the status in Firestore

    // For example, assuming you have the 'status' input in the popup
    var selectedStatus = document.querySelector('input[name="status"]:checked').value;

    // Update Firestore with the selected status
    parkingLotsRef.doc(parkingLotID).update({
      status: selectedStatus,
      status_update: new Date() // You might want to update the timestamp
    })
    .then(() => {
      console.log('Status updated successfully');
    })
    .catch((error) => {
      console.error('Error updating status:', error);
    });
  }
});


