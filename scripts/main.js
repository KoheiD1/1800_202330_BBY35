
// Reference Firestore collection
const parkingLotsRef = db.collection('parkingLots');
var clickedMarker = null;
var origin = null;
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

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
document.getElementById('Logout').addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("Logging out user");
    }).catch((error) => {
      // An error happened.
      console.error("Logout error:", error);
    });
  });
