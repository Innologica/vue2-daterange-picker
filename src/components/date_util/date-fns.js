import { isSameDay, getDaysInMonth, getISOWeek, format, addMonths, subMonths, isValid } from 'date-fns'
import {dateFormat} from '../dateformat'

const DateUtil = {
  isSame: (date1, date2, granularity ) => {
    if (granularity === 'date')
      return isSameDay(date1, date2)
    else
      return date1.getTime() === date2.getTime()
  },
  daysInMonth: (year, month) => {
    return getDaysInMonth(new Date(year, month - 1, 1))
  },
  weekNumber: (date) => {
    return getISOWeek(date)
  },
  format: (date, mask) => {
    return format(date, mask)
  },
  nextMonth: (date) => {
    return addMonths(date, 1)
  },
  prevMonth: (date) => {
    return subMonths(date, 1)
  },
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
  localeData: (options) => {
    let default_locale = {
      direction: 'ltr',
      format: 'MM/dd/yyyy',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: dateFormat.i18n.dayNames.slice(0, 7),
      monthNames: dateFormat.i18n.monthNames.slice(0, 12),
      firstDay: 0
    };

    return {...default_locale, ...options}
  },
  yearMonth: (date) => {
    let month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0' : '') + month
  },
  isValidDate: (d) => {
    return isValid(d);
  }
}

export default DateUtil
