
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
});





