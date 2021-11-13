//global variables
//const userApiKey = document.querySelector('#userId').value
let generateButton = document.getElementById('generate');
let dFragment = new Date;
let dateTime = `${dFragment.getDate()}/${dFragment.getMonth()+1}/${dFragment.getFullYear()}`;

//MAIN FUNTION
generateButton.addEventListener('click', async () => {
    let city = document.getElementById('cityInput').value;
    if(city === false) {
        return alert('Please Enter A city name')
    } else {
        getAndSaveData(city)
        .then(() => {
            getBackAndUpdate();
        })
        .catch((error) => {
            console.log(`An Error Was Caught: ${error}`);
        })
    }
});

//FIRST SUB FUNCTION
//get weather temp data from external API
let getAndSaveData = async (city) => {
    //Get weather data from the external API
    const userApiKey = document.querySelector('#api').value
    let mainUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${userApiKey}&units=metric`;
    let res = await fetch(mainUrl);
    //extracting Tempreature from the weather data coming from the extrenal weather API
    let parsedWeatherData = await res.json();
    console.log(parsedWeatherData);
    let feelsLike = parsedWeatherData.main.feels_like
    let humidity = parsedWeatherData.main.humidity
    let tempMax = parsedWeatherData.main.temp_max
    let tempMin = parsedWeatherData.main.temp_min
    let country = parsedWeatherData.sys.country;
    let weather = parsedWeatherData.weather[0].main;
    let weatherDet = parsedWeatherData.weather[0].description;
    //requesting a POST request to the server to save the data
    //object containg data requested to save in the server
    let dataSent = {
        date: dateTime,
        country,
        city,
        feelsLike,
        humidity,
        tempMax,
        tempMin,
        weather,
        weatherDet
    };
    await fetch('/saveWeatherClientData', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(dataSent)
    });

}

//SECOND SUB FUNCTION
let getBackAndUpdate = async () => {
    //requesting a GET request from the server to retrive the data sent before again!
    let fetchToGet = await fetch ('/getWeatherClientData');
    let finalDataRetrived =  await fetchToGet.json();
    console.log(finalDataRetrived);
    //updating the ui with the data reterived from the server
    document.getElementById('weatherData').style.cssText = 'display: block';

    document.getElementById('date').innerHTML = `<b>Date:</b>${finalDataRetrived.date}`;
    document.getElementById('country').innerHTML = `<b>Country:</b> ${finalDataRetrived.country}`;
    document.getElementById('city').innerHTML = `<b>City:</b> ${finalDataRetrived.city}`;
    document.getElementById('humidity').innerHTML = `<b>Humidity:</b> ${finalDataRetrived.humidity}`;
    document.getElementById('feelsLike').innerHTML = `<b>Feels like:</b> ${finalDataRetrived.feelsLike}`;
    document.getElementById('maxTemp').innerHTML = `<b>Max Temp:</b> ${finalDataRetrived.maxTemp}`;
    document.getElementById('minTemp').innerHTML = `<b>Min Temp:</b> ${finalDataRetrived.minTemp}`;
    document.getElementById('weather').innerHTML = `<b>Weather:</b> ${finalDataRetrived.weather}`;
    document.getElementById('weatherDet').innerHTML = `<b>Details:</b> ${finalDataRetrived.weatherDet}`;
};
