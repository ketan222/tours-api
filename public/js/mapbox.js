// var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

// console.log('hello from the client side');
// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);
mapboxgl.accessToken = 'pk.eyJ1Ijoia2V0YW44MzczIiwiYSI6ImNtMXJxOW5idzBjY3Mya3FzYmQ3b2x6ejEifQ.82DtsHDOC6iDk9U1fQ8hpw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});


// mapboxgl.accessToken = "pk.eyJ1Ijoia2V0YW44MzczIiwiYSI6ImNtMXJxOW5idzBjY3Mya3FzYmQ3b2x6ejEifQ.82DtsHDOC6iDk9U1fQ8hpw";
// var map = new mapboxgl.Map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11'
// });