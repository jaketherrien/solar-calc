'use strict';
/* creates a  new instance of the sun class,
   @constructor
*/
class Sun {
  /** 
  *@param date
  *@param latitude
  *@param longitude
  */
  constructor(date, latitude, longitude) {
    this.date = date;
    this.latitude = latitude;
    this.longitude = longitude;
    
    // Julian-Date is date format used in astronomic calculations   
    this.julianDate = getJD(date);
  }
/**
 * gets the solarNoon value using the calcSolNoon function
 * @return solarNoon
 */
  get solarNoon() {
    return calcSolNoon(this.julianDate, this.longitude, this.date);
  }
/**
 * calculates the time using angle and rising
 * @return timeAt Angle
 */
  timeAtAngle(angle, rising) {
    return calcSunriseSet(rising, angle, this.julianDate, this.date, this.latitude, this.longitude);
  }
}
/**
 * formats the date
 * @param date
 * @param minutes
 * @return formattedDate
 */
var formatDate = function(date, minutes) {
  var seconds = (minutes - Math.floor(minutes)) * 60;
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, minutes, seconds));
};
/**
 * converts julian time to centuries
 * @return julianTimeCent
 */
function calcTimeJulianCent(jd) {
  var T = (jd - 2451545.0) / 36525.0;
  return T;
}
/**
 * tells whether or not the year is a leap year
 * @param year
 * @return {boolean} isLeapYear?
 */
function isLeapYear(yr) {
  return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
}

/**
 * calculates day of the year using the julian date
 * @param julianDate
 * @return dayOfYear
 */
function calcDoyFromJD(jd) {
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  var A;
  if (z < 2299161) {
    A = z;
  } else {
    var alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D) / 30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = (month > 2) ? C - 4716 : C - 4715;

  var k = (isLeapYear(year) ? 1 : 2);
  var doy = Math.floor((275 * month) / 9) - k * Math.floor((month + 9) / 12) + day - 30;
  return doy;
}

/**
 * converts angle from radians to degrees
 * @param angle
 * @return angleInRad
 */
function radToDeg(angleRad) {
  return (180.0 * angleRad / Math.PI);
}

/**
 * converts angle from degrees to radians
 * @param angle
 * @return angleInDeg
 */
function degToRad(angleDeg) {
  return (Math.PI * angleDeg / 180.0);
}
/**
 * calculates the geometric mean longitude of the sun
 * @param t, number of centuries since J2000.0
 * @return longitude
 */
function calcGeomMeanLongSun(t) {
  var L0 = 280.46646 + t * (36000.76983 + t * (0.0003032));
  while (L0 > 360.0) {
    L0 -= 360.0;
  }
  while (L0 < 0.0) {
    L0 += 360.0;
  }
  return L0; // in degrees
}
/**
 * calculates the geometric mean anomaly of the sun
 * @param t, number of centuries since J2000.0
 * @return longitude
 */
function calcGeomMeanAnomalySun(t) {
  var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  return M; // in degrees
}
/**
 * calculates the ecccentricity of earth's orbit
 * @param t, number of centuries since J2000.0
 * @return eccentricity
 */
function calcEccentricityEarthOrbit(t) {
  var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  return e; // unitless
}
/**
 * calculates the equation for the center of the sun
 * @param t, number of centuries since J2000.0
 * @return centerEq
 */
function calcSunEqOfCenter(t) {
  var m = calcGeomMeanAnomalySun(t);
  var mrad = degToRad(m);
  var sinm = Math.sin(mrad);
  var sin2m = Math.sin(mrad + mrad);
  var sin3m = Math.sin(mrad + mrad + mrad);
  var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
  return C; // in degrees
}
/**
 * calculates the true longitude of the sun
 * @param t, number of centuries since J2000.0
 * @return longitude
 */
function calcSunTrueLong(t) {
  var l0 = calcGeomMeanLongSun(t);
  var c = calcSunEqOfCenter(t);
  var O = l0 + c;
  return O; // in degrees
}
/**
 * calculates the apparent longitude of the sun
 * @param t, number of centuries since J2000.0
 * @return longitude
 */
function calcSunApparentLong(t) {
  var o = calcSunTrueLong(t);
  var omega = 125.04 - 1934.136 * t;
  var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
  return lambda; // in degrees
}
/**
 * calculates the mean obliquity of ecliptic
 * @param t, number of centuries since J2000.0
 * @return obliquity
 */
function calcMeanObliquityOfEcliptic(t) {
  var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
  var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
  return e0; // in degrees
}
/**
 * calculates the mean obliquity of ecliptic
 * @param t, number of centuries since J2000.0
 * @return obliquityCorrec
 */
function calcObliquityCorrection(t) {
  var e0 = calcMeanObliquityOfEcliptic(t);
  var omega = 125.04 - 1934.136 * t;
  var e = e0 + 0.00256 * Math.cos(degToRad(omega));
  return e; // in degrees
}
/**
 * calculates the declination of the sun
 * @param t, number of centuries since J2000.0
 * @return sunDeclination
 */
function calcSunDeclination(t) {
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);

  var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
  var theta = radToDeg(Math.asin(sint));
  return theta; // in degrees
}
/**
 * calculates the difference between true solar time and mean solar time
 * @param t, number of centuries since J2000.0
 * @return equation of time (minutes)
 */
function calcEquationOfTime(t) {
  var epsilon = calcObliquityCorrection(t);
  var l0 = calcGeomMeanLongSun(t);
  var e = calcEccentricityEarthOrbit(t);
  var m = calcGeomMeanAnomalySun(t);

  var y = Math.tan(degToRad(epsilon) / 2.0);
  y *= y;

  var sin2l0 = Math.sin(2.0 * degToRad(l0));
  var sinm = Math.sin(degToRad(m));
  var cos2l0 = Math.cos(2.0 * degToRad(l0));
  var sin4l0 = Math.sin(4.0 * degToRad(l0));
  var sin2m = Math.sin(2.0 * degToRad(m));

  var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
  return radToDeg(Etime) * 4.0; // in minutes of time
}
/**
 * calculates the hour angle of the sun at sunrise for given latitude
 * @param angle
 * @param latitude
 * @param solarDec
 * @return hourAngle
 */
function calcHourAngle(angle, lat, solarDec) {
  var latRad = degToRad(lat);
  var sdRad = degToRad(solarDec);
  var HAarg = (Math.cos(degToRad(90 + angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
  var HA = Math.acos(HAarg);
  return HA; // in radians (for sunset, use -HA)
}
/**
 * determines if the input is a number
 * @param inputValue
 * @return {boolean} isNumber
 */
function isNumber(inputVal) {
  var oneDecimal = false;
  var inputStr = '' + inputVal;
  for (var i = 0; i < inputStr.length; i++) {
    var oneChar = inputStr.charAt(i);
    if (i === 0 && (oneChar === '-' || oneChar === '+')) {
      continue;
    }
    if (oneChar === '.' && !oneDecimal) {
      oneDecimal = true;
      continue;
    }
    if (oneChar < '0' || oneChar > '9') {
      return false;
    }
  }
  return true;
}
/**
   uses built-in JavaScript functions to calculate Julian-Date
   @param date
   @return JD (Julian-Date)
*/
function getJD(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var A = Math.floor(year / 100);
  var B = 2 - A + Math.floor(A / 4);
  var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  return JD;
}
/**
 * calculates the solar noon at the given location on the given date
 * @param julian date
 * @param longitude
 * @param date
 * @return solNoon
 */
function calcSolNoon(jd, longitude, date) {
  var tnoon = calcTimeJulianCent(jd - longitude / 360.0);
  var eqTime = calcEquationOfTime(tnoon);
  var solNoonOffset = 720.0 - (longitude * 4) - eqTime; // in minutes
  var newt = calcTimeJulianCent(jd + solNoonOffset / 1440.0);
  eqTime = calcEquationOfTime(newt);
  var solNoonLocal = 720 - (longitude * 4) - eqTime; // in minutes
  while (solNoonLocal < 0.0) {
    solNoonLocal += 1440.0;
  }
  while (solNoonLocal >= 1440.0) {
    solNoonLocal -= 1440.0;
  }
  return formatDate(date, solNoonLocal);
  // return timeString(solNoonLocal, 3);
}
/**
 * converts the julian date into a date of next sunrise/sunset
 * @param julianDate
 * @return date
 */
function dayString(jd) {
  if ((jd < 900000) || (jd > 2817000)) {
    return 'error';
  } else {
    var z = Math.floor(jd + 0.5);
    var f = (jd + 0.5) - z;
    var A;
    if (z < 2299161) {
      A = z;
    } else {
      var alpha = Math.floor((z - 1867216.25) / 36524.25);
      A = z + 1 + alpha - Math.floor(alpha / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = ((month > 2) ? C - 4716 : C - 4715);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  }
}
/**
 * calculates the UTC formatted time for the sunrise of given date at given location
 * @param rise
 * @param angle
 * @param julian date
 * @param latitude
 * @param longitude
 * @return riseTime
 */
function calcSunriseSetUTC(rise, angle, JD, latitude, longitude) {
  var t = calcTimeJulianCent(JD);
  var eqTime = calcEquationOfTime(t);
  var solarDec = calcSunDeclination(t);
  var hourAngle = calcHourAngle(angle, latitude, solarDec);
  //alert("HA = " + radToDeg(hourAngle));
  if (!rise) hourAngle = -hourAngle;
  var delta = longitude + radToDeg(hourAngle);
  var timeUTC = 720 - (4.0 * delta) - eqTime; // in minutes
  return timeUTC;
}
/**
 * calculates the time for the sunrise of given date at given location
 * @param rise
 * @param angle
 * @param julian date
 * @param latitude
 * @param longitude
 * @return riseTime
 */
function calcSunriseSet(rise, angle, JD, date, latitude, longitude)
  // rise = 1 for sunrise, 0 for sunset
  {
    var timeUTC = calcSunriseSetUTC(rise, angle, JD, latitude, longitude);
    var newTimeUTC = calcSunriseSetUTC(rise, angle, JD + timeUTC / 1440.0, latitude, longitude);
    if (isNumber(newTimeUTC)) {

      return formatDate(date, newTimeUTC);

    } else { // no sunrise/set found
      var doy = calcDoyFromJD(JD);
      var jdy;
      if (((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
        ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) { //previous sunrise/next sunset
        jdy = calcJDofNextPrevRiseSet(!rise, rise, angle, JD, latitude, longitude);
        return dayString(jdy);
      } else { //previous sunset/next sunrise
        jdy = calcJDofNextPrevRiseSet(rise, rise, angle, JD, latitude, longitude);
        return dayString(jdy);
      }
    }
  }
/**
 * calculates the julianDay of next sunset
 * @param rise
 * @param angle
 * @param julian date
 * @param latitude
 * @param longitude
 * @return sunsetTime
 */
function calcJDofNextPrevRiseSet(next, rise, type, JD, latitude, longitude) {
  var julianday = JD;
  var increment = ((next) ? 1.0 : -1.0);

  var time = calcSunriseSetUTC(rise, type, julianday, latitude, longitude);
  while (!isNumber(time)) {
    julianday += increment;
    time = calcSunriseSetUTC(rise, type, julianday, latitude, longitude);
  }

  return julianday;
}
/**
 * exports the sun object
 */
module.exports = Sun;
