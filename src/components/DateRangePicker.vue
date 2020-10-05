<template>
  <div class="vue-daterange-picker" :class="{ inline: opens === 'inline' }">
    <div
      :class="controlContainerClass"
      @click="onClickPicker"
      ref="toggle"
    >
      <!--
        Allows you to change the input which is visible before the picker opens

        @param {Date} startDate - current startDate
        @param {Date} endDate - current endDate
        @param {object} ranges - object with ranges
      -->
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
        v-if="open || opens === 'inline'"
        v-append-to-body
        ref="dropdown"
      >

        <!--
          Optional header slot (same props as footer) @see footer slot for documentation
        -->
        <slot name="header"
              :rangeText="rangeText"
              :locale="locale"
              :clickCancel="clickCancel"
              :clickApply="clickedApply"
              :in_selection="in_selection"
              :autoApply="autoApply"
        >
        </slot>

        <div class="calendars row no-gutters">
          <!--
            Allows you to change the range

            @param {Date} startDate - current startDate
            @param {Date} endDate - current endDate
            @param {object} ranges - object with ranges
            @param {Fn} clickRange(dateRange) - call to select the dateRange - any two date objects or an object from tha ranges array
          -->
          <slot
            name="ranges"
            :startDate="start"
            :endDate="end"
            :ranges="ranges"
            :clickRange="clickRange"
            v-if="showRanges"
          >
            <calendar-ranges class="col-12 col-md-auto"
                             @clickRange="clickRange"
                             @showCustomRange="showCustomRangeCalendars=true"
                             :always-show-calendars="alwaysShowCalendars"
                             :locale-data="locale"
                             :ranges="ranges"
                             :selected="{ startDate: start, endDate: end }"
            ></calendar-ranges>
          </slot>

          <div class="calendars-container" v-if="showCalendars">
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
              <calendar-time v-if="timePicker && start"
                             @update="onUpdateStartTime"
                             :miniute-increment="timePickerIncrement"
                             :hour24="timePicker24Hour"
                             :second-picker="timePickerSeconds"
                             :current-time="start"
                             :readonly="readonly"
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
              <calendar-time v-if="timePicker && end"
                             @update="onUpdateEndTime"
                             :miniute-increment="timePickerIncrement"
                             :hour24="timePicker24Hour"
                             :second-picker="timePickerSeconds"
                             :current-time="end"
                             :readonly="readonly"
              />
            </div>
          </div>
        </div>
        <!--
          Allows you to change footer of the component (where the buttons are)

          @param {string} rangeText - the formatted date range by the component
          @param {object} locale - the locale object @see locale prop
          @param {function} clickCancel - function which is called when you want to cancel the range picking and reset old values
          @param {function} clickApply -function which to call when you want to apply the selection
          @param {boolean} in_selection - is the picker in selection mode
          @param {boolean} autoApply - value of the autoApply prop (whether to select immediately)
        -->
        <slot name="footer"
              :rangeText="rangeText"
              :locale="locale"
              :clickCancel="clickCancel"
              :clickApply="clickedApply"
              :in_selection="in_selection"
              :autoApply="autoApply"
        >
          <div class="drp-buttons" v-if="!autoApply">
            <span class="drp-selected" v-if="showCalendars">{{rangeText}}</span>
            <button
              class="cancelBtn btn btn-sm btn-secondary"
              type="button"
              @click="clickCancel"
              v-if="!readonly"
            >{{locale.cancelLabel}}
            </button>
            <button
              class="applyBtn btn btn-sm btn-success"
              :disabled="in_selection"
              type="button"
              @click="clickedApply"
              v-if="!readonly"
            >{{locale.applyLabel}}
            </button>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
  import dateUtilMixin from './dateUtilMixin'
  import Calendar from './Calendar.vue'
  import CalendarTime from './CalendarTime'
  import CalendarRanges from './CalendarRanges'
  import {getDateUtil} from './util'
  import appendToBody from '../directives/appendToBody';

  export default {
    inheritAttrs: false,
    components: {Calendar, CalendarTime, CalendarRanges},
    mixins: [dateUtilMixin],
    directives: {appendToBody},
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
       * Only show a single calendar, with or without ranges.
       *
       * Set true or 'single' for a single calendar with no ranges, single dates only.
       * Set 'range' for a single calendar WITH ranges.
       * Set false for a double calendar with ranges.
       */
      singleDatePicker: {
        type: [Boolean, String],
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
       * This is the v-model prop which the component uses. This should be an object containing startDate and endDate props.
       * Each of the props should be a string which can be parsed by Date, or preferably a Date Object.
       * @default {
       * startDate: null,
       * endDate: null
       * }
       */
      dateRange: { // for v-model
        type: [Object],
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
          let today = new Date()
          today.setHours(0, 0, 0, 0)

          let yesterday = new Date()
          yesterday.setDate(today.getDate() - 1)
          yesterday.setHours(0, 0, 0, 0);

          let thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          let thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

          return {
            'Today': [today, today],
            'Yesterday': [yesterday, yesterday],
            'This month': [thisMonthStart, thisMonthEnd],
            'This year': [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
            'Last month': [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)],
          }
        }
      },
      /**
       * which way the picker opens - "center", "left", "right" or "inline"
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
       * If set to false and one of the predefined ranges is selected then calendars are hidden.
       * If no range is selected or you have clicked the "Custom ranges" then the calendars are shown.
       */
      alwaysShowCalendars: {
        type: Boolean,
        default: true
      },
      /**
       * Disabled state. If true picker do not popup on click.
       */
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * Class of html picker control container
       */
      controlContainerClass: {
        type: [Object, String],
        default: 'form-control reportrange-text'
      },
      /**
       * Append the dropdown element to the end of the body
       * and size/position it dynamically. Use it if you have
       * overflow or z-index issues.
       * @type {Boolean}
       */
      appendToBody: {
        type: Boolean,
        default: false
      },
      /**
       * When `appendToBody` is true, this function is responsible for
       * positioning the drop down list.
       *
       * If a function is returned from `calculatePosition`, it will
       * be called when the drop down list is removed from the DOM.
       * This allows for any garbage collection you may need to do.
       *
       * @since v0.5.1
       */
      calculatePosition: {
        type: Function,
        /**
         * @param dropdownList {HTMLUListElement}
         * @param component {Vue} current instance of vue date range picker
         * @param width {int} calculated width in pixels of the dropdown menu
         * @param top {int} absolute position top value in pixels relative to the document
         * @param left {int} absolute position left value in pixels relative to the document
         * @param right {int} absolute position right value in pixels relative to the document
         * @return {function|void}
         */
        default (dropdownList, component, {width, top, left, right}) {
          // which way the picker opens - "center", "left" or "right"
          if (component.opens === 'center') {
            // console.log('center open', left, width)
            dropdownList.style.left = (left + width/2) + 'px'
          } else if (component.opens === 'left') {
            // console.log('left open', right, width)
            dropdownList.style.right = (window.innerWidth - right) + 'px'
          } else if (component.opens === 'right') {
            // console.log('right open')
            dropdownList.style.left = (left) + 'px'
          }
          dropdownList.style.top = top + 'px'
          // dropdownList.style.width = width + 'px'
        }
      },
      /**
       * Whether to close the dropdown on "esc"
       */
      closeOnEsc: {
        type: Boolean,
        default: true
      },
      /**
       * Makes the picker readonly. No button in footer. No ranges. Cannot change.
       */
      readonly: {
        type: Boolean
      }
    },
    data () {
      //copy locale data object
      const util = getDateUtil();
      let data = {locale: util.localeData({...this.localeData})}

      let startDate = this.dateRange.startDate || null;
      let endDate = this.dateRange.endDate || null;

      data.monthDate = startDate ? new Date(startDate) : new Date()
      //get next month date
      data.nextMonthDate = util.nextMonth(data.monthDate)

      data.start = startDate ? new Date(startDate) : null
      if (this.singleDatePicker && this.singleDatePicker !== 'range') {
        // ignore endDate for singleDatePicker
        data.end = data.start
      } else {
        data.end = endDate ? new Date(endDate) : null
      }
      data.in_selection = false
      data.open = false
      //When alwaysShowCalendars = false and custom range is clicked
      data.showCustomRangeCalendars = false

      // update day names order to firstDay
      if (data.locale.firstDay !== 0) {
        let iterator = data.locale.firstDay
        let weekDays = [...data.locale.daysOfWeek]
        while (iterator > 0) {
          weekDays.push(weekDays.shift())
          iterator--
        }
        data.locale.daysOfWeek = weekDays
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
        let newDate = new Date(value.year, value.month - 1, 1);
        this.monthDate = newDate
        if (this.linkedCalendars || (this.$dateUtil.yearMonth(this.monthDate) >= this.$dateUtil.yearMonth(this.nextMonthDate))) {
          this.nextMonthDate = this.$dateUtil.validateDateRange(this.$dateUtil.nextMonth(newDate), this.minDate, this.maxDate);
          if (!this.singleDatePicker && this.$dateUtil.yearMonth(this.monthDate) === this.$dateUtil.yearMonth(this.nextMonthDate)) {
            this.monthDate = this.$dateUtil.validateDateRange(this.$dateUtil.prevMonth(this.monthDate), this.minDate, this.maxDate)
          }
        }
        /**
         * Emits event when the viewing month is changes. The second param is the index of the calendar.
         *
         * @param {monthDate} date displayed (first day of the month)
         * @param calendarIndex int 0 - first(left) calendar, 1 - second(right) calendar
         */
        this.$emit('change-month', this.monthDate, 0)
      },
      changeRightMonth (value) {
        let newDate = new Date(value.year, value.month - 1, 1);
        this.nextMonthDate = newDate
        if (this.linkedCalendars || (this.$dateUtil.yearMonth(this.nextMonthDate) <= this.$dateUtil.yearMonth(this.monthDate))) {
          this.monthDate = this.$dateUtil.validateDateRange(this.$dateUtil.prevMonth(newDate), this.minDate, this.maxDate);
          if (this.$dateUtil.yearMonth(this.monthDate) === this.$dateUtil.yearMonth(this.nextMonthDate)) {
            this.nextMonthDate = this.$dateUtil.validateDateRange(this.$dateUtil.nextMonth(this.nextMonthDate), this.minDate, this.maxDate)
          }
        }
        this.$emit('change-month', this.monthDate, 1)
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
        if(this.readonly)
          return false
        if (this.in_selection) {
          this.in_selection = false
          this.end = this.normalizeDatetime(value, this.end);

          if (this.end < this.start) {
            this.in_selection = true
            this.start = this.normalizeDatetime(value, this.start);
          }
          if (!this.in_selection) {
            this.onSelect();
            if (this.autoApply)
              this.clickedApply();
          }
        } else {
          this.start = this.normalizeDatetime(value, this.start);
          this.end = this.normalizeDatetime(value, this.end);
          if (!this.singleDatePicker || this.singleDatePicker === 'range') {
            this.in_selection = true
          } else {
            this.onSelect();
            if (this.autoApply)
              this.clickedApply();
          }
        }
      },
      hoverDate (value) {
        if(this.readonly)
          return false
        let dt = this.normalizeDatetime(value, this.end);
        if (this.in_selection && dt >= this.start)
          this.end = dt
        /**
         * Emits event when the mouse hovers a date
         * @param {Date} value the date that is being hovered
         */
        this.$emit('hoverDate', value)
      },
      onClickPicker () {
        if (!this.disabled) {
          this.togglePicker(null, true)
        }
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
        this.$emit('update', {startDate: this.start, endDate: this.singleDatePicker ? this.start : this.end})
      },
      clickCancel () {
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
      onSelect () {
        /**
         * Emits when the user selects a range from the picker.
         * @param {json} value - json object containing the dates: {startDate, endDate}
         */
        this.$emit('select', {startDate: this.start, endDate: this.end})
      },
      clickAway ($event) {
        if ($event && $event.target &&
          !this.$el.contains($event.target) &&
          this.$refs.dropdown &&
          !this.$refs.dropdown.contains($event.target)) {
          this.clickCancel()
        }
      },
      clickRange (value) {
        this.in_selection = false;

        if (this.$dateUtil.isValidDate(value[0]) && this.$dateUtil.isValidDate(value[1])) {
          this.start = this.$dateUtil.validateDateRange(new Date(value[0]), this.minDate, this.maxDate)
          this.end = this.$dateUtil.validateDateRange(new Date(value[1]), this.minDate, this.maxDate)
          this.changeLeftMonth({
            month: this.start.getMonth() + 1,
            year: this.start.getFullYear()
          })
        } else {
          this.start = null
          this.end = null
        }

        this.onSelect();

        if (this.autoApply)
          this.clickedApply()
      },
      onUpdateStartTime (value) {
        let start = new Date(this.start);
        start.setHours(value.hours);
        start.setMinutes(value.minutes);
        start.setSeconds(value.seconds);

        this.start = this.$dateUtil.validateDateRange(start, this.minDate, this.maxDate);

        // if autoapply is ON we should update the value on time selection change
        if (this.autoApply) {
          this.$emit('update', {startDate: this.start, endDate: this.singleDatePicker ? this.start : this.end})
        }
      },
      onUpdateEndTime (value) {
        let end = new Date(this.end);
        end.setHours(value.hours);
        end.setMinutes(value.minutes);
        end.setSeconds(value.seconds);

        this.end = this.$dateUtil.validateDateRange(end, this.minDate, this.maxDate);

        // if autoapply is ON we should update the value on time selection change
        if (this.autoApply) {
          this.$emit('update', {startDate: this.start, endDate: this.end})
        }
      },
      handleEscape (e) {
        if (this.open && e.keyCode === 27 && this.closeOnEsc) {
          this.clickCancel()
        }
      }
    },
    computed: {
      showRanges () {
        return this.ranges !== false && !this.readonly
      },
      showCalendars () {
        return this.alwaysShowCalendars || this.showCustomRangeCalendars
      },
      startText () {
        if (this.start === null)
          return ''
        return this.$dateUtil.format(this.start, this.locale.format)
      },
      endText () {
        if (this.end === null)
          return ''
        return this.$dateUtil.format(this.end, this.locale.format)
      },
      rangeText () {
        let range = this.startText;
        if (!this.singleDatePicker || this.singleDatePicker === 'range') {
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
          'show-calendar': this.open || this.opens === 'inline',
          'show-ranges': this.showRanges,
          'show-weeknumbers': this.showWeekNumbers,
          single: this.singleDatePicker,
          ['opens' + this.opens]: true,
          linked: this.linkedCalendars,
          'hide-calendars': !this.showCalendars
        }
      },
      isClear () {
        return !this.dateRange.startDate || !this.dateRange.endDate
      },
      isDirty () {
        let origStart = new Date(this.dateRange.startDate)
        let origEnd = new Date(this.dateRange.endDate)

        return !this.isClear && (this.start.getTime() !== origStart.getTime() || this.end.getTime() !== origEnd.getTime())
      }
    },
    watch: {
      minDate () {
        let dt = this.$dateUtil.validateDateRange(this.monthDate, this.minDate || new Date(), this.maxDate)
        this.changeLeftMonth({year: dt.getFullYear(), month: dt.getMonth() + 1})
      },
      maxDate () {
        let dt = this.$dateUtil.validateDateRange(this.nextMonthDate, this.minDate, this.maxDate || new Date())
        this.changeRightMonth({year: dt.getFullYear(), month: dt.getMonth() + 1})
      },
      'dateRange.startDate' (value) {
        if (!this.$dateUtil.isValidDate(new Date(value)))
          return

        this.start = (!!value && !this.isClear && this.$dateUtil.isValidDate(new Date(value))) ? new Date(value) : null
        if (this.isClear) {
          this.start = null
          this.end = null
        } else {
          this.start = new Date(this.dateRange.startDate)
          this.end = new Date(this.dateRange.endDate)
        }
      },
      'dateRange.endDate' (value) {
        if (!this.$dateUtil.isValidDate(new Date(value)))
          return

        this.end = (!!value && !this.isClear) ? new Date(value) : null
        if (this.isClear) {
          this.start = null
          this.end = null
        } else {
          this.start = new Date(this.dateRange.startDate)
          this.end = new Date(this.dateRange.endDate)
        }
      },
      open: {
        handler (value) {
          if (typeof document === "object") {
            this.$nextTick(() => {
              value ? document.body.addEventListener('click', this.clickAway) : document.body.removeEventListener('click', this.clickAway)
              value ? document.addEventListener('keydown', this.handleEscape) : document.removeEventListener('keydown', this.handleEscape)

              if (!this.alwaysShowCalendars && this.ranges) {
                this.showCustomRangeCalendars = !Object.keys(this.ranges)
                  .find(key => this.$dateUtil.isSame(this.start, this.ranges[key][0], 'date') && this.$dateUtil.isSame(this.end, this.ranges[key][1], 'date'))
              }
            })
          }
        },
        immediate: true
      }
    }
  }

</script>

<style lang="scss">
  @import '../assets/daterangepicker.scss';
</style>

<style lang="scss" scoped>
  $week-width: 0px;

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

    //les than 768
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

    @media screen and (max-width: 541px){
      .calendars-container {
        flex-wrap: wrap;
      }
    }

    /*from 540 to 768*/
    @media screen and (min-width: 540px) {
      min-width: 486px;
      &.show-weeknumbers {
        min-width: 486px + $week-width;
      }
    }

    //more than 768
    @media screen and (min-width: 768px) {
      &.show-ranges {
        min-width: 682px;

        &.show-weeknumbers {
          min-width: 682px + $week-width;
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
          min-width: 356px;

          &.show-weeknumbers {
            min-width: 356px + $week-width;
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
      top: auto;
    }
  }

  .daterangepicker {
    &.opensleft {
      /*top: 35px;*/
      right: 10px;
      left: auto;
    }

    &.openscenter {
      /*top: 35px;*/
      right: auto;
      left: 50%;
      transform: translate(-50%, 0);
    }

    &.opensright {
      /*top: 35px;*/
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
    min-width: 60px;

    .dropdown-menu {
      padding: 0;
    }

    .show-ranges.hide-calendars {
      width: 150px;
      min-width: 150px;
    }
  }

  .inline {
    .daterangepicker {
      position: static;

      &:before, &:after {
        display: none;
      }
    }
  }

</style>
