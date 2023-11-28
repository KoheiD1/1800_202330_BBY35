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
          statusIcon = "<img src=\"./images/toomuchtraffic2.png\" alt=\"Crowded\" style=\"width: 50px; height: 50px;\">";
          break;
        case 'half-full':
          statusIcon = "<img src=\"./images/toomuchtraffic1.png\" alt=\"Crowded\" style=\"width: 50px; height: 50px;\">";
          break;
        case 'full':
          statusIcon = "<img src=\"./images/toomuchtraffic.png\" alt=\"Crowded\" style=\"width: 50px; height: 50px;\">";
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
    <p class="status">Parking Lot is ${parkingLotInfo.status}!</p>
    <br>
    <p class="timestamp">Updated ${formattedTimeDifference}</p>
    </div>
    <div id = "statusbox1">
    <p>${parkingLotInfo.price}$</p>
    <br>
    <p class="timestamp">For 2 Hours</p>
    </div>
    </div>
    <br>
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