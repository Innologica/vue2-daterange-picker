import {dateFormat, getWeek} from '../dateformat'
interface localeDataI {
  direction: string;
  format: string;
  separator: string;
  applyLabel: string;
  cancelLabel: string;
  weekLabel: string;
  customRangeLabel: string;
  daysOfWeek: string[];
  monthNames: string[];
  firstDay: number;
}
const DateUtil = {
  isSame: (date1: Date, date2: Date, granularity: string ) => {
    const dt1 = new Date(date1)
    const dt2 = new Date(date2)
    if(granularity === 'date') {
      dt1.setHours(0,0,0,0);
      dt2.setHours(0,0,0,0);
    }
    return dt1.getTime() === dt2.getTime()
  },
  daysInMonth: (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  },
  weekNumber: (date: Date) => {
    return getWeek(date)
  },
  format: (date: Date, mask: string) => {
    return dateFormat(date, mask)
  },
  nextMonth: (date: Date): Date => {
    const nextMonthDate = new Date(date.getTime())
    nextMonthDate.setDate(1)
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
    return nextMonthDate
  },
  prevMonth: (date: Date) => {
    const prevMonthDate = new Date(date.getTime())
    prevMonthDate.setDate(1)
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
    return prevMonthDate
  },
  validateDateRange: (newDate: Date, min: Date, max: Date) => {
    const max_date = new Date(max);
    const min_date = new Date(min);

    if(max && newDate.getTime() > max_date.getTime()) {
      return max_date;
    }

    if(min && newDate.getTime() < min_date.getTime()) {
      return min_date;
    }

    return newDate;
  },
  localeData: (options: Record<string, any>): localeDataI => {
    const default_locale: localeDataI = {
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
  yearMonth: (date: Date) => {
    const month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0':'') + month
  },
  isValidDate: (d: Date) => {
    return d instanceof Date && !isNaN(d.getTime());
  }
}

export default DateUtil
