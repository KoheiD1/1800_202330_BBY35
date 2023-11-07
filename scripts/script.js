
var map = L.map('map').setView([49.249999, -123.0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



var parkingLayer = L.geoJSON(surroundingParkingLots, {
    onEachFeature: function (feature, layer) {
        var popupContent = feature.properties.status;

        // Attach a click event handler to show the popup on marker click
        layer.on('click', function () {
            layer.bindPopup(popupContent).openPopup();
        });
    }
});

parkingLayer.addTo(map);

var surroundingParkingLots = [
    { lat: 49.25104, lng: -122.99841, name: 'Parking Lot F' , status:''},
    { lat: 49.24552, lng: -123.00284, name: 'Parking Lot G', status:'' },
    { lat: 49.2540, lng: -123.0032, name: 'Parking Lot H', status:'' },
];

surroundingParkingLots.forEach(function (parkingLot) {
    var marker = L.marker([parkingLot.lat, parkingLot.lng]);
    marker.bindPopup(parkingLot.name);
    marker.addTo(map);
});


  // Get the elements by their ID
  var popupLink = document.getElementById("popup-link");
  var popupWindow = document.getElementById("popup-window");
  var closeButton = document.getElementById("close-button");
  // Show the pop-up window when the link is clicked
  popupLink.addEventListener("click", function(event) {
    event.preventDefault();
    popupWindow.style.display = "block";
  });
  // Hide the pop-up window when the close button is clicked
  closeButton.addEventListener("click", function() {
    popupWindow.style.display = "none";
  });
