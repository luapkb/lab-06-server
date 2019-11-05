'use strict';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

app.get('/location', (req, res) =>{
  const geoData = req('.data/geo.json');
res.send(geoData.results.geometry)
});


// function GeoLocation(city, geoData){
//   this.GeoLocation;
//   this.;
//   this.;
//   }

app.listen(PORT,() => console.log(`im alive on PORT, ${PORT}`));


