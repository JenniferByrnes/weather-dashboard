var citySearchEl = $('#city-search-form');
var cityNameEl = $('#city-name');
var formalCityName;

// Get the city info from local storage
var cityObjArray = JSON.parse(localStorage.getItem("cityInfo")) || [];

var renderCitySelectors = function() {
  cityObjArray.forEach(function(placeHolder, arrayIndex) {
    // Create button for city choices
    appendCity(cityObjArray[arrayIndex].cityName);
  })
}

var citySearchHandler = function(event) {
  event.preventDefault();

  // get cityName from input element
  var cityName = $("input:text").val();

  // if we have a city name, get lat/long, else error
  if (cityName) {
    getCityLatLong(cityName);
    // clear input field content
    cityNameEl.val('');
  } else {
    alert('Please enter a city name');
    return;
  }
};

var getCityLatLong = function(cityName) {

  // format the openwathermap api url
  var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=d89a7998c295640400d389063c3b71e9';

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        
        response.json().then(function(cityData) {
          console.log("*******************************  data= ", cityData);
          if (!cityData[0]) {
            // no data returned for cityName
            console.log("no data returned - invalid city????")
          } else {
            console.log("*******************************  lat= ", cityData[0].lat);
            console.log("*******************************  lon= ", cityData[0].lon);
            console.log("******************************* ", cityData[0].name, cityData[0].state);
            // Prepare object to push into array and make new selector button
            formalCityName = cityData[0].name
            const cityObj = {
              cityName: formalCityName,
              stateName: cityData[0].state,
              latitude: cityData[0].lat,
              longitude: cityData[0].lon
              }
            cityObjArray.push(cityObj);
            localStorage.setItem("cityInfo", JSON.stringify(cityObjArray));
            
            appendCity(cityObj.cityName);
            getWeather(cityObj.latitude, cityObj.longitude);
          }


        });
      } else {
        alert('Error: Total Bummer');
      }
    })
    .catch(function(error) {
      alert('Unable to connect to OpenWeatherAPI');
    });
};

var appendCity = function(cityName){
  console.log("in displayCityChoices()");
  console.log("*******************************2 cityName = ", cityName);
    var cityButton = $("<button class=btn></button>").text(cityName)
    $("#city-buttons").append(cityButton);   // Append new element
}
/************************************************/
var getWeather = function(latitude, longitude) {
  // format the openwathermap api url
  //var apiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=d89a7998c295640400d389063c3b71e9';

  var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&units=imperial&appid=d89a7998c295640400d389063c3b71e9';

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        
        response.json().then(function(data) {
          console.log("*******************************  data= ", data);
          if (!data.daily[0]) {
            // no data returned
            console.log("no data returned - invalid lat/lon????")
          } 
          else {

            // Load window for today's data
            const initialDate = new Date();
            console.log("*******************************4 initialDate = ", initialDate);
           // $(".subtitle")text=(data.city.name, data.list[0].dt_txt);
            $("#city-date").html(formalCityName + " (" + initialDate.toDateString() + ")");
            $("#today-temperature").text("Temp: " + data.current.temp + "F");
            $("#today-winds").text("Winds: " + data.current.wind_speed + " MPH");
            $("#today-humidity").text("Humidity: " + data.current.humidity + " %");
            $("#today-uv-index").text("UV Index: " + data.current.uvi);

            // Load the 5 day forecast
            for (var i=1; i<6; i++) {
              // add a day
              const forecastDate = new Date();
              forecastDate.setDate(initialDate.getDate() + i);
              //$("#" + i).text(forecastDate.toDateString());
              $("[id="+i+"] [class=date]").text(forecastDate.toDateString());
              $("[id="+i+"] [class=temp]").text("Temp: " + data.daily[i].temp.max + "F");
              $("[id="+i+"] [class=wind]").text("Winds: " + data.current.wind_speed + " MPH");
              $("[id="+i+"] [class=humidity]").text("Humidity: " + data.current.humidity + " %");


            }
          }


        });
      } else {
        alert('Error: Total Bummer');
      }
    })
    .catch(function(error) {
      alert('Unable to connect to OpenWeatherAPI');
    });
}

citySearchEl.on('submit', citySearchHandler);
renderCitySelectors();