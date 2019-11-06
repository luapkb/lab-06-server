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

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventBrightHandler);
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
    })
    .catch(error => errorHandler(error, request, response));

}

function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.results[0].formatted_address;
  this.latitude = locationData.results[0].geometry.location.lat;
  this.longitude = locationData.results[0].geometry.location.lng;
}

function weatherHandler(request, response){

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;

  superagent.get(url)
    .then( weatherData => {
      const weatherSummaries = [];
      weatherData.body.daily.data.forEach( (day) => {
        weatherSummaries.push(new Weather(day) );
      });

      response.status(200).json(weatherSummaries);
    })
    .catch(error => errorHandler(error, request, response));
}

function eventBrightHandler (req, res){
  console.log(', im working  ');
  const url = `https://www.eventbriteapi.com/v3/users/me/${req.query.data.latitude}, ${req.query.data.longitude}?token=${process.env.EVENTBRITE_API_KEY}`;

  superagent.get(url)
    .set({'authorization': `bearer ${process.env.EVENBRITE_API_KEY}`,})
    .then( eventData => {
      const eventSummaries = [];
      eventData.body.daily.data.forEach( (day) =>{
        eventSummaries.push(new event(day));

      });
      console.log(eventSummaries, 'a string');
      res.status(200).json(eventSummaries);
    })
    .catch(error => errorHandler(error,req, res));
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
