'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

//Bring in modules
let handleWeather = require('./modules/weather.js');
let handleMovies = require('./modules/movies.js');

//Setup routes
app.get('/', (request, response) => response.status(200).send('This is the root. Nothing exciting here'));
app.get('/weather', handleWeather);
app.get('/weather', (request, response) => response.status(200).send('Weather is Working!'));
app.get('/movies', handleMovies);




//If no routes match
app.get('*',(request,response) => {
  response.status(500).send ('Page Not Found. Try something else.');
});


//Check if the port is listening
app.listen(PORT, () => console.log('Listening on Port', PORT));
