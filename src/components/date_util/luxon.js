import { DateTime, Info } from "luxon";

const DateUtil = {
  /**
   * Compares if two date1 and date2 are the same with specified granularity(date, month, year)
   * @param {Date} date1
   * @param {Date} date2
   * @param {'millisecond'|'second'|'minute'|'hour'|'day'|'month'|'quarter'|'year'} granularity
   * @returns {boolean} returns if the dates are the same with this granularity
   */
  isSame: (date1, date2, granularity) => {
    const _date1 = DateTime.fromJSDate(date1);
    const _date2 = DateTime.fromJSDate(date2);
    return _date1.hasSame(_date2, granularity);
  },
  
  /**
   * Get number of days in month specified by year and month
   * @param {number} year
   * @param {number} month
   * @return {number} number of days
   */
  daysInMonth: (year, month) => {
    return DateTime.fromObject({ year, month }).daysInMonth();
  },
  
  /**
   * Return ISO week number for date
   * @param {Date} date
   * @return {number} the week number
   */
  weekNumber: (date) => {
    return DateTime.fromJSDate(date).weekNumber();
  },
  
  /**
   * Formats the date object with the specified mask.
   * @see https://github.com/felixge/node-dateformat
   *
   * @param {Date} date
   * @param {string} mask
   * @return {string} the formatted date
   */
  format: (date, mask) => {
    return DateTime.fromJSDate(date).toFormat(mask);
  },
  
  /**
   * Get next month from date
   * @param {Date} date
   * @return {Date} the first day of the next month
   */
  nextMonth: (date) => {
    return DateTime.fromJSDate(date).plus({ month: 1 }).toJSDate();
  },
  
  /**
   * Get previous month from date
   * @param {Date} date
   * @return {Date} the first day of the previous month
   */
  prevMonth: (date) => {
    return DateTime.fromJSDate(date).minus({ month: 1 }).toJSDate();
  },
  
  /**
   * Validates a date base on date range [min, max]. Keeps the date in the constraint.
   * @param {Date} newDate
   * @param {Date|number} min
   * @param {Date|number} max
   * @return {Date} the date after it has been checked if it is in the range specified.
   */
  validateDateRange: (newDate, min, max) => {
    let max_date = new Date(max);
    let min_date = new Date(min);
    
    if (max && newDate.getTime() > max_date.getTime()) {
      return max_date;
    }

    if (min && newDate.getTime() < min_date.getTime()) {
      return min_date;
    }

    return newDate;
  },
  
  /**
   * Returns the locale data based on passed options object.
   * @param {any} options
   * @return {{cancelLabel: string, applyLabel: string, format: string, daysOfWeek: *, separator: string, customRangeLabel: string, weekLabel: string, direction: string}}
   */
  localeData: (options) => {
    let default_locale = {
      direction: 'ltr',
      format: 'mm/dd/yyyy',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: Info.weekdays('short'),
      monthNames: Info.months('short'),
      firstDay: 0,
    };

    return {...default_locale, ...options }
  },
  
  /**
   * Returns date in the format YYYYMM
   * @param {Date} date
   * @return {string} the date formatted
   */
  yearMonth: (date) => {
    return DateTime.fromJSDate(date).toFormat('yyyyMM');
  },
  
  /**
   * Is the date valid?
   * @param {Date} date
   * @return {boolean} true if valid, false otherwise.
   */
  isValidDate: (date) => {
    return moment(date).isValid()
  },
}

export default DateUtil
