// Global variables
var apiKey = "1bb5db5b652ed01ed43e82a79df4ebd1";
var inputEl = $("#input");
var searchBtn = $("#btn");
var savedCities = $("#savedCities");

function oneCall(lat, lon) {
  var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
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
  });
}
function getWeather(searchedCity) {
  var currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&units=imperial&appid=${apiKey}`;
  $.get(currentWeatherApi, function (data) {
    console.log(data);
    var currentCity = data.name;
    var currentIcon = data.weather[0].icon;
    var currentTemp = data.main.temp;
    var currentWind = data.wind.speed;
    var currentHumidity = data.main.humidity;
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    oneCall(lat, lon);
    $("#city").text(currentCity);
    $("#mainIcon").attr(
      "src",
      `http://openweathermap.org/img/wn/${currentIcon}@2x.png`
    );
    $("#temp").text(currentTemp);
    $("#wind").text(currentWind);
    $("#humidity").text(currentHumidity);
  });
}

searchBtn.click(function () {
  var searchedCity = inputEl.val();
  getWeather(searchedCity);
});
