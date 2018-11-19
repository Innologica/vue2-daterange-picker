<template>
    <table class="table-condensed">
        <thead>
        <tr>
            <th class="prev available" @click="$emit('prevMonth')"><span /></th>
            <th v-if="showDropdowns" colspan="5" class="month">
              <select :value="monthName" @change="onChangeMonth" class="monthselect">
                <option v-for="m in months" :key="m" :value="m">{{m}}</option>
              </select>
              <select :value="year" @change="onChangeYear" class="yearselect">
                <option v-for="y in years" :key="y" :value="y">{{y}}</option>
              </select>
            </th>
            <th v-else colspan="5" class="month">{{monthName}} {{year}}</th>
            <th class="next available" @click="$emit('nextMonth')"><span /></th>
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
    props: {
      monthDate: Date,
      locale: Object,
      start: Date,
      end: Date,
      minDate: Date,
      maxDate: Date,
      showDropdowns: {
        type: Boolean,
        default: false,
      },
      singleDatePicker: {
        type: Boolean,
        default: false,
      },
    },
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
      },
      onChangeMonth (e) {
        let m = this.locale.monthNames.findIndex(v => v === e.target.value);
        this.$emit('change-month', {
          month: m,
          year: this.year,
        });
      },
      onChangeYear (e) {
        this.$emit('change-month', {
          month: this.month,
          year: e.target.value,
        });
      },
    },
    computed: {
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
      },
      months() {
        let y = this.maxDate.getFullYear() - this.minDate.getFullYear();
        if (y < 2) {
          // get months
          let months = [];
          if (y < 1 ) {
            for (let i=this.minDate.getMonth(); i<=this.maxDate.getMonth(); i++) {
              months.push(i);
            }
          } else {
            for (let i=0; i<=this.maxDate.getMonth(); i++) {
              months.push(i);
            }
            for (let i=this.minDate.getMonth(); i<12; i++) {
              months.push(i);
            }
          }
          if (!this.singleDatePicker) {
            months.push((this.maxDate.getMonth()+1) % 12)
          }

          // do filter
          if (months.length > 0) {
            return this.locale.monthNames.filter((m, index) => {
              return months.findIndex(i => i === index) > -1;
            });
          }
        }
        return this.locale.monthNames;
      },
      years() {
        let values = [];
        for (let i=this.minDate.getFullYear(); i <= this.maxDate.getFullYear(); i++) {
          values.push(i);
        }
        return values;
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
</style>