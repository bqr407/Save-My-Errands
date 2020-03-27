function initMap(lat, long) {
    // The location of the starting point
    var userlocation = {
        lat: lat,
        lng: long
    };
    // The map, centered at user's location
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 14,
            center: userlocation
        });
    // A new marker, positioned at user's location
    var image = 'images/mylocation.png';
    var marker = new google.maps.Marker({
        position: userlocation,
        map: map,
        icon: image
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // Can't get their location
    }
}

function showPosition(position) {
    let x = [position.coords.latitude, position.coords.longitude];
    initMap(x[0], x[1]);
}

getLocation();