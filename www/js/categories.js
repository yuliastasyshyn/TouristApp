document.addEventListener("DOMContentLoaded", function () {
const themeToggle = document.getElementById("theme-toggle");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  }
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  });

  
  var defaultIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var redIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  
  var map = L.map("map").setView([49.8397, 24.0297], 13);
  var tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  
  var lvivBordersLayer = L.layerGroup().addTo(map);
  fetch("leopoli.geojson")
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: { color: "red", weight: 2, opacity: 1 },
      }).addTo(lvivBordersLayer);
    })
    .catch(error => console.error("Помилка завантаження GeoJSON:", error));


  var landmarksLayer = L.layerGroup();
  var restaurantsLayer = L.layerGroup();
  var shoppingLayer = L.layerGroup();
  var startLayer = L.layerGroup().addTo(map);

  
  function addMarker(layer, lat, lng, popupContent, url = null) {
    var marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(layer);

    if (url) {
      marker.bindPopup(
        `<div style="text-align: center;">
           <b style="color: black;">${popupContent}</b><br>
           <button style="color: red; border: 2px solid red; background-color: transparent; padding: 5px 10px; cursor: pointer;" onclick="window.open('${url}', '_blank')">
             Детальніше
           </button>
         </div>`
      );
    } else {
      marker.bindPopup(
        `<div style="text-align: center;">
           <b style="color: black;">${popupContent}</b>
         </div>`
      );
    }

    return { marker: marker, name: popupContent.toLowerCase() };
  }

 
  var landmarks = [
    { name: "Львівський театр опери та балету", coords: [49.8440, 24.0266], url: "https://blog.vlasne.ua/opera-lv/" },
    { name: "Високий замок", coords: [49.8506, 24.0399], url: "https://karpatium.com.ua/misto-lviv-shcho-podyvytys-ta-de-vidpochyty/vysokyi-zamok-u-lvovi-zamkova-hora" },
    { name: "Площа Ринок", coords: [49.8414, 24.0316], url: "https://lviv.travel/ua/places/attractions/ploshcha-rinok" },
    { name: "Собор святого Юри", coords: [49.8365, 24.0180], url: "https://lviv.travel/ua/places/attractions/cobor-sviatogo-iura" },
    { name: "Личаківське кладовище", coords: [49.8368, 24.0550], url: "https://lviv-lychakiv.com.ua/" }
  ];

  var restaurants = [
    { name: "Ресторан Амадеус", coords: [49.8419, 24.0315], url: "https://amadeus.ua" },
    { name: "Ресторан Вероніка", coords: [49.8380, 24.0285], url: "https://veronica.ua" },
    { name: "Ресторан Чорний кіт", coords: [49.8350, 24.0260], url: "https://blackcat.ua" },
    { name: "Криївка", coords: [49.8390, 24.0310], url: "https://www.fest.lviv.ua/uk/restaurants/kryjivka/" },
    { name: "Ресторан Бачевських", coords: [49.8386, 24.0292], url: "https://baczewski.com.ua/" },
    { name: "Mons Pius", coords: [49.8390, 24.0310], url: "https://monspius.com.ua/" }
  ];

  var shoppingPlaces = [
    { name: "Victoria Gardens", coords: [49.8073, 23.9790], url: "https://victoriagardens.com.ua/" },
    { name: "Forum Lviv", coords: [49.8497, 24.0262], url: "https://forumlviv.com/" },
    { name: "King Cross Leopolis", coords: [49.7870, 24.0567], url: "https://kingcross.com.ua/" }
  ];

  var landmarkMarkers = landmarks.map(place =>
    addMarker(landmarksLayer, place.coords[0], place.coords[1], place.name, place.url)
  );
  var restaurantMarkers = restaurants.map(place =>
    addMarker(restaurantsLayer, place.coords[0], place.coords[1], place.name, place.url)
  );
  var shoppingMarkers = shoppingPlaces.map(place =>
    addMarker(shoppingLayer, place.coords[0], place.coords[1], place.name, place.url)
  );

  var isStartRemoved = false;


  function showLayer(selectedLayer) {
    if (!isStartRemoved) {
      map.removeLayer(startLayer);
      isStartRemoved = true;
    }

    map.removeLayer(landmarksLayer);
    map.removeLayer(restaurantsLayer);
    map.removeLayer(shoppingLayer);

    if (!map.hasLayer(tileLayer)) map.addLayer(tileLayer);
    if (!map.hasLayer(lvivBordersLayer)) map.addLayer(lvivBordersLayer);

    map.addLayer(selectedLayer);
  }

 
  document.getElementById("landmarks-btn").addEventListener("click", () => showLayer(landmarksLayer));
  document.getElementById("restaurants-btn").addEventListener("click", () => showLayer(restaurantsLayer));
  document.getElementById("shopping-btn").addEventListener("click", () => showLayer(shoppingLayer));


  document.getElementById("search-btn").addEventListener("click", function () {
    var searchText = document.getElementById("search").value.toLowerCase().trim();
    if (!searchText) {
      alert("Введіть назву місця!");
      return;
    }
    var found = false;
    [...landmarkMarkers, ...restaurantMarkers, ...shoppingMarkers].forEach(obj => {
      if (obj.name.includes(searchText)) {
        obj.marker.setIcon(redIcon);
        obj.marker.openPopup();
        map.setView(obj.marker.getLatLng(), 15);
        found = true;
      } else {
        obj.marker.setIcon(defaultIcon);
      }
    });
    if (!found) {
      alert("Місце не знайдено!");
    }
  });
  
  
  var drawButton = document.createElement("button");
  drawButton.textContent = "Обвести фрагмент";
  drawButton.style.position = "absolute";
  drawButton.style.top = "10px";
  drawButton.style.right = "10px";
  drawButton.style.zIndex = "1000";
  drawButton.style.padding = "10px";
  drawButton.style.backgroundColor = "#fff";
  drawButton.style.border = "2px solid black";
  drawButton.style.cursor = "pointer";
  document.body.appendChild(drawButton);
  
  
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  
  
  var markersInPolygonLayer = new L.LayerGroup();
  map.addLayer(markersInPolygonLayer);
  
  var drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polygon: {
              shapeOptions: { color: 'blue' }
          }
      }
  });
  
  
  drawButton.addEventListener("click", function () {
      map.addControl(drawControl);
  });
  
  
  map.on(L.Draw.Event.CREATED, function (event) {
      var layer = event.layer;
      drawnItems.addLayer(layer);
  
    
      var polygon = layer.toGeoJSON();
      var polygonLatLngs = polygon.geometry.coordinates[0].map(coord => [coord[0], coord[1]]); 
  
      
      var markersInside = [];
      markersInPolygonLayer.clearLayers();  
  
      [...landmarkMarkers, ...restaurantMarkers, ...shoppingMarkers].forEach(obj => {
          var latlng = obj.marker.getLatLng();
         
          if (turf.booleanPointInPolygon(turf.point([latlng.lng, latlng.lat]), turf.polygon([polygonLatLngs]))) {
              markersInside.push(obj.name);
             
              var markerInPolygon = L.marker(latlng, { icon: redIcon }).addTo(markersInPolygonLayer);
              markerInPolygon.bindPopup(`<b>${obj.name}</b>`); 
          }
      });
  
      
      if (markersInside.length > 0) {
          alert("Мітки в обведеній області:\n" + markersInside.join("\n"));
      } else {
          alert("Жодна мітка не потрапила у вибраний фрагмент.");
        }
      });

var clearButton = document.createElement("button");
clearButton.textContent = "Очистити все";
clearButton.style.position = "absolute";
clearButton.style.top = "50px";
clearButton.style.right = "10px";
clearButton.style.zIndex = "1000";
clearButton.style.padding = "10px";
clearButton.style.backgroundColor = "#fff";
clearButton.style.border = "2px solid black";
clearButton.style.cursor = "pointer";
document.body.appendChild(clearButton);

clearButton.addEventListener("click", function () {
  
    markersInPolygonLayer.clearLayers();

    
    drawnItems.clearLayers();

    
    map.setView([49.8397, 24.0297], 13);
});
 
      
  });