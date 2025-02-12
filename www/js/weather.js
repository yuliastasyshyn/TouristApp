const apiKey = '9965063d7a284b34b73752ef09036b05'; 
const city = 'Lviv';
const url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;

async function getWeather() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Не вдалося отримати дані');
        const data = await response.json();
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = '';

        data.list.slice(0, 8).forEach((forecast) => {
            const time = new Date(forecast.dt * 1000); 
            const hours = time.getHours();
            const temp = forecast.main.temp; 
            const icon = forecast.weather[0].icon; 
            const description = forecast.weather[0].description; 

            const hourDiv = document.createElement('div');
            hourDiv.classList.add('hour');
            hourDiv.innerHTML = `
                <h3>${hours}:00</h3>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" />
                <p><strong>${temp.toFixed(1)}°C</strong></p>
                <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            `;
           
            weatherDiv.appendChild(hourDiv);
        });
    } catch (error) {
        console.error('Помилка завантаження погоди:', error);
        const weatherDiv = document.getElementById('weather');
        weatherDiv.innerHTML = '<p>Не вдалося отримати дані про погоду. Перевірте API-ключ.</p>';
    }
}

getWeather();
