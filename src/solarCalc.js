'use strict';

// retreives code from Sun and Moon files
var Sun = require('./sun.js');
var Moon = require('./moon.js');

/**
  * constant that gives values for the degrees below horizion at
  * various times, to be used in various functions 
*/
const degreesBelowHorizon = {
  sunrise: 0.833,
  sunriseEnd: 0.3,
  twilight: 6,
  nauticalTwilight: 12,
  night: 18,
  goldenHour: -6
};

/** constructs an instance of the SolarCalc class, uses code from
  * moon.js and sun.js files 
  * @constructor SolarCalc
  * see sun.js and moon.js files for more information
*/
class SolarCalc {
    
/**
 * @param date
 * @param latitude
 * @param longitude
 */
  constructor(date, latitude, longitude) {
    this.date = date;
    this.lat = latitude;
    this.longitude = longitude;

    this.sun = new Sun(date, latitude, longitude);
    this.moon = new Moon(date, latitude, longitude);
  }

  get solarNoon() {
    return this.sun.solarNoon;
  }

  get sunrise() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise, true);
  }

  get sunset() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise);
  }

  get sunriseEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, true);
  }

  get sunsetStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, false);
  }

  get civilDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, true);
  }

  get dawn() {
    return this.civilDawn;
  }

  get civilDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, false);
  }

  get dusk() {
    return this.civilDusk;
  }

  get nauticalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, true);
  }

  get nauticalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, false);
  }

  get nightStart() {
    return this.astronomicalDusk;
  }

  get astronomicalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, false);
  }

  get astronomicalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, true);
  }

  get nightEnd() {
    return this.astronomicalDawn;
  }

  get goldenHourStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, false);
  }

  get goldenHourEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, true);
  }

  get lunarDistance() {
    return this.moon.distance;
  }

  get lunarIlluminosity() {
    return this.moon.illuminosity;
  }
}

// exports the SolarCalc object
module.exports = SolarCalc;
