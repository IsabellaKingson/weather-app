// Global variables to reference HTML
const searchBtn = document.getElementById("search-button");
const currentTitle = document.getElementById("current-title");
const currentWeather = document.getElementById("current-weather");
const dailyForecast = document.getElementById("5-day-forecast");
const searchHistory = document.getElementById("search-history");
let historyObj = {};
function getForecast(cityName) {
  // Add city name to local storage
  historyObj[cityName] = cityName;
  localStorage.setItem('historyObj', JSON.stringify(historyObj));
  // Take city name from input or search history and get the geocode
  let cityInfoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=274d0f6297d38202f126189dee0ef293";
  fetch(cityInfoUrl)
    .then(function (response) {
      // Turn the geocode response into json
      return response.json();
    })
    .then(function (data) {
      // Get the longitude and latitude values and insert them into the request URL
      let lat = data[0].lat;
      let lon = data[0].lon;
      let requestForecastUrl =
        "https://api.openweathermap.org/data/3.0/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=274d0f6297d38202f126189dee0ef293&units=imperial";
      fetch(requestForecastUrl)
        .then(function (response) {
          // Turn forcast response into json
          return response.json();
        })
        .then(function (data) {
          // Run functions to append data to page
          todaysWeather(data, cityName);
          dailyWeather(data);
        });
    });
}

const todaysWeather = function (data, cityName) {
  // Create elements to append todays weather information to
  let currentSearchTitle = document.createElement("h2");
  let currentImg = document.createElement("img");
  let currentConditions = document.createElement("p");
  let temp = document.createElement("p");
  let wind = document.createElement("p");
  let humidity = document.createElement("p");
  // Get data from request URL and store in variables
  let currentTemp = data.current.temp;
  let currentIcon =
    "https://openweathermap.org/img/wn/" +
    data.current.weather[0].icon +
    "@2x.png";
  let currentDate = data.current.dt;
  let currentWind = data.current.wind_speed;
  let currentHumidity = data.current.humidity;
  // Add data from variables to created elements
  currentImg.setAttribute("src", currentIcon);
  currentSearchTitle.textContent =
    cityName + " " + dayjs.unix(currentDate).format("MM/DD/YYYY");
  temp.textContent = "Temp: " + currentTemp + '°F';
  wind.textContent = "Wind: " + currentWind + ' MPH';
  humidity.textContent = "Humidity: " + currentHumidity + '%';
  currentConditions.append(temp, wind, humidity);
  currentSearchTitle.append(currentImg);
  currentTitle.append(currentSearchTitle);
  // Add elements to the page
  currentWeather.append(currentConditions);
  return;
};
const dailyWeather = function (data) {
  // Create cards for the next 5 days' weather data
  for (let i = 0; i < 5; i++) {
    // Create elements to append the 5-day forecast data to
    let forecastCard = document.createElement("div");
    let dateEl = document.createElement("h4");
    let iconEl = document.createElement("img");
    let tempEl = document.createElement("p");
    let windEl = document.createElement("p");
    let humidityEl = document.createElement("p");
    // Get data from request URL and store in variables
    let dateInfo = data.daily[i].dt;
    let iconInfo =
      "https://openweathermap.org/img/wn/" +
      data.daily[i].weather[0].icon +
      "@2x.png";
    let tempInfo = data.daily[i].temp.day;
    let windInfo = data.daily[i].wind_speed;
    let humidityInfo = data.daily[i].humidity;
    // Add data from variables to created elements
    dateEl.textContent = dayjs.unix(dateInfo).format("MM/DD/YYYY");
    iconEl.setAttribute("src", iconInfo);
    tempEl.textContent = "Temp: " + tempInfo + "°F";
    windEl.textContent = "Wind: " + windInfo + ' MPH';
    humidityEl.textContent = "Humidity: " + humidityInfo + '%';
    forecastCard.append(dateEl, iconEl, tempEl, windEl, humidityEl);
    forecastCard.setAttribute('class', 'custom-card');
    // Add elements to the page
    dailyForecast.append(forecastCard);
  }
  return;
};
const printHistory = function () {
let history = JSON.parse(localStorage.getItem('historyObj'));
if (history !== null){
  for(const property in history) {
    let buttonEl = document.createElement('button');
    buttonEl.setAttribute('class', 'button');
    buttonEl.textContent = history[property];
    searchHistory.append(buttonEl);
  }
  return;
}
};
printHistory();
searchHistory.addEventListener('click', (event) => {
  let clicked = event.target;
  let cityName = clicked.textContent;
  getForecast(cityName);
})
searchBtn.addEventListener("click", () => {
  let cityInput = document.getElementById("city-input").value;
  getForecast(cityInput);
  document.getElementById('city-input').value = "";
});
