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
      status_update: data.status_update,
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
        markerColor = 'green';
        break;
      case 'full':
        markerColor = 'red';
        break;
      default:
        markerColor = 'green'; // Set a default color for unknown statuses
    }

    // This is the actual marker.
    var marker = L.marker([parkingLotInfo.lat, parkingLotInfo.lng], {
      icon: L.icon({
        iconUrl: `./images/parking-location-${markerColor}.png`,
        iconSize: [40, 56],
      }),
    });

    //This is the code for determining how many car icons should be displayed depending
    //On the status of the parkinglot.

    marker.on('click', function () {
      marker.setIcon(L.icon({
        
        iconUrl: `./images/parking-location-clicked.png`,
        iconSize: [40, 56],
      }));



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
          statusIcon = "<img src=\"./images/toomuchtraffic.png\" alt=\"Crowded\" style=\"width: 40px; height: 4S0px;\">";
          break;
        default:
          markerColor = 'gray';
      }
      // Assuming parkingLotInfo.status_update is a timestamp in milliseconds
      const statusUpdateTimestamp = parkingLotInfo.status_update.toMillis(); // Convert Firestore timestamp to milliseconds

      const currentTimeStamp = new Date().getTime();
      const timeDifference = currentTimeStamp - statusUpdateTimestamp;

      // Convert time difference to a human-readable format (e.g., minutes ago)
      const formattedTimeDifference = calculateTimeDifference(timeDifference);
      function calculateTimeDifference(timeDifference) {
        const minutes = Math.floor(timeDifference / (1000 * 60));
        if (minutes <= 60)
          return `${minutes} minutes ago`;
        else if (minutes <= 1440) {
          const hours = Math.floor(minutes / (60));
          return `${hours} hours ago`;
        }
        else {
          const days = Math.floor(minutes / (24 * 60));
          return `${days} days ago`;
        }

      }
      //This is the HTML for the popupSideBar
      sidebar.innerHTML = `
    <div id = "popup">
    <div id = "headerpop">
    <div id = "x-close">
    <button id="close-button">&#x2715;</button>
    </div>
    <h1>${parkingLotInfo.name}</h1>
    </div>
    <br>
    <br>
    <div id ="box">
    <div id = "statusbox">
    <p id="statusicon">${statusIcon}</p>
    <p id="timestamp">updated ${formattedTimeDifference}</p>
    </div>
    <div id = "statusbox1">
    <p>${parkingLotInfo.price}$</p>
    </div>
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
        <label for="radio-full">At Capacity</label>
    </div>
    <div>
        <input type="radio" id="radio-half-full" value="half-full" name="status">
        <label for="radio-half-full">Limited Parking Space</label>
    </div>
    <div>
        <input type="radio" id="radio-empty" value="empty" name="status">
        <label for="radio-empty">Lots of Parking Space</label>
    </div>

    <br>
    <button type="button" class="btn btn-lg btn-primary" id="save-button">Confirm</button>
</div>
    </div>
 `;

      //This is the function for making the HTML popup.
      document.getElementById('invisible').style.display = 'block';
      bindPopupListeners(marker, parkingLotInfo);
    })

    marker.addTo(map);
  }


  // This is the code that sets the markers to the actually parking
  //  information also creates savebutton and closeButtons for them
  function bindPopupListeners(marker, parkingLotInfo) {
    var saveButton = document.getElementById('save-button');
    var closeButton = document.getElementById('close-button');
    var surveybutton = document.getElementById('button-survey')

    //This is the code for the save button
    // I made it so that the status of the parking lot is updated here after
    // referencing the parkingLotInfo.parkID
    saveButton.addEventListener('click', function () {
      console.log('Save button clicked for parking lot:', parkingLotInfo.parkID);
      updateStatus(parkingLotInfo.parkID);

      //This is the code for the alert
      // Using SweetAlret2 API
      Swal.fire({
        icon: 'success',
        title: 'Parking Lot Updated!',
        text: 'Thank you for updating our parking lot status.',
        showConfirmButton: false,
        timer: 2500
      });

      document.getElementById('invisible').style.display = 'none';
    });

    // This is the code for the closebutton if clicked it just closes the popup
    closeButton.addEventListener('click', function () {
      document.getElementById('invisible').style.display = 'none';
    });

    // This is the code for the review button if clicked it just
    // Shows the survey to update parking status.
    surveybutton.addEventListener('click', function () {
      console.log('review button has been clicked')
      document.getElementById('survey').style.display = 'block'
    })
  }

  // Updates the parking lot status
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





