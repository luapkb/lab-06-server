'use strict';

const express = require('express');
// const dotenv = require('dotenv');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT ||5500;

app.get('/add-a-page', (req, res) =>{
  const geoData = req('.data/geo.json');
});

// function GeoLocation(city, geoData){
//   this.GeoLocation;
//   this.;
//   this.;
//   }

app.listen(PORT,() => console.log(`im alive on PORT, ${PORT}`));

  