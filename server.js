'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

app.get('/location', (req, res) =>{
  const geoData = require('./data/geo.json');
  console.log (geoData);
  const city = req.query.data;
  console.log(city);
  const locationData = new GeoLocation(city, geoData);
  console.log(locationData);
  res.send(locationData);

});


 function GeoLocation(city, geoData){
  this.search_query = city; 
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}



app.listen(PORT,() => console.log(`im alive on PORT, ${PORT}`));


