var citySearchEl = $('#city-search-form');
var cityNameEl = $('#city-name');

var citySearchHandler = function(event) {
  event.preventDefault();

  // get cityName from input element
  var cityName = $("input:text").val()

  console.log("cityName ********************** ", cityName);

  // if we have a city name, get lat/long, else error
  if (cityName) {

    getCityLatLong(cityName);

    // clear old content
    //cityContainerEl.textContent = '';
    cityNameEl.val('');
  } else {
    alert('Please enter a city name');
    return;
  }
};

var getCityLatLong = function(cityName) {

  console.log("in getCityLatLong ********************** ", cityName);
  // format the github api url
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=d89a7998c295640400d389063c3b71e9';

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        
        response.json().then(function(data) {
          console.log("*******************************  data= ", data);
          console.log("*******************************  lat= ", data[0].lat);
          console.log("*******************************  lon= ", data[0].lon, data[0].name, data[0].state);
          
          //getWeather(data);

        });
      } else {
        alert('Error: Total Bummer');
      }
    })
    .catch(function(error) {
      alert('Unable to connect to OpenWeatherAPI');
    });
};

citySearchEl.on('submit', citySearchHandler);