const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFound = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-city");
const tempTXT = document.querySelector(".temp-txt");
const countryTxT = document.querySelector(".country-txt");
const conditionTXT = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherInfo = document.querySelector(".Weather-info");
const weatherSummaryimg = document.querySelector(".weather-summary-img");
const currentDataTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

const ApiKey = "87d8f05848224999cfb294232abab674";

//Listener for Click => searchbtn
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

//Listener for Enter =>input city
cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

//function to get data (API OpenWeather)
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${ApiKey}&units=metric`;

  const response = await fetch(apiUrl);
  return response.json();
}
function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 231) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options);
}
//update Weather info
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFound);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxT.textContent = country;
  tempTXT.textContent = Math.round(temp) + " °C";
  conditionTXT.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";

  currentDataTxt.textContent = getCurrentDate();

  weatherSummaryimg.src = `assets/weather/${getWeatherIcon(id)}`;
  await updateForcastsInfo(city);
  showDisplaySection(weatherInfo);
}

async function updateForcastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForcastsItems(forecastWeather);
    }
  });
}

function updateForcastsItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;
  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);
  const forecastItem = `   <div class="forecast-item">
                <h5 class="forecast-item-date regular txt">${dateResult}</h5>
                <img src="assets/weather/${getWeatherIcon(
                  id
                )}" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}
function showDisplaySection(section) {
  const sections = [weatherInfo, searchCity, notFound];
  sections.forEach((sec) => (sec.style.display = "none"));
  section.style.display = "flex";
}
