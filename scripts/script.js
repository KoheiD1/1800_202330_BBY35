
var map = L.map('map').setView([49.249999, -123.0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var parkingData 

var parkingLayer = L.geoJSON(parkingData, {
    onEachFeature: function (feature, layer) {
        var popupContent = feature.properties.name;

        // Attach a click event handler to show the popup on marker click
        layer.on('click', function () {
            layer.bindPopup(popupContent).openPopup();
        });
    }
});

parkingLayer.addTo(map);

var surroundingParkingLots = [
    { lat: 49.25104, lng: -122.99841, name: 'Parking Lot F' },
    { lat: 49.24552, lng: -123.00284, name: 'Parking Lot G' },
    { lat: 49.2540, lng: -123.0032, name: 'Parking Lot H' },
    { lat: 49.2539, lng: -122.9992, name: 'Parking Lot I' },
    { lat: 49.2526, lng: -123.0038, name: 'Parking Lot J' }  // Added Parking Lot E
];

surroundingParkingLots.forEach(function (parkingLot) {
    var marker = L.marker([parkingLot.lat, parkingLot.lng]);
    marker.bindPopup(parkingLot.name);
    marker.addTo(map);
});