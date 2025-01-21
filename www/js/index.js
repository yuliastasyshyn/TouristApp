document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');


    var map = L.map('map').setView([49.8383, 24.0232], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([49.8383, 24.0232]).addTo(map)
        .bindPopup('Ласкаво просимо до Львова!')
        .openPopup();
}

document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = 'register.html';
});

document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = 'login.html';
});

document.getElementById('continueBtn').addEventListener('click', function() {
    alert('Продовжуємо без реєстрації');
    window.location.href = 'map.html';
});

document.getElementById('mapBtn').addEventListener('click', function() {
    window.location.href = 'map.html';
});

function handleClick(buttonName) {
    alert(`Ви натиснули: ${buttonName}`);
}
