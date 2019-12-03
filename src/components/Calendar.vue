<template>
    <table class="table-condensed">
        <thead>
        <tr>
            <th class="prev available" @click="prevMonth"><span/></th>
            <th
                    v-if="showDropdowns"
                    :colspan="showWeekNumbers ? 6 : 5"
                    class="month"
            >
                <div class="row mx-1">
                    <select v-model="month" class="monthselect col">
                        <option v-for="(m) in months" :key="m.value" :value="m.value">{{m.label}}</option>
                    </select>
                    <input type="number" v-model="year" class="yearselect col" />
                </div>
            </th>
            <th v-else colspan="5" class="month">{{monthName}} {{year}}</th>
            <th class="next available" @click="nextMonth"><span/></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th v-if="showWeekNumbers" class="week">{{locale.weekLabel}}</th>
            <th v-for="weekDay in locale.daysOfWeek" :key="weekDay">{{weekDay}}</th>
        </tr>
        <tr
                v-for="(dateRow, index) in calendar"
                :key="index"
        >
            <td v-if="showWeekNumbers && (index%7 || index===0)" class="week">
                {{dateRow[0] | weeknumber}}
            </td>
            <slot name="date-slot" v-for="(date, idx) in dateRow">
                <td
                        :class="dayClass(date)"
                        @click="$emit('dateClick', date)"
                        @mouseover="$emit('hoverDate', date)"
                        :key="idx"
                >
                    {{date | dateNum}}
                </td>
            </slot>
        </tr>
        </tbody>
    </table>
</template>

<script>
  import { addDays, getISODay, isBefore, startOfDay, isAfter, subMonths, getDaysInMonth, setHours, getWeek } from 'date-fns'
  import {localeData, nextMonth, prevMonth, validateDateRange, yearMonth} from "./util";

  export default {
    name: 'calendar',
    props: {
      monthDate: Date,
      localeData: Object,
      start: Date,
      end: Date,
      minDate: Date,
      maxDate: Date,
      showDropdowns: {
        type: Boolean,
        default: false,
      },
      showWeekNumbers: {
        type: Boolean,
        default: false,
      },
      dateFormat: {
        type: Function,
        default: null
      }
    },
    data () {
      return {
        currentMonthDate: this.monthDate || this.start || new Date(),
      }
    },
    methods: {
      prevMonth() {
        this.changeMonthDate(prevMonth(this.currentMonthDate))
      },
      nextMonth() {
        this.changeMonthDate(nextMonth(this.currentMonthDate))
      },
      changeMonthDate (date, emit = true) {
        let year_month = yearMonth(this.currentMonthDate)
        this.currentMonthDate = validateDateRange(date, this.minDate, this.maxDate)
        if(emit && year_month !== yearMonth(this.currentMonthDate)) {
          this.$emit('change-month', {
            month: this.currentMonthDate.getMonth(),
            year: this.currentMonthDate.getFullYear(),
          })
        }
      },
      dayClass (date) {
        let dt = new Date(date)
        dt.setHours(0, 0, 0, 0)
        let start = new Date(this.start)
        start.setHours(0, 0, 0, 0)
        let end = new Date(this.end)
        end.setHours(0, 0, 0, 0)

        let classes = {
          off: date.getMonth() !== this.month,
          weekend: getISODay(date) > 5,
          today: dt.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
          active: dt.setHours(0, 0, 0, 0) == new Date(this.start).setHours(0, 0, 0, 0) || dt.setHours(0, 0, 0, 0) == new Date(this.end).setHours(0, 0, 0, 0),
          // 'in-range': dt >= start && dt <= end,
          'start-date': dt.getTime() === start.getTime(),
          'end-date': dt.getTime() === end.getTime(),
          disabled: (this.minDate && isBefore(startOfDay(dt), startOfDay(this.minDate)))
            || (this.maxDate && isAfter(startOfDay(dt), startOfDay(this.maxDate))),
        }
        return this.dateFormat ? this.dateFormat(classes, date) : classes

      }
    },
    computed: {
      monthName () {
        return this.locale.getMonthName(this.currentMonthDate)
      },
      year: {
        get () {
          return this.currentMonthDate.getFullYear()
        },
        set (value) {
          let newDate = validateDateRange(new Date(value, this.month, 1), this.minDate, this.maxDate)

          this.$emit('change-month', {
            month: newDate.getMonth(),
            year: newDate.getFullYear(),
          });
        }
      },
      month: {
        get () {
          return this.currentMonthDate.getMonth()
        },
        set (value) {
          let newDate = validateDateRange(new Date(this.year, value, 1), this.minDate, this.maxDate)

          this.$emit('change-month', {
            month: newDate.getMonth(),
            year: newDate.getFullYear(),
          });
        }
      },
      calendar () {
        let month = this.month
        let year = this.currentMonthDate.getFullYear()
        let firstDay = new Date(year, month, 1)
        let lastMonth = subMonths(firstDay, 1).getMonth()
        let lastYear = subMonths(firstDay, 1).getFullYear()
        let daysInLastMonth = getDaysInMonth(new Date(lastYear, lastMonth))

        let dayOfWeek = firstDay.getDay()

        let calendar = []

        for (let i = 0; i < 6; i++) {
          calendar[i] = [];
        }

        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1
        if (startDay > daysInLastMonth)
          startDay -= 7

        if (dayOfWeek === this.locale.firstDay)
          startDay = daysInLastMonth - 6;

        let curDate = new Date(lastYear, lastMonth, startDay, 12, 0, 0);
        for (let i = 0, col = 0, row = 0; i < 6 * 7; i++, col++, curDate = addDays(curDate, 1)) {
          if (i > 0 && col % 7 === 0) {
            col = 0;
            row++;
          }
          calendar[row][col] = new Date(curDate.getTime())
          setHours(curDate, 12);
        }

        return calendar
      },
      months () {
        let monthsData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => ({ label: this.locale.getMonthName(new Date(2000, i)), value: i }))
        if (this.maxDate && this.minDate) {
          let y = this.maxDate.getFullYear() - this.minDate.getFullYear();
          if (y < 2) {
            // get months
            let months = [];
            if (y < 1) {
              for (let i = this.minDate.getMonth(); i <= this.maxDate.getMonth(); i++) {
                months.push(i);
              }
            } else {
              for (let i = 0; i <= this.maxDate.getMonth(); i++) {
                months.push(i);
              }
              for (let i = this.minDate.getMonth(); i < 12; i++) {
                months.push(i);
              }
            }
            // do filter
            if (months.length > 0) {
              return monthsData.filter((m) => {
                return months.find(i => m.value === i) > -1;
              });
            }
          }
        }
        return monthsData;
      },
      locale () { return localeData(this.localeData) }
    },
    watch: {
      monthDate (value) {
        this.changeMonthDate(value, false)
      }
    },
    filters: {
      dateNum (value) {
        return value.getDate()
      },
      weeknumber (value) {
        return getWeek(value)
      }
    }
  }
</script>

<style scoped lang="scss">
    th, td {
        padding: 2px;
        background-color: white;
    }

    td.today {
        font-weight: bold;
    }

    td.disabled {
        pointer-events: none;
        background-color: #eee;
        border-radius: 0;
        opacity: 0.6;
    }

    @function str-replace($string, $search, $replace: "") {
        $index: str-index($string, $search);

        @if $index {
            @return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace);
        }

        @return $string;
    }

    $carousel-control-color: #ccc !default;
    $viewbox: '-2 -2 10 10';
    $carousel-control-prev-icon-bg: str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E"), "#", "%23") !default;
    $carousel-control-next-icon-bg: str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E"), "#", "%23") !default;

    .fa {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: transparent no-repeat center center;
        background-size: 100% 100%;
        fill: $carousel-control-color;
    }

    .prev, .next {
        &:hover {
            background-color: transparent !important;
        }

        .fa:hover {
            opacity: 0.6;
        }
    }

    .chevron-left {
        width: 16px;
        height: 16px;
        display: block;
        background-image: $carousel-control-prev-icon-bg;
    }

    .chevron-right {
        width: 16px;
        height: 16px;
        display: block;
        background-image: $carousel-control-next-icon-bg;
    }

    .yearselect {
        padding-right: 1px;
        border: none;
        appearance: menulist;
    }

    .monthselect {
        border: none;
    }
</style>
