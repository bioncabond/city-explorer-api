'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
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
  response.status(404).send ('Page Not Found. Try something else.');
});

function handleWeather(request, response) {
  console.log('query params:' , request.query);
  let { lat, lon, searchQuery } = request.query;
  //   response.status(200).send('handleWeather is working!');

  //Find the City to pull the lat & lon
  let foundCity = weather.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

  console.log('foundCity:', foundCity);
  //   response.status(200).send('found city', foundCity.data);

  try{
    const weatherArray = foundCity.data.map((day) => new Forecast(day));
    console.log(weatherArray);
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