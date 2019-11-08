'use strict';

require('dotenv').config();

//App dependencies
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');

//Initalizers
const PORT = process.env.PORT || 5200;
const app = express();
app.use(cors());


app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailsHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);

function locationHandler(request, response){
  //Get real data from real API
  // let rawData = require('./data/geo.json');
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(url)
    .then(data => {
      let location = new Location(request.query.data, data.body);
      response.status(200).json(location);
      console.log('Location!!!!!', response.status(200).json(location));
    })
    .catch(error => errorHandler(error, request, response));

}

function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.results[0].formatted_address;
  this.latitude = locationData.results[0].geometry.location.lat;
  this.longitude = locationData.results[0].geometry.location.lng;
}

function weatherHandler(req, res){

  console.log('i got this far');

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${req.query.data.latitude},${req.query.data.longitude}`;
  console.log(req.query.longitude);
  console.log(req.query.data.latitude);
  superagent.get(url)

    .then( weatherData => {
      const weatherSummaries = [];
      weatherData.body.daily.data.forEach( (day) => {
        weatherSummaries.push(new Weather(day) );
      });

      res.status(200).json(weatherSummaries);
    })
    .catch(error => errorHandler(error, req, res));
}

function trailsHandler (req, res) {
  console.log('req.query', req.query);
  const url = `https://www.hikingproject.com/data/get-trails?lat=${req.query.data.latitude}&lon=${req.query.data.longitude}&maxDistance=20&key=${process.env.TRAIL_API_KEY}`;
  console.log(req.query, 'REQ.query');
  superagent.get(url)

    .then(data => {
      console.log('data', data.body.trails);
      let trailsData = data.body.trails;
      let trails = trailsData.map(value => {
        console.log(value);
        return new TrailsObj(value);
      });
      console.log('trails', trails);
      res.status(200).json(trails);
    })
    .catch(error => errorHandler(error, req, res));
}
function formatDateTime(string){
  let date =new Date(string);
  return date.toString();
}
function TrailsObj (trails) {
  this.name = trails.name;
  this.location = trails.location;
  this.length = trails.length;
  this.stars = trails.stars;
  this.star_votes = trails.star_votes;
  this.summary = trails.summary;
  this.trail_url = trails.url;
  this.conditions = trails.conditionStatus;
  this.condition_date = formatDateTime(trails.conditionDate).slice(0,15);
  this.condition_time = formatDateTime(trails.conditionDate).slice(17);
}

function Event(data){
  this.name = data.name;
}
function Weather(day){
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}

function notFoundHandler(request, response){
  response.status(404).send('Not Found');
}

function errorHandler(error, request, response){
  response.status(500).send(error);
}

app.use(express.static('./public'));

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
