//global variables
//const userApiKey = document.querySelector('#userId').value
let generateButton = document.getElementById('generate');
let dFragment = new Date;
let dateTime = `${dFragment.getDate()}/${dFragment.getMonth()+1}/${dFragment.getFullYear()}`;

//MAIN FUNTION
generateButton.addEventListener('click', async () => {
    let cityName = document.getElementById('cityName').value;
    if(cityName === false) {
        return alert('Please Enter A Valid Zip Code')
    } else {
        getAndSaveData(cityName)
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
let getAndSaveData = async (cityName) => {
    //Get weather data from the external API
    const userApiKey = document.querySelector('#userId').value
    let mainUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${userApiKey}&units=metric`;
    let res = await fetch(mainUrl);
    //extracting Tempreature from the weather data coming from the extrenal weather API
    let parsedWeatherData = await res.json();
    console.log(parsedWeatherData);
    let requestedMaxTemp = `${parsedWeatherData.main.temp_max} C`;
    let requestedMinTemp = `${parsedWeatherData.main.temp_min} C`;
    let requestedcountry = `${parsedWeatherData.sys.country}`;
    //requesting a POST request to the server to save the data
    let userFeelings = document.getElementById('feelings').value
    //object containg data requested to save in the server
    let dataSent = {
        date: dateTime,
        maxTemp: requestedMaxTemp,
        minTemp: requestedMinTemp,
        country: requestedcountry,
        city: cityName,
        content: userFeelings
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
    document.getElementById('title').style.cssText = 'display: block';
    document.getElementById('date').innerHTML = `<b>Date:</b>${finalDataRetrived.date}`;
    document.getElementById('minTemp').innerHTML = `<b>Min Temp:</b> ${finalDataRetrived.minTemp}`;
    document.getElementById('maxTemp').innerHTML = `<b>Max Temp:</b> ${finalDataRetrived.maxTemp}`;
    document.getElementById('country').innerHTML = `<b>Country:</b> ${finalDataRetrived.country}`;
    document.getElementById('city').innerHTML = `<b>City:</b> ${finalDataRetrived.city}`;
    document.getElementById('content').innerHTML = `<b>content:</b> ${finalDataRetrived.content}`;
};
