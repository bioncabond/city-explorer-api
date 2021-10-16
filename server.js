'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require ('axios');

const weather = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

//Setup routes
app.get('/', (request, response) => response.status(200).send('This is the root. Nothing exciting here'));
app.get('/weather', handleWeather);
app.get('/weather', (request, response) => response.status(200).send('Weather is Working!'));




//If no routes match
app.get('*',(request,response) => {
  response.status(500).send ('Page Not Found. Try something else.');
});

async function handleWeather(request, response) {
  console.log('query params:' , request.query);
  let { lat, lon } = request.query;
  //   TEST: response.status(200).send('handleWeather is working!');

  let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&key=${process.env.WEATHER_API_KEY}`;
  //   let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=35.91&lon=31.95&days=3&key=25f65879afd747adbf7001ea154fe344`;


  // console.log('foundCity:', foundCity);
  // TEST: response.status(200).send('found city', foundCity.data);

  try{
    let weatherData = await axios.get(weatherURL);
    const weatherArray = weatherData.data.data.map((day) => new Forecast(day));
    response.status(200).send(weatherArray);

  }
  catch(error){
    console.log('cant find it');
    response.status(404).send('Cant find that City');
  }

//   response.status(200).send('Weather here');
}


class Forecast {
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp}, with ${day.weather.description}`;
  }
}

//Check if the port is listening
app.listen(PORT, () => console.log('Listening on Port', PORT));