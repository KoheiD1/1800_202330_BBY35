var parkingID = localStorage.getItem("parkingLotID");    //visible to all functions on this page
// I met a issue here, I the local storage will not refresh automatically, when switch, it will be fixed when get a new review.html page.
// let's see.
var parkingLot = db.collection("parkingLots").doc(parkingID);
function getParkingName(ID) {
    db.collection("parkingLots")
      .doc(ID)
      .get()
      .then((thisParking) => {
        var parkingName = thisParking.data().name;
        document.getElementById("parkingName").innerHTML = parkingName;// insert the parking name on the heading of review.html
        });
}

getParkingName(parkingID);


function updateStatus() {
    console.log("update the status of parking");
    var parkingStatus = document.querySelector('input[name="status"]:checked').value;

    console.log(parkingStatus);

    var user = firebase.auth().currentUser;
    if (user) {

        parkingLot.update({
            status:parkingStatus,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("Document successfully updated!");
            window.location.href = "thanks.html"; // Redirect to the thanks page
        });
    } else {
        console.log("No user is signed in");
        window.location.href = 'review.html';
    }
}
