var map,service;

var pizzaIcon = 'icon.png';


function initialize() {
var mapOptions = {
 zoom: 15
};
map = new google.maps.Map(document.getElementById('map-canvas'),
   mapOptions);

// Try HTML5 geolocation
if(navigator.geolocation) {
 navigator.geolocation.getCurrentPosition(function(position) {
   var pos = new google.maps.LatLng(position.coords.latitude,
                                    position.coords.longitude);

   var infowindow = new google.maps.InfoWindow({
     map: map,
     position: pos,
     content: 'You are here, in need of pizza.'
   });

   map.setCenter(pos);

  var request = {
    location: pos,
    radius: '300',
    query: 'pizza'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);


 }, function() {
   handleNoGeolocation(true);
 });
} else {
 // Browser doesn't support Geolocation
 handleNoGeolocation(false);
}
}

var infowindow = new google.maps.InfoWindow(
  { 
    size: new google.maps.Size(150,50)

  });

 function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
	  icon: pizzaIcon
    });

    var request = { reference: place.reference };
    service.getDetails(request, function(details, status) {
	  if (status === google.maps.places.PlacesServiceStatus.OK) {
	            $('#placedata').append('<tr><td><a href='+details.url+'>' + details.name + '</a></td></tr>');
	        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
	            setTimeout(function() {
	                createMarker(place);
	            }, 200);
	        }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(details.name + "<br />" + details.formatted_address +"<br />" + details.formatted_phone_number + "<br />" );
        infowindow.open(map, this);
      });
    });

}


google.maps.event.addDomListener(window, 'load', initialize);


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
		console.log(results[i]);
      var place = results[i];
           createMarker(results[i]);
    }
  }
}

function handleNoGeolocation(errorFlag) {
if (errorFlag) {
 var content = 'Error: The Geolocation service failed.';
} else {
 var content = 'Error: Your browser doesn\'t support geolocation.';
}

var options = {
 map: map,
 position: new google.maps.LatLng(60, 105),
 content: content
};


}

google.maps.event.addDomListener(window, 'load', initialize);
