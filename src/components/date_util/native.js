import {dateFormat, getWeek} from '../dateformat'

const DateUtil = {
  isSame: (date1, date2, granularity ) => {
    let dt1 = new Date(date1)
    let dt2 = new Date(date2)
    if(granularity === 'date') {
      dt1.setHours(0,0,0,0);
      dt2.setHours(0,0,0,0);
    }
    return dt1.getTime() === dt2.getTime()
  },
  daysInMonth: (year, month) => {
    return new Date(year, month, 0).getDate()
  },
  weekNumber: (date) => {
    return getWeek(date)
  },
  format: (date, mask) => {
    return dateFormat(date, mask)
  },
  nextMonth: (date) => {
    let nextMonthDate = new Date(date.getTime())
    nextMonthDate.setDate(1)
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    return nextMonthDate
  },
  prevMonth: (date) => {
    let prevMonthDate = new Date(date.getTime())
    prevMonthDate.setDate(1)
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
    return prevMonthDate
  },
  validateDateRange: (newDate, min, max) => {
    let max_date = new Date(max);
    let min_date = new Date(min);

    if(max && newDate.getTime() > max_date.getTime()) {
      return max_date;
    }

    if(min && newDate.getTime() < min_date.getTime()) {
      return min_date;
    }

    return newDate;
  },
  localeData: (options) => {
    let default_locale = {
      direction: 'ltr',
      format: 'mm/dd/yyyy',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: dateFormat.i18n.dayNames.slice(0, 7).map(d => d.substring(0, 2)),
      monthNames: dateFormat.i18n.monthNames.slice(0, 12),
      firstDay: 0
    };

    return {...default_locale, ...options }
  },
  yearMonth: (date) => {
    let month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0':'') + month
  },
  isValidDate: (d) => {
    return d instanceof Date && !isNaN(d);
  }
}

export default DateUtil
