'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

app.get('/location', (req, res) =>{
  const geoData = require('./data/geo.json');
  const city = req.query.data;
  const locationData = new GeoLocation(city, geoData);
  res.send(locationData);

});
app.get('/weather', (req, res) => {
  // send the client next 8 days forecast
  let days = [];
  const weatherData = require('./data/darksky.json');
  console.log(weatherData);
  const city = req.query.data;
  console.log(days);
  for(let i = 0; i < 8; i++) {
    let time = weatherData.daily.data[i].time;
    let summary = weatherData.daily.data[i].summary;
    let newDay = new WeatherDay(city, summary, time);
    days.push(newDay);
  }
  res.send(days);
});




function WeatherDay (weatherData){
  this.forecast = weatherData.daily.date[i].time;
  this.time = (new Date (weather.daily.data[i].time).toString());
}


 function GeoLocation(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}



app.listen(PORT,() => console.log(`im alive on PORT, ${PORT}`));


