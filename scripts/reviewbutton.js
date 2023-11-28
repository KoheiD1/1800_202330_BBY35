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