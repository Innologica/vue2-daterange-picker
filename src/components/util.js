import moment from 'moment'

const nextMonth = (date) => {
    let passYear = date.getMonth() === 11
    let newMonth = passYear ? 0 : date.getMonth() + 1
    let year = passYear ? date.getFullYear() + 1 : date.getFullYear()
    return new Date(year, newMonth, 1)
}

const prevMonth = (date) => {
    let passYear = date.getMonth() === 0
    let newMonth = passYear ? 11 : date.getMonth() - 1
    let year = passYear ? date.getFullYear() - 1 : date.getFullYear()
    return new Date(year, newMonth, 1)
}

const validateDateRange = (newDate, min, max) => {
    let max_date = new Date(max);
    let min_date = new Date(min);

    if(max && moment(newDate).isAfter(max_date)) {
        return max_date;
    }

    if(min && moment(newDate).isBefore(min_date)) {
        return min_date;
    }

    return newDate;
}

const localeData = (options) => {
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
    }

    return {...default_locale, ...options }
}

const yearMonth = (date) => {
    let month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0':'') + month
}

export { nextMonth, prevMonth, validateDateRange, localeData, yearMonth }
