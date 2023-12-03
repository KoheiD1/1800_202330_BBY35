

//Code for the Navbar
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   //if the pointer to "user" object is not null, then someone is logged in
            // User is signed in.
            console.log($('#navbarPlaceholder').load('./pages/nav_after_login.html'));

        } else {
            // No user is signed in.
           console.log($('#navbarPlaceholder').load('./pages/nav_before_login.html'));
        }
    });
}
loadSkeleton(); //invoke the function
