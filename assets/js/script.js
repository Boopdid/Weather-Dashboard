// Global variables
var apiKey = "1bb5db5b652ed01ed43e82a79df4ebd1";
var inputEl = $("#input");
var searchBtn = $("#btn");
var savedCities = $("#savedCities");

function getSavedCities() {
  var storedSavedCityNames = localStorage.getItem("savedCityNames");
  var savedCityNames = [];
  if (storedSavedCityNames) {
    savedCityNames = JSON.parse(storedSavedCityNames);
  }
  return savedCityNames;
}

function saveCityName(cityName) {
  var savedCityNames = getSavedCities();
  // console.log("Saved Park Names: ", savedCityNames);
  var alreadySaved = savedCityNames.includes(cityName);
  if (!alreadySaved) {
    savedCityNames = savedCityNames.concat(cityName);
    localStorage.setItem("savedCityNames", JSON.stringify(savedCityNames));
  }
}

function populateSavedContent() {
  var savedCityNames = getSavedCities();
  if (savedCityNames.length !== 0) {
    $("#savedCities").empty();
    savedCityNames.forEach(function (cityName) {
      var cityBtn = $("<button>");
      cityBtn.text(cityName);
      cityBtn.attr("id", cityName);
      cityBtn.addClass("button is-fullwidth m-1");
      cityBtn.addClass("wrapButtonText");
      cityBtn.addClass("savedSearch");
      $("#savedCities").append(cityBtn);
    });
  }
  $(".savedSearch").on("click", savedCitySearch);
}

function fiveDayFunction(fiveDayForecast) {
  for (let i = 0; i < fiveDayForecast.length; i++) {
    var data = fiveDayForecast[i];
    var date = moment.unix(data.dt).format("MM/DD/YYYY");
    var icon = data.weather[0].icon;
    var dayTemp = data.temp.max;
    var dayWind = data.wind_speed;
    var dayHumidity = data.humidity;
    $(`#day${i + 1}`).text(date);
    $(`#icon${i + 1}`).attr(
      "src",
      `http://openweathermap.org/img/wn/${icon}.png`
    );
    $(`#temp${i + 1}`).text(dayTemp);
    $(`#wind${i + 1}`).text(dayWind);
    $(`#humidity${i + 1}`).text(dayHumidity);
  }
}
function oneCall(lat, lon) {
  var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  $.get(oneCallApi, function (data) {
    console.log(data);
    var uvIndex = data.current.uvi;
    $("#uvIndex").text(uvIndex);
    if (uvIndex < 3) {
      $("#uvIndex").attr("class", "minDanger");
    } else if (uvIndex < 6) {
      $("#uvIndex").attr("class", "lowRisk");
    } else if (uvIndex < 11) {
      $("#uvIndex").attr("class", "highRisk");
    } else {
      $("#uvIndex").attr("class", "vhighRisk");
    }
    var dailyforecast = data.daily.slice(1, 6);
    console.log(dailyforecast);
    fiveDayFunction(dailyforecast);
  });
}
function getWeather(searchedCity) {
  var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=imperial&appid=${apiKey}`;
  $.get(currentWeatherApi, function (data) {
    console.log(data);
    var currentCity = data.name;
    var currentDate = moment().format("(MM/DD/YYYY)");
    var currentIcon = data.weather[0].icon;
    var currentTemp = data.main.temp;
    var currentWind = data.wind.speed;
    var currentHumidity = data.main.humidity;
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    oneCall(lat, lon);
    $("#city").text(currentCity);
    $("#currentDate").text(currentDate);
    $("#mainIcon").attr(
      "src",
      `http://openweathermap.org/img/wn/${currentIcon}@2x.png`
    );
    $("#temp").text(currentTemp);
    $("#wind").text(currentWind);
    $("#humidity").text(currentHumidity);
    saveCityName(currentCity);
    populateSavedContent();
  });
}

function savedCitySearch(event) {
  event.preventDefault();
  chosenCity = event.target.innerText;
  getWeather(chosenCity);
}

searchBtn.click(function () {
  var searchedCity = inputEl.val();
  getWeather(searchedCity);
});

populateSavedContent();
