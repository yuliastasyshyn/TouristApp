document.addEventListener("DOMContentLoaded", function () {
    // Мітка за замовчуванням буде зеленою
    var defaultIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Червона іконка для пошуку
    var redIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
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
    
    fetch('leopoli.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: { color: 'red', weight: 2, opacity: 1 }
            }).addTo(lvivBordersLayer);
        })
        .catch(error => console.error('Помилка завантаження GeoJSON:', error));

    var landmarksLayer = L.layerGroup();
    var restaurantsLayer = L.layerGroup();
    var shoppingLayer = L.layerGroup();
    var startLayer = L.layerGroup().addTo(map);

    function addMarker(layer, lat, lng, popupContent) {
        var marker = L.marker([lat, lng], { icon: defaultIcon })
            .bindPopup(popupContent)
            .addTo(layer);
        return { marker: marker, name: popupContent.toLowerCase() };
    }

    var landmarks = [
        { name: "Lviv Opera House", coords: [49.8440, 24.0266] },
        { name: "High Castle", coords: [49.8506, 24.0399] },
        { name: "Rynok Square", coords: [49.8414, 24.0316] },
        { name: "St. George's Cathedral", coords: [49.8365, 24.0180] },
        { name: "Lychakiv Cemetery", coords: [49.8368, 24.0550] }
    ];

    var restaurants = [
        { name: "Ресторан Амадеус", coords: [49.8419, 24.0315] },
        { name: "Ресторан Вероніка", coords: [49.8380, 24.0285] },
        { name: "Ресторан Чорний кіт", coords: [49.8350, 24.0260] },
    ];

    var shoppingPlaces = [
        { name: "Victoria Gardens", coords: [49.8073, 23.9790] },
        { name: "Forum Lviv", coords: [49.8497, 24.0262] },
        { name: "King Cross Leopolis", coords: [49.7870, 24.0567] },
    ];

    var landmarkMarkers = landmarks.map(place => addMarker(landmarksLayer, place.coords[0], place.coords[1], place.name));
    var restaurantMarkers = restaurants.map(place => addMarker(restaurantsLayer, place.coords[0], place.coords[1], place.name));
    var shoppingMarkers = shoppingPlaces.map(place => addMarker(shoppingLayer, place.coords[0], place.coords[1], place.name));

    let isStartRemoved = false;

    function showLayer(selectedLayer) {
        if (!isStartRemoved) {
            map.removeLayer(startLayer);
            isStartRemoved = true;
        }

        landmarksLayer.remove();
        restaurantsLayer.remove();
        shoppingLayer.remove();

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
                // При пошуку збігованих міток встановлюємо червону іконку
                obj.marker.setIcon(redIcon);
                obj.marker.openPopup();
                map.setView(obj.marker.getLatLng(), 15);
                found = true;
            } else {
                // Інші мітки відновлюємо до зеленої іконки
                obj.marker.setIcon(defaultIcon);
            }
        });

        if (!found) {
            alert("Місце не знайдено!");
        }
    });
});
