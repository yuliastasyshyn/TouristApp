
function navigateTo(page) {
    window.location.href = page;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    var defaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  
    var redIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  
    var map = L.map("map").setView([49.8397, 24.0297], 13);

    fetch('leopoli.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: 'red',
          weight: 2,
          opacity: 1
        }
      }).addTo(map);
    })
    .catch(error => console.error('Помилка завантаження GeoJSON:', error));
  
  
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  
    var landmarks = [
        { name: "Lviv Opera House", coords: [49.8440, 24.0266] },
        { name: "High Castle", coords: [49.8506, 24.0399] },
        { name: "Rynok Square", coords: [49.8414, 24.0316] },
        { name: "St. George's Cathedral", coords: [49.8365, 24.0180] },
        { name: "Lychakiv Cemetery", coords: [49.8368, 24.0550] },
        { name: "Armenian Cathedral", coords: [49.8438, 24.0315] },
        { name: "Potocki Palace", coords: [49.8393, 24.0256] },
        { name: "Dominican Cathedral", coords: [49.8421, 24.0340] },
        { name: "Boim Chapel", coords: [49.8411, 24.0311] },
        { name: "Latin Cathedral", coords: [49.8417, 24.0312] },
        { name: "Bernardine Church", coords: [49.8410, 24.0345] },
        { name: "House of Scientists", coords: [49.8401, 24.0252] },
        { name: "Jesuit Church", coords: [49.8415, 24.0299] },
        { name: "Lviv City Hall", coords: [49.8414, 24.0316] },
        { name: "Pharmacy Museum", coords: [49.8418, 24.0329] },
        { name: "Lviv Arsenal", coords: [49.8427, 24.0342] },
        { name: "Museum of Folk Architecture and Life", coords: [49.8478, 24.0618] },
        { name: "Shevchenko Avenue", coords: [49.8386, 24.0265] },
        { name: "Ivan Franko Park", coords: [49.8375, 24.0228] },
        { name: "Stryisky Park", coords: [49.8256, 24.0222] },
        { name: "St. Elizabeth Church", coords: [49.8398, 24.0122] },
        { name: "Lviv National Art Gallery", coords: [49.8391, 24.0235] },
        { name: "Dzyga Art Center", coords: [49.8432, 24.0321] },
        { name: "Lviv Beer Museum (Pravda Brewery)", coords: [49.8423, 24.0317] },
        { name: "Museum of the History of Religion", coords: [49.8420, 24.0336] },
        { name: "Lviv Polytechnic National University", coords: [49.8351, 24.0153] },
        { name: "Mickiewicz Square", coords: [49.8405, 24.0279] }
    ];
    
    
    var markerObjects = [];
    landmarks.forEach(function (place) {
      var marker = L.marker(place.coords, { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`<b>${place.name}</b>`);
      markerObjects.push({ name: place.name.toLowerCase(), marker: marker });
    });
  
   
    document.getElementById("search-btn").addEventListener("click", function () {
      var searchText = document.getElementById("search").value.toLowerCase().trim();
  
      if (!searchText) {
        alert("Please enter search text.");
        return;
      }
  
      var found = false;
     
      markerObjects.forEach(function (obj) {
        if (obj.name.indexOf(searchText) !== -1) {
          
          obj.marker.setIcon(redIcon);
          obj.marker.openPopup();
          found = true;
        } else {
         
          obj.marker.setIcon(defaultIcon);
        }
      });
  
      if (!found) {
        alert("No landmarks found matching: " + searchText);
      }
    });
  });
  