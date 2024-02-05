mapboxgl.accessToken = 'pk.eyJ1IjoiaGhmMTIzIiwiYSI6ImNscjZla3U0NjIxc3QybHBubDF2Y2JzbGcifQ.bXtBFEBZhvIDot6Hwd0EfA';

const map = new mapboxgl.Map({
 container: 'map', 
 style: 'mapbox://styles/hhf123/clrzq153900at01pnhflg1o46',
 center: [-0.1276,51.5072], 
 zoom: 9.5
})

const data_url = "https://api.mapbox.com/datasets/v1/hhf123/clrzo72yx2hsk1unsbkm9wqtd/features?access_token=pk.eyJ1IjoiaGhmMTIzIiwiYSI6ImNscjZla3U0NjIxc3QybHBubDF2Y2JzbGcifQ.bXtBFEBZhvIDot6Hwd0EfA"

map.on('load', () => {
  map.addLayer({
    id: 'infrastructure',
    type: 'circle',
    source: {
      type: 'geojson',
      data: data_url 
    },
    paint: {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': ['match',['get','Infrastructure_Type'],
        'cinema','red',
        'library','blue',
        'museum','yellow',
        'theatre','green',
        'black'] 
    }
  });
});

const scale = new mapboxgl.ScaleControl({
  maxWidth: 100,
  unit: "metric"
});
map.addControl(scale, "bottom-right");

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, 
  mapboxgl: mapboxgl, 
  marker: {
    color: 'red'
  },
  placeholder: "Search for places", 
  proximity: {
    longitude: 51.5072,
    latitude: -0.1276
  } 
});
map.addControl(geocoder, "top-right");

map.addControl(new mapboxgl.NavigationControl());

map.addControl(new mapboxgl.GeolocateControl
  ({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }), 
);

map.addControl(new mapboxgl.FullscreenControl());

map.on('click', (event) => {
const features = map.queryRenderedFeatures(event.point, {
layers: ['infrastructure'] 
});
if (!features.length) {
return;
}
const feature = features[0];

const popup = new mapboxgl.Popup({ offset: [0, -15], className: "my-popup"})
    .setLngLat(feature.geometry.coordinates)
    .setHTML(
      `<h3> ${feature.properties.name}</h3>
    <p>Borough: ${feature.properties.borough_name}</p>
    <p>Ward: ${feature.properties.ward_2022_name}</p>`
    )
    .addTo(map);  
  map.flyTo({
    center: feature.geometry.coordinates, 
    zoom: 15 
  });  
});




var checkbox_cinema = document.getElementById("cinema")
var checkbox_library = document.getElementById("library")
var checkbox_museum = document.getElementById("museum")
var checkbox_theatre = document.getElementById("theatre")  

document.getElementById('filters').addEventListener('change', (event) => {
    
    if (checkbox_cinema.checked == true){
      filterCinema = ['==', ['get', 'Infrastructure_Type'], 'cinema'];
    } else {
      filterCinema = ['==', ['get', 'Infrastructure_Type'], 'placeholder'];
    }
    
    if (checkbox_library.checked == true){
      filterLibrary = ['==', ['get', 'Infrastructure_Type'], 'library'];
    } else {
      filterLibrary = ['==', ['get', 'Infrastructure_Type'], 'placeholder'];
    }  

    if (checkbox_museum.checked == true){
      filterMuseum = ['==', ['get', 'Infrastructure_Type'], 'museum'];
    } else {
      filterMuseum = ['==', ['get', 'Infrastructure_Type'], 'placeholder'];
    }   
  
    if (checkbox_theatre.checked == true){
      filterTheatre = ['==', ['get', 'Infrastructure_Type'], 'theatre'];
    } else {
      filterTheatre = ['==', ['get', 'Infrastructure_Type'], 'placeholder'];
    }   
     
    map.setFilter('infrastructure', ['any', filterCinema,filterLibrary,filterMuseum,filterTheatre]);
});

document.getElementById('getback').addEventListener('click', () => { 
        map.flyTo({
            center: [-0.1276,51.5072],
            zoom: 9.5
        });
    });