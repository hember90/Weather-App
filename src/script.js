let now = new Date();
let h2 = document.querySelector("h2");
let date = now.getDate();
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
h2.innerHTML = `Last updated: ${day} ${date} ${month}, ${hours}:${minutes}.`;

let tempClickF = document.querySelector("#fahrenheit-link");
tempClickF.addEventListener("click", showTempF);

let tempClickC = document.querySelector("#celcius-link");
tempClickC.addEventListener("click", showTempC);

let units = "imperial";
let coordinates = null;

let form = document.querySelector("#citySearchForm");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSubmit);

search("New London"); //Displays default location

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", findCurrentLocation);

let apiKey = "a33b693cfbefd271b0ed075f9a8f65f0";

function showCurrentWeather(response) {
  document.querySelector("#currentTemp").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#feels").innerHTML =
    "Feels like: " + Math.round(response.data.main.feels_like) + "°";

  document.querySelector("#humidity").innerHTML =
    "Humidity: " + Math.round(response.data.main.humidity) + "%";

  document.querySelector("#wind").innerHTML =
    "Wind: " + Math.round(response.data.wind.speed) + " mph";

  document.querySelector("#currentWeather").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#citySearched").innerHTML = response.data.name;

  const regionNames = new Intl.DisplayNames(["en"], { type: "region" }); //gets country name from country code
  document.querySelector("#countrySearched").innerHTML = regionNames.of(
    response.data.sys.country
  );

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  coordinates = response.data.coord;

  getForecast();
}

function search(city) {
  let apiKey = "a33b693cfbefd271b0ed075f9a8f65f0";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(showCurrentWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

function showCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  searchLocation(latitude, longitude);
}

function searchLocation(latitude, longitude) {
  let apiKey = "a33b693cfbefd271b0ed075f9a8f65f0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function findCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

function showTempF(event) {
  event.preventDefault();
  tempClickC.classList.remove("active");
  tempClickF.classList.add("active");

  units = "imperial";
  searchLocation(coordinates.lat, coordinates.lon);
}

function showTempC(event) {
  event.preventDefault();
  tempClickF.classList.remove("active");
  tempClickC.classList.add("active");

  units = "metric";
  searchLocation(coordinates.lat, coordinates.lon);
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[day];
}

function getForecast() {
  let apiKey = "a33b693cfbefd271b0ed075f9a8f65f0";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row"><h5>Daily Forecast</h5>`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-sm-2">
            <div class="daily-forecast">${formatForecastDay(
              forecastDay.dt
            )}</div>
            <img src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" width="70" />
            <div class="forecast-temps">
              <span class="max-temp">${Math.round(forecastDay.temp.max)}°</span>
              <span class="min-temp">${Math.round(forecastDay.temp.min)}°</span>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
