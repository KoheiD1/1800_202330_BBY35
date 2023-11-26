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
    var parking = parkingLotInfo.status.charAt(0).toUpperCase() + parkingLotInfo.status.slice(1);
    var statusIcon;
    switch (parkingLotInfo.status.toLowerCase()) {
      case 'empty':
        statusIcon = "<span class=\"material-symbols-outlined\"> directions_car</span>";
        break;
      case 'half-full':
        statusIcon = "<span class=\"material-symbols-outlined\"> directions_car</span><span class=\"material-symbols-outlined\"> directions_car</span>";
        break;
      case 'full':
        statusIcon = "<span class=\"material-symbols-outlined\"> directions_car</span><span class=\"material-symbols-outlined\"> directions_car</span><span class=\"material-symbols-outlined\"> directions_car</span>";
        break;
      default:
        markerColor = 'gray'; 
    }

    sidebar.innerHTML=`
    <div id = "popup">
    <div id = "headerpop">
    <div id = "x-close">
    <button id="close-button">&#x2715;</button>
    </div>
    <h1>${parkingLotInfo.name}</h1>
    </div>
    <br>
    <br>
    <div id = "statusbox">
    <p>${statusIcon}</p>
    </div>
    <div id = "statusbox1">
    <p>${parkingLotInfo.price}$</p>
    </div>
    <br>
    <div id="navigate">
    <button class="navigate-button"><a href="https://www.google.com/maps?daddr=${parkingLotInfo.lat},${parkingLotInfo.lng}" target="_blank">Get Direction</a></button>
    </div>
    <br>
    <div id="parking">
    <button id = "button-survey" class="btn btn-outline-secondary" role="button" aria-pressed="true">Update ParkingLot Status</button>
    </div>
    <div id="survey">
    <div>
        <input type="radio" id="radio-full" value="full" name="status">
        <label for="radio-full">Full</label>
    </div>
    <div>
        <input type="radio" id="radio-half-full" value="half-full" name="status">
        <label for="radio-half-full">Half-Full</label>
    </div>
    <div>
        <input type="radio" id="radio-empty" value="empty" name="status">
        <label for="radio-empty">Empty</label>
    </div>

    <br>
    <button type="button" class="btn btn-lg btn-primary" id="save-button">Confirm</button>
</div>
    </div>
 `;

 
  document.getElementById('invisible').style.display = 'block';
  bindPopupListeners(marker, parkingLotInfo);
   })

    marker.addTo(map);
  }


  // This is the code that sets the markers to the actually parking
  //  information alos creats savebutton and closeButtons for them
  function bindPopupListeners(marker, parkingLotInfo) {
    var saveButton = document.getElementById('save-button');
    var closeButton = document.getElementById('close-button');
    var surveybutton = document.getElementById('button-survey')

    //This is the code for the save button
    // I made it so that the status of the parking lot is updated here after
    // refrencing the parkingLotInfo.parkID
    saveButton.addEventListener('click', function () {
      console.log('Save button clicked for parking lot:', parkingLotInfo.parkID);
      updateStatus(parkingLotInfo.parkID);
      document.getElementById('invisible').style.display = 'none';
    });

    // This is the code for the closebutton if clicke it just closes the popup
    closeButton.addEventListener('click', function () {
      document.getElementById('invisible').style.display = 'none';
    });

    surveybutton.addEventListener('click',function(){
      console.log('review button has been clicked')
      document.getElementById('survey').style.display ='block'
    })
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


