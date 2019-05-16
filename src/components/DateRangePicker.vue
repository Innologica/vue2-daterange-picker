<template>
    <div class="vue-daterange-picker">
        <div class="form-control reportrange-text" @click="togglePicker">
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
                    <slot name="ranges" v-if="ranges !== false">
                        <calendar-ranges class="col-12 col-md-auto"
                                         @clickRange="clickRange"
                                         :ranges="ranges"
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
                                      :locale="locale"
                                      :start="start" :end="end"
                                      :minDate="min" :maxDate="max"
                                      :show-dropdowns="showDropdowns"
                                      @nextMonth="nextMonth" @prevMonth="prevMonth"
                                      @change-month="changeLeftMonth"
                                      @dateClick="dateClick" @hoverDate="hoverDate"
                                      :showWeekNumbers="showWeekNumbers"
                            ></calendar>
                        </div>
                        <calendar-time v-if="timePicker"
                                       @update="onUpdateStartTime"
                                       @change-month="changeRightMonth"
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
                                      :locale="locale"
                                      :start="start" :end="end"
                                      :minDate="min" :maxDate="max"
                                      :show-dropdowns="showDropdowns"
                                      @nextMonth="nextMonth" @prevMonth="prevMonth"
                                      @change-month="changeRightMonth"
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
  import {nextMonth, prevMonth} from './util'
  import {mixin as clickaway} from 'vue-clickaway'

  export default {
    components: {Calendar, CalendarTime, CalendarRanges},
    mixins: [clickaway],
    model: {
      prop: 'dateRange',
      event: 'update',
    },
    props: {
      minDate: {
        type: [String, Date],
        default () {
          return new Date(0)
        }
      },
      maxDate: {
        type: [String, Date],
        default () {
          return new Date(8640000000000000)
        }
      },
      showWeekNumbers: {
        type: Boolean,
        default: false,
      },
      singleDatePicker: {
        type: Boolean,
        default: false,
      },
      showDropdowns: {
        type: Boolean,
        default: false,
      },
      timePicker: {
        type: Boolean,
        default: false,
      },
      timePickerIncrement: {
        type: Number,
        default: 5,
      },
      timePicker24Hour: {
        type: Boolean,
        default: true,
      },
      timePickerSeconds: {
        type: Boolean,
        default: false,
      },
      autoApply: {
        type: Boolean,
        default: false,
      },
      localeData: {
        type: Object,
        default () {
          return {}
        },
      },
      dateRange: { // for v-model
        default: null,
      },
      startDate: {
        default () {
          return new Date()
        }
      },
      endDate: {
        default () {
          return new Date()
        }
      },
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
      opens: {
        type: String,
        default: 'center'
      },
      onClose: {
        type: Function,
        default: function() {}
      }
    },
    data () {
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

      // let data = { locale: _locale }
      let data = {locale: {...default_locale, ...this.localeData}}

      let startDate = this.startDate;
      let endDate = this.endDate;
      if (this.dateRange !== null) {
        startDate = this.dateRange.startDate;
        endDate = this.dateRange.endDate;
      }

      data.monthDate = new Date(startDate)
      data.start = new Date(startDate)
      if (this.singleDatePicker) {
        // ignore endDate for singleDatePicker
        data.end = new Date(startDate)
      } else {
        data.end = new Date(endDate)
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
      changeMonth (newDate) {
        let max = new Date(this.max);
        let min = new Date(this.min);
        // check min
        if (moment(newDate).isBetween(min, max)) {
          this.monthDate = newDate;
        } else if (moment(newDate).isAfter(max)) {
          this.monthDate = new Date(max);
        } else {
          this.monthDate = new Date(min);
        }
      },
      nextMonth () {
        this.changeMonth(nextMonth(new Date(this.monthDate.getFullYear(),
          this.monthDate.getMonth(), 1)));
      },
      prevMonth () {
        this.changeMonth(prevMonth(new Date(this.monthDate.getFullYear(),
          this.monthDate.getMonth(), 1)));
      },
      changeLeftMonth (value) {
        let newDate = new Date(value.year, value.month, 1);
        this.changeMonth(newDate);
      },
      changeRightMonth (value) {
        if (value.month <= 0) {
          value.month = 11;
          value.year -= 1;
        } else {
          value.month -= 1;
        }
        this.changeLeftMonth(value);
      },
      normalizeDatetime (value, oldValue) {
        let newDate = new Date(value);
        if (this.timePicker) {
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
        if (this.in_selection && dt > this.start)
          this.end = dt
      },
      togglePicker () {
        this.open = !this.open
      },
      clickedApply () {
        this.open = false
        this.$emit('update', {startDate: this.start, endDate: this.end})
      },
      clickAway () {
        if (this.open) {
          // reset start and end
          let startDate = this.startDate;
          let endDate = this.endDate;
          if (this.dateRange !== null) {
            startDate = this.dateRange.startDate;
            endDate = this.dateRange.endDate;
          }
          this.start = new Date(startDate);
          this.end = new Date(endDate);
          this.open = false
        }
      },
      clickRange (value) {
        this.start = new Date(value[0])
        this.end = new Date(value[1])
        this.monthDate = new Date(value[0])
        if(this.autoApply)
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
      nextMonthDate () {
        return nextMonth(this.monthDate)
      },
      startText () {
        // return this.start.toLocaleDateString()
        return moment(this.start).format(this.locale.format)
      },
      endText () {
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
          openscenter: this.opens === 'center'
        }
      },
    },
    watch: {
      startDate (value) {
        this.start = new Date(value)
      },
      endDate (value) {
        this.end = new Date(value)
      },
      minDate (value) {
        this.changeMonth(this.monthDate);
      },
      maxDate (value) {
        this.changeMonth(this.monthDate);
      },
      dateRange (value) {
        if (value) {
          if (value.startDate) {
            this.start = new Date(value.startDate);
          }
          if (value.endDate) {
            this.end = new Date(value.endDate);
          }
        }
      },
      open (value, oldValue) {
        if (oldValue && !value) {
          this.onClose()
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
