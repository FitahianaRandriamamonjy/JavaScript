const body = document.querySelector("body");
const loader = document.querySelector(".loader-container");
const errorInformation = document.querySelector(".error-information");

async function getWeatherData() {
  try {
    const response = await fetch(
      "http://api.airvisual.com/v2/nearest_city?key=c5a9ec94-1c47-4ed9-8c0c-74f0822bb1ef",
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    const responseData = await response.json();

    const sortedData = {
      city: responseData.data.city,
      country: responseData.data.country,
      iconId: responseData.data.current.weather.ic,
      temperature: responseData.data.current.weather.tp,
      humidity: responseData.data.current.weather.hu,
      windSpeed: responseData.data.current.weather.ws,
    };

    populateUI(sortedData);
    loader.classList.remove("active");
  } catch (error) {
    loader.classList.remove("active");
    errorInformation.textContent = error.message;
  }
}
getWeatherData();

const cityName = document.querySelector(".city-name");
const countryName = document.querySelector(".country-name");
const temperature = document.querySelector(".temperature");
const infoIcon = document.querySelector(".info-icon");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");

function populateUI(data) {
  body.style.backgroundColor = "#1f3a93";
  body.style.display = "flex";
  body.style.justifyContent = "center";
  body.style.alignItems = "center";
  body.style.height = "100vh";
  body.style.margin = "0";

  cityName.textContent = data.city;
  countryName.textContent = data.country;
  temperature.textContent = `${data.temperature}°`;
  infoIcon.src = `ressources/icons/${data.iconId}.svg`;
  infoIcon.style.width = "150px";
  if (humidity) humidity.textContent = `Humidité : ${data.humidity}%`;
  if (windSpeed) windSpeed.textContent = `Vent : ${data.windSpeed} m/s`;

  loader.classList.remove("active");
}
