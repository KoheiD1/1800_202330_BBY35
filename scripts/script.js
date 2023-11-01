function sayHello() {
    
}
//sayHello();

var map;

function loadMap() {
            map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
            credentials: 'AkuSFqo_vDqV_Dju7LtwW35sQF_W79IH2OIFpZQL9uVY4kxhW6ZAa-v2EA5mJtUG',
            center: new Microsoft.Maps.Location(49.2489346, -123.0001168), // Default map center (Seattle coordinates)
            zoom: 15 // Default zoom level
        });
    }

    getUserLocation();
        

function getUserLocation() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    // Create a pushpin to mark the user's location
                    var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(latitude, longitude), {
                        title: 'Your Location',
                    });

                    // Add the pushpin to the map
                    map.entities.push(pushpin);

                    // Center the map on the user's location
                    map.setView({ center: new Microsoft.Maps.Location(latitude, longitude), zoom: 15 });
                });
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        }