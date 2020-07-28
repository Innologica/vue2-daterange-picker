const DateUtil = {
  /**
   * Compares if two date1 and date2 are the same with specified granularity(date, month, year)
   * @param {Date} date1
   * @param {Date} date2
   * @param {'millisecond'|'second'|'minute'|'hour'|'day'|'month'|'quarter'|'year'} granularity
   * @returns {boolean} returns if the dates are the same with this granularity
   */
  isSame: (date1, date2, granularity) => {},
  /**
   * Get number of days in month specified by year and month
   * @param {number} year
   * @param {number} month
   * @return {number} number of days
   */
  daysInMonth: (year, month) => {},
  /**
   * Return ISO week number for date
   * @param {Date} date
   * @return {number} the week number
   */
  weekNumber: (date) => {},
  /**
   * Formats the date object with the specified mask.
   * @see https://github.com/felixge/node-dateformat
   *
   * @param {Date} date
   * @param {string} mask
   * @return {string} the formatted date
   */
  format: (date, mask) => {},
  /**
   * Get next month from date
   * @param {Date} date
   * @return {Date} the first day of the next month
   */
  nextMonth: (date) => {},
  /**
   * Get previous month from date
   * @param {Date} date
   * @return {Date} the first day of the previous month
   */
  prevMonth: (date) => {},
  /**
   * Validates a date base on date range [min, max]. Keeps the date in the constraint.
   * @param {Date} newDate
   * @param {Date|number} min
   * @param {Date|number} max
   * @return {Date} the date after it has been checked if it is in the range specified.
   */
  validateDateRange: (newDate, min, max) => {},
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
      daysOfWeek: [],//days of week (short),
      monthNames: [],// month names (short),
      firstDay: 0
    };

    return {...default_locale, ...options }
  },
  /**
   * Returns date in the format YYYYMM
   * @param {Date} date
   * @return {string} the date formatted
   */
  yearMonth: (date) => {},
  
  /**
   * Is the date valid?
   * @param {Date} date
   * @return {boolean} true if valid, false otherwise.
   */
  isValidDate: (date) => {},
}

export default DateUtil
