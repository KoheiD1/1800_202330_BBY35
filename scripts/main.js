// Create the Leaflet map
var map = L.map('map').setView([49.249999, -123.0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Reference Firestore collection
const parkingLotsRef = db.collection('parkingLots');

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
        status_update:data.last_update,
        price: data.price
      };
      //@Kohei can add some map layer here, to make the parking show on the web page

      surroundingParkingLots.push(parkingLotInfo);
      console.log('Loaded parking lot:', parkingLotInfo);
    });

  }
  )
