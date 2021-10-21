'use strict';
const axios = require('axios');
let cache = require('./Cache.js');


async function handleMovies(request,response){

  let { cityName } = request.query;
  let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;
  //   let movieURL = `https://api.themoviedb.org/3/search/company?api_key=8eae4e8ad57a8c6bc82691f8d0dce20d&query=seattle`;

  if (cache[cityName] &&
    Date.now() - cache[cityName].timestamp < 1000 * 60 * 2) {
    response.status(200).send(cache[cityName].movieList);
    console.log(cache, 'Cache Hit!');
  }

  else{
    try {
      let movieData = await axios.get(movieURL);
      console.log(movieData.data);
      const moviesArray = movieData.data.results.map((movieList) => new Movies(movieList));

      cache[cityName] = {
        movieList: moviesArray,
        timestamp: Date.now()
      };
      console.log('Cache Miss!');
      response.status(200).send(moviesArray);
    }
    catch (error){
      response.status(404).send('Cant find that Movie');
    }

  }
}
class Movies {
  constructor(movieList) {
    this.original_title = movieList.original_title;
    this.overview = movieList.overview;
    this.vote_average = movieList.vote_average;
    this.vote_count = movieList.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/original' + movieList.poster_path;
    this.popularity = movieList.popularity;
    this.release_date = movieList.release_date;
  }
}

module.exports = handleMovies;
