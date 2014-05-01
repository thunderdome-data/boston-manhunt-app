var openWindow;
var markers = [];
var data = [];
var gMapStyles =[
  {
    "featureType": "poi.park",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "landscape.natural.terrain",
    "elementType": "geometry.fill",
    "stylers": [
      { "color": "#ffffff" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": "#c9e0ed" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "on" },
      { "color": "#c8c8c8" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": "#e6e6e6" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.stroke",
    "stylers": [
      { "visibility": "off" }
    ]
  }
 ];

function initialize() {
    jQuery('#prevBtn').attr('enabled','disabled');
    var infoWindow = new google.maps.InfoWindow({
      content: ''
    });
    var myLatlng = new google.maps.LatLng(42.36040, -71.13096);
    var mapOptions = {
        zoom: 13,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: gMapStyles
    }
    var map = new google.maps.Map(document.getElementById('boston-map'), mapOptions);
    for (i in data) {
        var image = 'lib/images/markers/gray' + (parseInt(i)+1) + '.png';

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(data[i].lat),parseFloat(data[i].lon)),
            map: map,
            icon: image,
            detail: i,
            title: data[i].title
        });
        markers.push(marker);
        var source = $("#popupText").html();
        var template = Handlebars.compile(source);

        var text = template({title: data[i].title,address:data[i].address,description: data[i].description, time: data[i].time});
        bind_event(map,marker,i);

    }
    next_event(event_number,0);
}
function bind_event(map,marker,i) {
    google.maps.event.addListener(marker, 'click', function() {
        event_number = i;
        next_event(i,0);
    });

}
function next_event(event,direction) {
    event_number = parseInt(event_number)+ parseInt(direction);
    if(event_number < 0) { event_number = 0;}
    event = event_number;
    if(event == 0) {
        jQuery('#prevBtn').attr('disabled',true);
        jQuery('#prevBtn').css('background-color','#ccc');
        jQuery('#nextBtn').attr('disabled',false);
        jQuery('#nextBtn').css('background-color','#000');
    }
    else {
        jQuery('#prevBtn').attr('disabled',false);
        jQuery('#prevBtn').css('background-color','#000');
   }
    var source = $("#popupText").html();
    var template = Handlebars.compile(source);
    var text = template({title: data[event].title,address:data[event].address,description: data[event].description, time: data[event].time,image:data[event].image,caption:data[event].caption});
    jQuery('#boston-map-explainer').html(text);
    for(var i = 0; i < markers.length; i++) {
        markers[i].setIcon('lib/images/markers/gray' + data[i].id + '.png');
    }
    markers[event].setIcon('lib/images/markers/orange' + data[event].id + '.png');
    if(typeof data[event_number + 1] == 'undefined') {
        jQuery('#nextBtn').attr('disabled',true);
        jQuery('#nextBtn').css('background-color','#ccc');
        jQuery('#prevBtn').attr('disabled',false);
        jQuery('#prevBtn').css('background-color','#000');

    }
}
function loadGSContent(gsData) {
	var keyPattern = /gsx/;
	for(i in gsData.feed.entry) {
		var row = {};
		for(j in gsData.feed.entry[i]) {
			if(keyPattern.test(j)) {
				var key = j.replace('gsx$','');
				row[key] = gsData.feed.entry[i][j].$t;				
			}
			
		}
		data.push(row);
	}
    initialize();
}
