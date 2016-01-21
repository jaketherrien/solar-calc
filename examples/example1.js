'use strict';

var app = require('/Users/jaketherrien/Documents/SOPHOMORE_YEAR/INFO_498/Code/solar-calc/src/solarCalc.js');
var app2 = require('/Users/jaketherrien/Documents/SOPHOMORE_YEAR/INFO_498/Code/solar-calc/src/moon.js');
var app3 = require('/Users/jaketherrien/Documents/SOPHOMORE_YEAR/INFO_498/Code/solar-calc/src/sun.js'); // require module

// new solarCalc using lat/long of Seattle
var solarCalc = new SolarCalc (new Date('Jan 20 2016'), 47.61, -122.33);

//picked 3 functions since there are so many, hw description said 2-3 functions
//logs solarNoon time for Seattle today
console.log(solarCalc.solarNoon.getTime());
console.log(solarCalc.sunrise.getTime());
console.log(solarCalc.sunset.getTime());



