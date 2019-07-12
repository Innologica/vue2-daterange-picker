<template>
    <div class="vue-daterange-picker">
        <div :class="wrapperClass" @click="togglePicker(null, true)">
            <!--
              Allows you to change the input which is visible before the picker opens

              @param {Date} startDate - current startDate
              @param {Date} endDate - current endDate
              @param {object} ranges - object with ranges
            -->
            <slot name="icon">
            </slot>
            <slot
                    name="input"
                    :startDate="start"
                    :endDate="end"
                    :ranges="ranges"
            >
                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
                <span>{{rangeText}}</span>
                <b class="caret"></b>
            </slot>
        </div>
        <transition name="slide-fade" mode="out-in">
            <div
                    class="daterangepicker dropdown-menu ltr"
                    :class="pickerStyles"
                    v-if="open"
                    v-on-clickaway="clickAway"
            >
                <div class="calendars row no-gutters">
            <!--
              Allows you to change the range

              @param {Date} startDate - current startDate
              @param {Date} endDate - current endDate
              @param {object} ranges - object with ranges
            -->
                    <slot
                            name="ranges"
                            :startDate="start"
                            :endDate="end"
                            :ranges="ranges"
                            v-if="ranges !== false"
                    >
                        <calendar-ranges class="col-12 col-md-auto"
                                         @clickRange="clickRange"
                                         :ranges="ranges"
                                         :selected="{ startDate: start, endDate: end }"
                        ></calendar-ranges>
                    </slot>

                    <div class="drp-calendar col left" :class="{single: singleDatePicker}">
                        <div class="daterangepicker_input d-none d-sm-block" v-if="false">
                            <input class="input-mini form-control" type="text" name="daterangepicker_start"
                                   :value="startText"/>
                            <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                        </div>
                        <div class="calendar-table">
                            <calendar :monthDate="monthDate"
                                      :locale-data="locale"
                                      :start="start" :end="end"
                                      :minDate="min" :maxDate="max"
                                      :show-dropdowns="showDropdowns"

                                      @change-month="changeLeftMonth"
                                      :date-format="dateFormatFn"

                                      @dateClick="dateClick" @hoverDate="hoverDate"
                                      :showWeekNumbers="showWeekNumbers"
                            ></calendar>
                        </div>
                        <calendar-time v-if="timePicker"
                                       @update="onUpdateStartTime"
                                       :miniute-increment="timePickerIncrement"
                                       :hour24="timePicker24Hour"
                                       :second-picker="timePickerSeconds"
                                       :current-time="start"
                        />
                    </div>

                    <div class="drp-calendar col right" v-if="!singleDatePicker">
                        <div class="daterangepicker_input" v-if="false">
                            <input class="input-mini form-control" type="text" name="daterangepicker_end"
                                   :value="endText"/>
                            <i class="fa fa-calendar glyphicon glyphicon-calendar"></i>
                        </div>
                        <div class="calendar-table">
                            <calendar :monthDate="nextMonthDate"
                                      :locale-data="locale"
                                      :start="start" :end="end"
                                      :minDate="min" :maxDate="max"
                                      :show-dropdowns="showDropdowns"

                                      @change-month="changeRightMonth"
                                      :date-format="dateFormatFn"

                                      @dateClick="dateClick" @hoverDate="hoverDate"
                                      :showWeekNumbers="showWeekNumbers"
                            ></calendar>
                        </div>
                        <calendar-time v-if="timePicker"
                                       @update="onUpdateEndTime"
                                       :miniute-increment="timePickerIncrement"
                                       :hour24="timePicker24Hour"
                                       :second-picker="timePickerSeconds"
                                       :current-time="end"
                        />
                    </div>
                </div>

                <div class="drp-buttons" v-if="!autoApply">
                    <span class="drp-selected">{{rangeText}}</span>
                    <button
                            class="cancelBtn btn btn-sm btn-default"
                            type="button"
                            @click="clickAway"
                    >{{locale.cancelLabel}}
                    </button>
                    <button
                            class="applyBtn btn btn-sm btn-success"
                            :disabled="in_selection"
                            type="button"
                            @click="clickedApply"
                    >{{locale.applyLabel}}
                    </button>
                </div>

            </div>
        </transition>
    </div>
</template>

<script>
  import moment from 'moment'
  import Calendar from './Calendar.vue'
  import CalendarTime from './CalendarTime'
  import CalendarRanges from './CalendarRanges'
  import {localeData, nextMonth, prevMonth, validateDateRange, yearMonth} from './util'
  import {mixin as clickaway} from 'vue-clickaway'

  export default {
    inheritAttrs: false,
    components: {Calendar, CalendarTime, CalendarRanges},
    mixins: [clickaway],
    model: {
      prop: 'dateRange',
      event: 'update',
    },
    props: {
      /**
       * minimum date allowed to be selected
       * @default null
       */
      minDate: {
        type: [String, Date],
        default () {
          return null
        }
      },
      /**
       * maximum date allowed to be selected
       * @default null
       */
      maxDate: {
        type: [String, Date],
        default () {
          return null
        }
      },
      /**
       * Set classes on text wrapper
       */
      wrapperClass:{
        type:[String],
        default(){
          return 'form-control reportrange-text'
        }
      },
      /**
       * Show the week numbers on the left side of the calendar
       */
      showWeekNumbers: {
        type: Boolean,
        default: false,
      },
      /**
       * Each calendar has separate navigation when this is false
       */
      linkedCalendars: {
        type: Boolean,
        default: true,
      },
      /**
       * Allows you to select only one date (instead of range). This will hide the ranges with different start/end
       */
      singleDatePicker: {
        type: Boolean,
        default: false,
      },
      /**
       * Show the dropdowns for month and year selection above the calendars
       */
      showDropdowns: {
        type: Boolean,
        default: false,
      },
      /**
       * Show the dropdowns for time (hour/minute) selection below the calendars
       */
      timePicker: {
        type: Boolean,
        default: false,
      },
      /**
       * Determines the increment of minutes in the minute dropdown
       */
      timePickerIncrement: {
        type: Number,
        default: 5,
      },
      /**
       * Use 24h format for the time
       */
      timePicker24Hour: {
        type: Boolean,
        default: true,
      },
      /**
       * Allows you to select seconds except hour/minute
       */
      timePickerSeconds: {
        type: Boolean,
        default: false,
      },
      /**
       * Auto apply selected range. If false you need to click an apply button
       */
      autoApply: {
        type: Boolean,
        default: false,
      },
      /**
       * Object containing locale data used by the picker. See example below the table
       *
       * @default *see below
       */
      localeData: {
        type: Object,
        default () {
          return {}
        },
      },
      /**
       * This is the v-model prop which the component uses.
       */
      dateRange: { // for v-model
        default: null,
        required: true
      },
      /**
       * You can set this to false in order to hide the ranges selection. Otherwise it is an object with key/value. See below
       * @default *see below
       */
      ranges: {
        type: [Object, Boolean],
        default () {
          return {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'This month': [moment().startOf('month'), moment().endOf('month')],
            'This year': [moment().startOf('year'), moment().endOf('year')],
            'Last week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
            'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          }
        }
      },
      /**
       * which way the picker opens - "center", "left" or "right"
       */
      opens: {
        type: String,
        default: 'center'
      },
      /**
       function(classes, date) - special prop type function which accepts 2 params:
        "classes" - the classes that the component's logic has defined,
        "date" - tha date currently processed.
         You should return Vue class object which should be applied to the date rendered.
       */
      dateFormat: Function,
      /**
       * *WIP*
       */
      alwaysShowCalendars: {
        type: Boolean,
        default: true
      }
    },
    data () {
    
      let data = {locale: localeData(this.localeData)}

      let startDate = this.dateRange.startDate || null;
      let endDate = this.dateRange.endDate || null;

      data.monthDate = startDate ? new Date(startDate) : new Date()
      data.nextMonthDate = nextMonth(data.monthDate)
      data.start = startDate ? new Date(startDate) : null
      if (this.singleDatePicker) {
        // ignore endDate for singleDatePicker
        data.end = data.start
      } else {
        data.end = endDate ? new Date(endDate) : null
      }
      data.in_selection = false
      data.open = false

      // update day names order to firstDay
      if (data.locale.firstDay !== 0) {
        let iterator = data.locale.firstDay
        while (iterator > 0) {
          data.locale.daysOfWeek.push(data.locale.daysOfWeek.shift())
          iterator--
        }
      }
      return data
    },
    methods: {
      dateFormatFn (classes, date) {
        let dt = new Date(date)
        dt.setHours(0, 0, 0, 0)
        let start = new Date(this.start)
        start.setHours(0, 0, 0, 0)
        let end = new Date(this.end)
        end.setHours(0, 0, 0, 0)

        classes['in-range'] = dt >= start && dt <= end

        return this.dateFormat ? this.dateFormat(classes, date) : classes
      },
      changeLeftMonth (value) {
        let newDate = new Date(value.year, value.month, 1);
        this.monthDate = newDate
        if (this.linkedCalendars || (yearMonth(this.monthDate) >= yearMonth(this.nextMonthDate))) {
          this.nextMonthDate = validateDateRange(nextMonth(newDate), this.minDate, this.maxDate);
          if (yearMonth(this.monthDate) === yearMonth(this.nextMonthDate)) {
            this.monthDate = validateDateRange(prevMonth(this.monthDate), this.minDate, this.maxDate)
          }
        }
      },
      changeRightMonth (value) {
        let newDate = new Date(value.year, value.month, 1);
        this.nextMonthDate = newDate
        if (this.linkedCalendars || (yearMonth(this.nextMonthDate) <= yearMonth(this.monthDate))) {
          this.monthDate = validateDateRange(prevMonth(newDate), this.minDate, this.maxDate);
          if (yearMonth(this.monthDate) === yearMonth(this.nextMonthDate)) {
            this.nextMonthDate = validateDateRange(nextMonth(this.nextMonthDate), this.minDate, this.maxDate)
          }
        }
      },
      normalizeDatetime (value, oldValue) {
        let newDate = new Date(value);
        if (this.timePicker && oldValue) {
          newDate.setHours(oldValue.getHours());
          newDate.setMinutes(oldValue.getMinutes());
          newDate.setSeconds(oldValue.getSeconds());
          newDate.setMilliseconds(oldValue.getMilliseconds());
        }

        return newDate;
      },
      dateClick (value) {
        if (this.in_selection) {
          this.in_selection = false
          this.end = this.normalizeDatetime(value, this.end);

          if (this.end < this.start) {
            this.in_selection = true
            this.start = this.normalizeDatetime(value, this.start);
          }
          if (!this.in_selection && this.autoApply) {
            this.clickedApply();
          }
        } else {
          this.start = this.normalizeDatetime(value, this.start);
          this.end = this.normalizeDatetime(value, this.end);
          if (!this.singleDatePicker) {
            this.in_selection = true
          } else if (this.autoApply) {
            this.clickedApply();
          }
        }
      },
      hoverDate (value) {
        let dt = this.normalizeDatetime(value, this.end);
        if (this.in_selection && dt >= this.start)
          this.end = dt
      },
      togglePicker (value, event) {
        if (typeof value === 'boolean') {
          this.open = value
        } else {
          this.open = !this.open
        }

        if (event === true)
          /**
           * Emits whenever the picker opens/closes
           * @param {boolean} open - the current state of the picker
           * @param {Function} togglePicker - function (show, event) which can be used to control the picker. where "show" is the new state and "event" is boolean indicating whether a new event should be raised
           */
          this.$emit('toggle', this.open, this.togglePicker)

      },
      clickedApply () {
        // this.open = false
        this.togglePicker(false, true)
        /**
         * Emits when the user selects a range from the picker and clicks "apply" (if autoApply is true).
         * @param {json} value - json object containing the dates: {startDate, endDate}
         */
        this.$emit('update', {startDate: this.start, endDate: this.end})
      },
      clickAway () {
        if (this.open) {
          // reset start and end
          let startDate = this.dateRange.startDate
          let endDate = this.dateRange.endDate
          this.start = startDate ? new Date(startDate) : null
          this.end = endDate ? new Date(endDate) : null
          // this.open = false
          this.togglePicker(false, true)
        }
      },
      clickRange (value) {
        this.start = new Date(value[0])
        this.end = new Date(value[1])
        this.monthDate = new Date(value[0])
        if (this.autoApply)
          this.clickedApply()
      },
      onUpdateStartTime (value) {
        let start = new Date(this.start);
        start.setHours(value.hours);
        start.setMinutes(value.minutes);
        start.setSeconds(value.seconds);

        this.start = start;
      },
      onUpdateEndTime (value) {
        let end = new Date(this.end);
        end.setHours(value.hours);
        end.setMinutes(value.minutes);
        end.setSeconds(value.seconds);

        this.end = end;
      },
    },
    computed: {
      startText () {
        // return this.start.toLocaleDateString()+
        if (this.start === null)
          return ''
        return moment(this.start).format(this.locale.format)
      },
      endText () {
        if (this.end === null)
          return ''
        // return new Date(this.end).toLocaleDateString()
        return moment(new Date(this.end)).format(this.locale.format)
      },
      rangeText () {
        let range = this.startText;
        if (!this.singleDatePicker) {
          range += this.locale.separator + this.endText;
        }
        return range;
      },
      min () {
        return this.minDate ? new Date(this.minDate) : null
      },
      max () {
        return this.maxDate ? new Date(this.maxDate) : null
      },
      pickerStyles () {
        return {
          'show-calendar': this.open,
          'show-ranges': !!this.ranges,
          'show-weeknumbers': this.showWeekNumbers,
          single: this.singleDatePicker,
          opensright: this.opens === 'right',
          opensleft: this.opens === 'left',
          openscenter: this.opens === 'center',
          linked: this.linkedCalendars
        }
      },
      isClear () {
        return !this.dateRange.startDate || !this.dateRange.endDate
      }
    },
    watch: {
      minDate () {
        let dt = validateDateRange(this.monthDate, this.minDate || new Date(), this.maxDate)
        this.changeLeftMonth({year: dt.getFullYear(), month: dt.getMonth()})
      },
      maxDate () {
        let dt = validateDateRange(this.nextMonthDate, this.minDate, this.maxDate || new Date())
        this.changeRightMonth({year: dt.getFullYear(), month: dt.getMonth()})
      },
      'dateRange.startDate' (value) {
        this.start = (!!value && !this.isClear) ? new Date(value) : null
        if (this.isClear) {
          this.start = null
          this.end = null
        } else {
          this.start = new Date(this.dateRange.startDate)
          this.end = new Date(this.dateRange.endDate)
        }
      },
      'dateRange.endDate' (value) {
        this.end = (!!value && !this.isClear) ? new Date(value) : null
        if (this.isClear) {
          this.start = null
          this.end = null
        } else {
          this.start = new Date(this.dateRange.startDate)
          this.end = new Date(this.dateRange.endDate)
        }
      }
    }
  }

</script>

<style lang="scss">
    @import '../assets/daterangepicker.css';
</style>

<style lang="scss" scoped>
    $week-width: 682px - 628px;

    .reportrange-text {
        background: #fff;
        cursor: pointer;
        padding: 5px 10px;
        border: 1px solid #ccc;
        width: 100%;
    }

    .daterangepicker {
        flex-direction: column;
        display: flex;
        width: auto;

        @media screen and (max-width: 768px) {
            &.show-ranges {
                .drp-calendar.left {
                    border-left: 0px;
                }

                .ranges {
                    border-bottom: 1px solid #ddd;

                    ::v-deep ul {
                        display: flex;
                        flex-wrap: wrap;
                        width: auto;
                    }
                }
            }
        }

        @media screen and (min-width: 540px) {
            min-width: 486px;
            &.show-weeknumbers {
                min-width: 490px + $week-width;
            }

        }

        @media screen and (min-width: 768px) {
            &.show-ranges {
                min-width: 628px;

                &.show-weeknumbers {
                    min-width: 628px + $week-width;
                }
            }
        }

        &.single {
            @media screen and (max-width: 340px) {
                min-width: 250px;

                &.show-weeknumbers {
                    min-width: 250px + $week-width;
                }
            }

            @media screen and (min-width: 339px) {
                min-width: auto;
                &.show-ranges {
                    min-width: 328px;

                    &.show-weeknumbers {
                        min-width: 328px + $week-width;
                    }

                    .drp-calendar.left {
                        border-left: 1px solid #ddd;
                    }

                    .ranges {
                        width: auto;
                        max-width: none;
                        flex-basis: auto;
                        border-bottom: 0;

                        ::v-deep ul {
                            display: block;
                            width: 100%;
                        }
                    }
                }
            }
        }

        &.show-calendar {
            display: block;
        }
    }

    .daterangepicker {
        &.opensleft {
            top: 35px;
            right: 10px;
            left: auto;
        }

        &.openscenter {
            top: 35px;
            right: auto;
            left: 50%;
            transform: translate(-50%, 0);
        }

        &.opensright {
            top: 35px;
            left: 10px;
            right: auto;
        }
    }

    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .2s ease;
    }

    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for <2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }

    .vue-daterange-picker {
        position: relative;
        display: inline-block;
    }

</style>