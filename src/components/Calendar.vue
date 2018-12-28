<template>
    <table class="table-condensed">
        <thead>
        <tr>
            <th class="prev available" @click="$emit('prevMonth')"><i :class="[arrowLeftClass]"></i></th>
            <th colspan="5" class="month">{{monthName}} {{year}}</th>
            <th class="next available" @click="$emit('nextMonth')"><i :class="[arrowRightClass]"></i></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th v-for="weekDay in locale.daysOfWeek" :key="weekDay">{{weekDay}}</th>
        </tr>
        <tr
                v-for="(dateRow, index) in calendar"
                :key="index"
        >
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
  import moment from 'moment'

  export default {
    name: 'calendar',
    props: ['monthDate', 'locale', 'start', 'end', 'minDate', 'maxDate'],
    methods: {
      dayClass (date) {
        let dt = new Date(date)
        dt.setHours(0, 0, 0, 0)
        let start = new Date(this.start)
        start.setHours(0, 0, 0, 0)
        let end = new Date(this.end)
        end.setHours(0, 0, 0, 0)

        return {
          off: date.month() !== this.month,
          weekend: date.isoWeekday() > 5,
          today: dt.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
          active: dt.setHours(0, 0, 0, 0) == new Date(this.start).setHours(0, 0, 0, 0) || dt.setHours(0, 0, 0, 0) == new Date(this.end).setHours(0, 0, 0, 0),
          'in-range': dt >= start && dt <= end,
          'start-date': dt.getTime() === start.getTime(),
          'end-date': dt.getTime() === end.getTime(),
          disabled: (this.minDate && moment(dt).startOf("day").isBefore(moment(this.minDate).startOf("day")))
            || (this.maxDate && moment(dt).startOf("day").isAfter(moment(this.maxDate).startOf("day"))),
        }
      }
    },
    computed: {
      arrowLeftClass () {
        return 'chevron-left'
      },
      arrowRightClass () {
        return 'chevron-right'
      },
      monthName () {
        return this.locale.monthNames[this.monthDate.getMonth()]
      },
      year () {
        return this.monthDate.getFullYear()
      },
      month () {
        return this.monthDate.getMonth()
      },
      calendar () {
        let month = this.month
        let year = this.monthDate.getFullYear()
        let daysInMonth = new Date(year, month, 0).getDate()
        let firstDay = new Date(year, month, 1)
        let lastDay = new Date(year, month, daysInMonth)
        let lastMonth = moment(firstDay).subtract(1, 'month').month()
        let lastYear = moment(firstDay).subtract(1, 'month').year()
        let daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth()

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

        let curDate = moment([lastYear, lastMonth, startDay, 12, 0, 0]);
        for (let i = 0, col = 0, row = 0; i < 6 * 7; i++, col++, curDate = moment(curDate).add(1, 'day')) {
          if (i > 0 && col % 7 === 0) {
            col = 0;
            row++;
          }
          calendar[row][col] = curDate.clone()
          curDate.hour(12);
        }

        return calendar
      }
    },
    filters: {
      dateNum (value) {
        return value.date()
      }
    }
  }
</script>

<style scoped lang="scss">
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

    $carousel-control-color:            #ccc !default;
    $viewbox: '-2 -2 10 10';
    $carousel-control-prev-icon-bg:     str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E"), "#", "%23") !default;
    $carousel-control-next-icon-bg:     str-replace(url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='#{$viewbox}'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E"), "#", "%23") !default;

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
</style>