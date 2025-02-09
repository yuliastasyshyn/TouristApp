// Функція для навігації по сторінках
function navigateTo(page) {
    window.location.href = page;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Визначення стандартного маркера та червоного маркера
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
  
    // Створення карти з центром у Львові
    var map = L.map("map").setView([49.8397, 24.0297], 13);
  
    // Додавання плиток OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
  
    // Масив з визначними місцями Львова
    var landmarks = [
      { name: "Lviv Opera House", coords: [49.8440, 24.0266] },
      { name: "High Castle", coords: [49.8506, 24.0399] },
      { name: "Rynok Square", coords: [49.8414, 24.0316] },
      { name: "St. George's Cathedral", coords: [49.8365, 24.0180] },
      { name: "Lychakiv Cemetery", coords: [49.8368, 24.0550] },
      { name: "Armenian Cathedral", coords: [49.8438, 24.0315] },
      { name: "Potocki Palace", coords: [49.8393, 24.0256] },
    ];
  
    // Створення маркерів і збереження їх для подальшого пошуку
    var markerObjects = [];
    landmarks.forEach(function (place) {
      var marker = L.marker(place.coords, { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`<b>${place.name}</b>`);
      markerObjects.push({ name: place.name.toLowerCase(), marker: marker });
    });
  
    // Обробник кліку на кнопку пошуку
    document.getElementById("search-btn").addEventListener("click", function () {
      var searchText = document.getElementById("search").value.toLowerCase().trim();
  
      if (!searchText) {
        alert("Please enter search text.");
        return;
      }
  
      var found = false;
      // Перевірка кожного маркера на співпадіння з текстом пошуку
      markerObjects.forEach(function (obj) {
        if (obj.name.indexOf(searchText) !== -1) {
          // Якщо співпадіння знайдено — змінити значок на червоний та відкрити спливаюче вікно
          obj.marker.setIcon(redIcon);
          obj.marker.openPopup();
          found = true;
        } else {
          // Інші маркери повернути до стандартного значка
          obj.marker.setIcon(defaultIcon);
        }
      });
  
      if (!found) {
        alert("No landmarks found matching: " + searchText);
      }
    });
  });
  