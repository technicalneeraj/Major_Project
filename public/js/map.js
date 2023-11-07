mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: listing.geometry.coordinates, // starting position [lng, lat] //centre point //normally lat phla aata
zoom: 9 // starting zoom
});


const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates)   // as we cant access directly the listing.geometry.cooredinates as it is public file !!
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
.addTo(map);
 

    