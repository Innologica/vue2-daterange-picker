import { format, isAfter, isBefore, setDay } from 'date-fns'
import { enUS } from 'date-fns/locale'

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

    if(max && isAfter(newDate, max_date)) {
        return max_date;
    }

    if(min && isBefore(newDate, min_date)) {
        return min_date;
    }

    return newDate;
}

const localeData = (options = {}) => {
    let default_locale = {
        locale: enUS,
        direction: 'ltr',
        format: 'P',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6].map(i => format(setDay(new Date(), i), 'ccc', { locale: options.locale })),
        customRangeLabel: 'Custom Range',
        firstDay: options.locale ? options.locale.weekStartsOn : 1
    }
    let actions = {
        formatDate: function (date) {
            return format(date, options.format || default_locale.format, { locale: options.locale })
        },
        getMonthName: function(date) {
            if (options.monthNames) return options.monthNames[this.currentMonthDate.getMonth()]
            return format(date, 'LLL', { locale: options.locale })
        }
    }

    return { ...default_locale, ...options, ...actions }
}

const yearMonth = (date) => {
    let month = date.getMonth() + 1
    return date.getFullYear() + (month < 10 ? '0':'') + month
}

export { nextMonth, prevMonth, validateDateRange, localeData, yearMonth }
