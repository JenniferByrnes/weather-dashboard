var citySearchEl = $('#city-search-form');
var cityNameEl = $('#city-name');
var formalCityName;

// Get the city info from local storage
var cityObjArray = JSON.parse(localStorage.getItem("cityInfo")) || [];

var cityButtonEl = document.querySelector('#city-buttons')

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
  var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=d89a7998c295640400d389063c3b71e9';

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
            
            // Add city button to search button list and get the weather
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

    var cityButton = $("<button class=btn></button>").text(cityName)
    $("#city-buttons").append(cityButton);   // Append new city button element
}

var getWeather = function(latitude, longitude) {
  // format the openwathermap api url
  //var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=d89a7998c295640400d389063c3b71e9';

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

            $("#city-date").html(formalCityName + " (" + initialDate.toDateString() + ")");

            // Get the icon
            var iconCode = data.current.weather[0].icon + "@2x";          
            var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";   
            $("#today-icon").html("<img class=icon-size src='" + iconUrl  + "'>");

            // Display the temp/wind/humidity
            $("#today-temperature").text("Temp: " + data.current.temp + "F");
            $("#today-winds").text("Winds: " + data.current.wind_speed + " MPH");
            $("#today-humidity").text("Humidity: " + data.current.humidity + " %");

            // Display the UV index with background color
            $("#today-uv-index").text("" + data.current.uvi );

            // clear any old color class
            $("#today-uv-index").removeClass();

            // get the correct color
            if (data.current.uvi <= 2) {
              $("#today-uv-index").addClass("uv-low");
            } else if (data.current.uvi <= 5) {
              $("#today-uv-index").addClass("uv-moderate");
            } else if (data.current.uvi <= 7) {
              $("#today-uv-index").addClass("uv-high");
            } else {
              $("#today-uv-index").addClass("uv-extreme");
            };

            // Load the 5 day forecast
            for (var i=1; i<6; i++) {
              // add a day
              const forecastDate = new Date();
              forecastDate.setDate(initialDate.getDate() + i);
              //$("#" + i).text(forecastDate.toDateString());
              $("[id="+i+"] [class=date]").text(forecastDate.toDateString());

              //this should have worked.....
              //var iconCode = data.daily[i].weather[0].id + data.daily[i].weather[0].icon;
              //this actually worked.......
              iconCode = data.daily[i].weather[0].icon + "@2x";
              var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
              $("[id="+i+"] [class=icon]").html("<img src='" + iconUrl  + "' class=icon-size>");

              // Display the remainder of the 5 day data
              $("[id="+i+"] [class=temp]").text("Temp: " + data.daily[i].temp.max + "F");
              $("[id="+i+"] [class=wind]").text("Winds: " + data.daily[i].wind_speed + " MPH");
              $("[id="+i+"] [class=humidity]").text("Humidity: " + data.daily[i].humidity + " %");
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

var buttonClickHandler = function(event){
  event.preventDefault();
  formalCityName = event.target.innerHTML;

  cityObjArray.forEach(function(placeHolder, arrayIndex) {
    // find the city to get the lat/long
    if (cityObjArray[arrayIndex].cityName === formalCityName) {
      getWeather(cityObjArray[arrayIndex].latitude, cityObjArray[arrayIndex].longitude);
    };
  });
}

citySearchEl.on('submit', citySearchHandler);
cityButtonEl.addEventListener("click", buttonClickHandler)

// Show movement on hover
$(cityButtonEl).hover(
  function() {
    $( this ).addClass( "hover" );
  }, function() {
    $( this ).removeClass( "hover" );
  }
);

// Change color on hover
$(citySearchEl).hover(
  function() {
    $( this ).addClass( "hover" );
  }, function() {
    $( this ).removeClass( "hover" );
  }
);

renderCitySelectors();