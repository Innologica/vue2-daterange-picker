import moment from 'moment'

export default {
  isSame: (date1, date2, granularity = 'date') => {
    return moment(date1).isSame(date2, granularity)
  },
  daysInMonth: (year, month) => {
    return moment([year, month]).daysInMonth()
  },
  weekNumber: (date) => {
    return moment(date).week()
  },
  format: (date, mask) => {
    return moment(date).format(mask)
  },
  nextMonth: (date) => {
    return moment(date).add(1,'months').startOf('month').toDate()
  },
  prevMonth: (date) => {
    return moment(date).subtract(1,'months').startOf('month').toDate()
  },
  validateDateRange: (newDate, min, max) => {
    let max_date = new Date(max);
    let min_date = new Date(min);

    if(max && moment(newDate).isAfter(max_date)) {
      return max_date;
    }

    if(min && moment(newDate).isBefore(min_date)) {
      return min_date;
    }

    return newDate;
  },
  localeData: (options) => {
    let default_locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    return {...default_locale, ...options }
  },
  yearMonth: (date) => {
    return moment(date).format('YYYYMM')
  }
}
