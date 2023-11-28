// Create the Leaflet map
var map = L.map('map').setView([49.249999, -123.0], 16);
var sidebar = document.getElementById('sidebar');

// This is for getting the persons geolocation
// And setting it to the center of the map
const successCallback = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  map.setView([(latitude), (longitude)], 16);

};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback)


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);