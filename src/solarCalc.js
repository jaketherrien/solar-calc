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
/**
 * @return solarNoon
 */
  get solarNoon() {
    return this.sun.solarNoon;
  }
/**
 * @return sunrise time
 */
  get sunrise() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise, true);
  }
/**
 * @return sunset time
 */
  get sunset() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise);
  }
/**
 * @return sunrise end time
 */
  get sunriseEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, true);
  }
/**
 * @return sunset start time
 */
  get sunsetStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, false);
  }
/**
 * @return civil dawn time
 */
  get civilDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, true);
  }
/**
 * @return dawn
 */
  get dawn() {
    return this.civilDawn;
  }
/**
 * @return civil dusk time
 */
  get civilDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, false);
  }
/**
 * @return civil dusk
 */
  get dusk() {
    return this.civilDusk;
  }
/**
 * @return nautical dawn time
 */
  get nauticalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, true);
  }
/**
 * @return nautical dusk time
 */
  get nauticalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, false);
  }
/**
 * @return start of night
 */
  get nightStart() {
    return this.astronomicalDusk;
  }
/**
 * @return night time
 */
  get astronomicalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, false);
  }
/**
 * @return astronomical dawn time
 */
  get astronomicalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, true);
  }
/**
 * @return night end
 */
  get nightEnd() {
    return this.astronomicalDawn;
  }
/**
 * @return golden hour start time
 */
  get goldenHourStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, false);
  }
/**
 * @return golden hour end time
 */
  get goldenHourEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, true);
  }
/**
 * @return distance from moon
 */
  get lunarDistance() {
    return this.moon.distance;
  }
/**
 * @return illuminosity of moon
 */
  get lunarIlluminosity() {
    return this.moon.illuminosity;
  }
}

// exports the SolarCalc object
module.exports = SolarCalc;
