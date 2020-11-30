<template>
    <table class="table-condensed">
        <thead>
        <tr>
            <th class="prev available" @click="prevMonthClick" tabindex="0"><span/></th>
            <th
                    v-if="showDropdowns"
                    :colspan="showWeekNumbers ? 6 : 5"
                    class="month"
            >
                <div class="row mx-1">
                    <select v-model="month" class="monthselect col">
                        <option v-for="(m) in months" :key="m.value" :value="m.value + 1">{{m.label}}</option>
                    </select>
                    <input ref="yearSelect" type="number" v-model="year" @blur="checkYear" class="yearselect col" />
                </div>
            </th>
            <th v-else :colspan="showWeekNumbers ? 6 : 5" class="month">{{monthName}} {{year}}</th>
            <th class="next available" @click="nextMonthClick" tabindex="0"><span/></th>
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
                {{$dateUtil.weekNumber(dateRow[0])}}
            </td>
            <slot name="date-slot" v-for="(date, idx) in dateRow">
                <td
                        :class="dayClass(date)"
                        @click="$emit('date-click', date)"
                        @mouseover="$emit('hover-date', date)"
                        :key="idx"
                >
                    {{date.getDate()}}
                </td>
            </slot>
        </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
  import dateUtilMixin from './dateUtilMixin'
import mixins from "vue-typed-mixins";
 import { PropType } from "vue";

// export default Vue.extend({
  export default mixins(dateUtilMixin).extend({
    // mixins: [dateUtilMixin],
    name: 'calendar',
    props: {
      monthDate: Date,
      localeData: Object,
      start: Date ,
      end: Date,
      locale: Object,
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
      const monthDate = this.monthDate ? typeof this.monthDate === 'string' ? new Date(this.monthDate) : this.monthDate : null
      const start = this.start ? typeof this.start === 'string' ? new Date(this.start) : this.start : null
      const currentMonthDate = monthDate || start || new Date()
      return {
        currentMonthDate,
        year_text: currentMonthDate.getFullYear(),
      }
    },
    methods: {
      prevMonthClick() {
        this.changeMonthDate(this.$dateUtil.prevMonth(this.currentMonthDate))
      },
      nextMonthClick() {
        this.changeMonthDate(this.$dateUtil.nextMonth(this.currentMonthDate))
      },
      changeMonthDate (date: Date, emit = true) {
        const year_month = this.$dateUtil.yearMonth(this.currentMonthDate)
        this.currentMonthDate = this.$dateUtil.validateDateRange(date, this.minDate, this.maxDate)
        // console.info(date, this.currentMonthDate)
        if(emit && year_month !== this.$dateUtil.yearMonth(this.currentMonthDate)) {
          this.$emit('change-month', {
            month: this.currentMonthDate.getMonth() + 1,
            year: this.currentMonthDate.getFullYear(),
          })
        }
        this.checkYear()
      },
      dayClass (date: Date) {
        const dt = new Date(date)
        dt.setHours(0, 0, 0, 0)
        const start = new Date(this.start)
        start.setHours(0, 0, 0, 0)
        const end = new Date(this.end)
        end.setHours(0, 0, 0, 0)

        const classes = {
          off: date.getMonth() + 1 !== this.month,
          weekend: date.getDay() === 6 || date.getDay() === 0,
          today: dt.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0),
          active: dt.setHours(0, 0, 0, 0) == new Date(this.start).setHours(0, 0, 0, 0) || dt.setHours(0, 0, 0, 0) == new Date(this.end).setHours(0, 0, 0, 0),
          'in-range': dt >= start && dt <= end,
          'start-date': dt.getTime() === start.getTime(),
          'end-date': dt.getTime() === end.getTime(),
          disabled: (this.minDate && dt.getTime() < new Date(this.minDate).getTime())
            || (this.maxDate && dt.getTime() > new Date(this.maxDate).getTime()),
        }
        return this.dateFormat ? this.dateFormat(classes, date) : classes

      },
      checkYear () {
        if(this.$refs.yearSelect !== document.activeElement) {
          this.$nextTick(() => {
            this.year_text = new Date(this.monthDate).getFullYear()
          })
        }
      }
    },
    computed: {
      monthName () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm: any = this;
        const month = vm.currentMonthDate.getMonth();
        return this.locale.monthNames[month]
      },
      year: {
        get () {
          const vm: any = this;
          //return this.currentMonthDate.getFullYear()
          return vm.year_text
        },
        set (value: any) {
          this.year_text = value
          const newDate = this.$dateUtil.validateDateRange(new Date(value, this.month, 1), this.minDate, this.maxDate)
          if(this.$dateUtil.isValidDate(newDate)) {
            this.$emit('change-month', {
              month: newDate.getMonth(),
              year: newDate.getFullYear(),
            });
          }
        }
      },
      month: {
        get () {
          const vm: any = this;
          return vm.currentMonthDate.getMonth() + 1
        },
        set (value: any) {
          const newDate = this.$dateUtil.validateDateRange(new Date(this.year, value - 1, 1), this.minDate, this.maxDate)

          this.$emit('change-month', {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear(),
          });
        }
      },
      calendar () {
        const month = this.month
        const year = this.currentMonthDate.getFullYear()
        const firstDay = new Date(year, month - 1, 1)
        const lastMonth = this.$dateUtil.prevMonth(firstDay).getMonth() + 1
        const lastYear = this.$dateUtil.prevMonth(firstDay).getFullYear()
        const daysInLastMonth = new Date(lastYear, month - 1, 0).getDate()

        const dayOfWeek = firstDay.getDay()

        const calendar: any = []

        for (let i = 0; i < 6; i++) {
          calendar[i] = [];
        }

        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1
        if (startDay > daysInLastMonth)
          startDay -= 7

        if (dayOfWeek === this.locale.firstDay)
          startDay = daysInLastMonth - 6;

        const curDate = new Date(lastYear, lastMonth - 1, startDay, 12, 0, 0);
        for (let i = 0, col = 0, row = 0; i < 6 * 7; i++, col++, curDate.setDate(curDate.getDate() + 1)) {
          if (i > 0 && col % 7 === 0) {
            col = 0;
            row++;
          }
          calendar[row][col] = new Date(curDate.getTime())
        }

        return calendar
      },
      months () {
        const monthsData = this.locale.monthNames.map((m: any, idx: any) => ({ label: m, value: idx }))

        if (this.maxDate && this.minDate) {
          const y = new Date(this.maxDate).getFullYear() - new Date(this.minDate).getFullYear();
          if (y < 2) {
            // get months
            const months: any = [];
            if (y < 1) {
              for (let i = new Date(this.minDate).getMonth(); i <= new Date(this.maxDate).getMonth(); i++) {
                months.push(i);
              }
            } else {
              for (let i = 0; i <= new Date(this.maxDate).getMonth(); i++) {
                months.push(i);
              }
              for (let i = new Date(this.minDate).getMonth(); i < 12; i++) {
                months.push(i);
              }
            }
            // do filter
            if (months.length > 0) {
              return monthsData.filter((m: any) => {
                return months.find((i: any) => m.value === i) > -1;
              });
            }
          }
        }
        return monthsData;
      },
      locale () { return this.$dateUtil.localeData(this.localeData) }
    },
    watch: {
      monthDate (value) {
        if(this.currentMonthDate.getTime() !== value.getTime()) {
          this.changeMonthDate(value, false)
        }
      }
    }
  })
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
