
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    center: coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});
console.log(coordinates);
const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.addTo(map)
