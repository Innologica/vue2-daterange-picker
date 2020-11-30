/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
'use strict';
interface MasksI {
  'default': string;
  'shortDate': string;
  'mediumDate': string;
  'longDate': string;
  'fullDate': string;
  'shortTime': string;
  'mediumTime': string;
  'longTime': string;
  'isoDate': string;
  'isoTime': string;
  'isoDateTime': string;
  'isoUtcDateTime': string;
  'expiresHeaderFormat': string;
}

interface i18nI {
  dayNames: string[];
  monthNames: string[];
  timeNames: string[];
}



interface FlagsI {
  d: number;
  dd: string;
  ddd: string;
  dddd: string;
  m: number;
  mm: string;
  mmm: string;
  mmmm: string;
  yy: string;
  yyyy: number;
  h: number;
  hh: string;
  H: number;
  HH: string;
  M: number;
  MM: string;
  s: number;
  ss: string;
  l: string;
  L: string;
  t: string;
  tt: string;
  T: string;
  TT: string;
  o: string;
  W: number;
  N: number;
  Z: string;
  S: string;
}

const masks: MasksI = {
  'default': 'ddd mmm dd yyyy HH:MM:ss',
  'shortDate': 'm/d/yy',
  'mediumDate': 'mmm d, yyyy',
  'longDate': 'mmmm d, yyyy',
  'fullDate': 'dddd, mmmm d, yyyy',
  'shortTime': 'h:MM TT',
  'mediumTime': 'h:MM:ss TT',
  'longTime': 'h:MM:ss TT Z',
  'isoDate': 'yyyy-mm-dd',
  'isoTime': 'HH:MM:ss',
  'isoDateTime': 'yyyy-mm-dd\'T\'HH:MM:sso',
  'isoUtcDateTime': 'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
  'expiresHeaderFormat': 'ddd, dd mmm yyyy HH:MM:ss Z'
};

// Internationalization strings
const i18n: i18nI = {
  dayNames: [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  monthNames: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ],
  timeNames: [
    'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
  ]
};

interface dateFormatI {
  (date: Date | undefined, mask: string | Date, utc?: boolean, gmt?: boolean): string;
  i18n: i18nI;
  masks: MasksI;
}


function pad(val: string | number, len?: number) {
  val = String(val);
  len = len || 2;
  while (val.length < len) {
    val = '0' + val;
  }
  return val;
}

/**
 * Get the ISO 8601 week number
 * Based on comments from
 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getWeek(date: Date) {
  // Remove time components of date
  const targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Change date to Thursday same week
  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

  // Take January 4th as it is always in week 1 (see ISO 8601)
  const firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

  // Check if daylight-saving-time-switch occurred and correct for it
  const ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
  targetThursday.setHours(targetThursday.getHours() - ds);

  // Number of weeks between target Thursday and first Thursday
  const weekDiff = (+targetThursday - +firstThursday) / (86400000 * 7);
  return 1 + Math.floor(weekDiff);
}

/**
 * Get ISO-8601 numeric representation of the day of the week
 * 1 (for Monday) through 7 (for Sunday)
 *
 * @param  {Object} `date`
 * @return {Number}
 */
function getDayOfWeek(date: Date) {
  let dow = date.getDay();
  if (dow === 0) {
    dow = 7;
  }
  return dow;
}

/**
 * kind-of shortcut
 * @param  {*} val
 * @return {String}
 */
function kindOf(val: null | undefined | Record<string, any>) {
  if (val === null) {
    return 'null';
  }

  if (val === undefined) {
    return 'undefined';
  }

  if (typeof val !== 'object') {
    return typeof val;
  }

  if (Array.isArray(val)) {
    return 'array';
  }

  return {}.toString.call(val)
    .slice(8, -1).toLowerCase();
}

const dateFormat: dateFormatI =  function (date: Date | undefined, mask: string | Date, utc?: boolean, gmt?: boolean): string {
  const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
  const timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
  const timezoneClip = /[^-+\dA-Z]/g;
  const tmpArg = arguments;

  dateFormat.i18n = i18n;

  dateFormat.masks = masks;

  // Regexes and supporting functions are cached through closure
  // function (date:Date|string|undefined|number, mask:string|Date, utc:boolean, gmt:boolean):AnalyserOptions 
  // return   {

  // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
  if (tmpArg.length === 1 && typeof date == "string" && kindOf(date) === 'string' && !/\d/.test(date)) {
    mask = date;
    date = undefined;
  }

  date = date || new Date;

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (!date) {
    date = new Date();
  }

  if (isNaN(date.getTime())) {
    throw TypeError('Invalid date');
  }

  mask = String(dateFormat.masks && dateFormat.masks[mask as keyof MasksI] || mask || dateFormat.masks && dateFormat.masks['default']);

  // Allow setting the utc/gmt argument via the mask
  const maskSlice = mask.slice(0, 4);
  if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
    mask = mask.slice(4);
    utc = true;
    if (maskSlice === 'GMT:') {
      gmt = true;
    }
  }

  const _ = utc ? 'getUTC' : 'get';
  const getUTC = _ == "getUTC";
  const d = getUTC ? date.getUTCDate() : date.getDate();
  const D = getUTC ? date.getUTCDay() : date.getDay();
  const m = getUTC ? date.getUTCMonth() : date.getMonth();
  const y = getUTC ? date.getUTCFullYear() : date.getFullYear();
  const H = getUTC ? date.getUTCHours() : date.getHours();
  const M = getUTC ? date.getUTCMinutes() : date.getMinutes();
  const s = getUTC ? date.getUTCSeconds() : date.getSeconds();
  const L = getUTC ? date.getUTCMilliseconds() : date.getMilliseconds();
  const o = utc ? 0 : date.getTimezoneOffset();
  const W = getWeek(date);
  const N = getDayOfWeek(date);
  const flags: FlagsI = {
    d: d,
    dd: pad(d),
    ddd: dateFormat.i18n.dayNames[D],
    dddd: dateFormat.i18n.dayNames[D + 7],
    m: m + 1,
    mm: pad(m + 1),
    mmm: dateFormat.i18n.monthNames[m],
    mmmm: dateFormat.i18n.monthNames[m + 12],
    yy: String(y).slice(2),
    yyyy: y,
    h: H % 12 || 12,
    hh: pad(H % 12 || 12),
    H: H,
    HH: pad(H),
    M: M,
    MM: pad(M),
    s: s,
    ss: pad(s),
    l: pad(L, 3),
    L: pad(Math.round(L / 10)),
    t: H < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1],
    tt: H < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3],
    T: H < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5],
    TT: H < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7],
    o: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
    W: W,
    N: N,
    Z: "",
    S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : +(d % 100 - d % 10 != 10) * d % 10]
  };

  let Z = "";
  if (gmt) {
    Z = 'GMT';
  } else {
    if (utc) {
      Z = 'UTC';
    } else {
      let tmp = (String(date).match(timezone) || ['']).pop();
      if (!tmp) tmp = ''
      Z = tmp.replace(timezoneClip, '');
    }
  }
  flags.Z = Z;


  return mask.replace(token, function (match) {
    if (match in flags) {
      return flags[match as keyof FlagsI].toString();
    }
    return match.slice(1, match.length - 1);
  });
  // };
};

dateFormat.i18n = i18n;

dateFormat.masks = masks;

export { dateFormat, getDayOfWeek, getWeek }
