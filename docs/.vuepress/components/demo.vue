<template>
  <div class="demo">
    <div class="py-5">
      <div class="form-group flex">
        <label>Select range: </label>
        <date-range-picker
          class="ml-1"
          ref="picker"
          :opens="opens"
          :locale-data="{ firstDay: 1, format: 'yyyy-mm-dd HH:MM:ss' }"
          :minDate="minDate" :maxDate="maxDate"
          :singleDatePicker="singleDatePicker"
          :timePicker="timePicker"
          :timePicker24Hour="timePicker24Hour"
          :showWeekNumbers="showWeekNumbers"
          :showDropdowns="showDropdowns"
          :autoApply="autoApply"
          v-model="dateRange"
          :ranges="show_ranges ? undefined : false"
          @update="updateValues"
          @toggle="checkOpen"
          :linkedCalendars="linkedCalendars"
          :dateFormat="dateFormat"
          :always-show-calendars="false"
          :alwaysShowCalendars="alwaysShowCalendars"
          :append-to-body="appendToBody"
          :closeOnEsc="closeOnEsc"
        >
          <template #input="picker" style="min-width: 350px;">
            {{ picker.startDate | date }} - {{ picker.endDate | date }}
          </template>
        </date-range-picker>

        <button class="btn btn-info ml-1" @click="dateRange.startDate = null, dateRange.endDate = null">
          Clear
        </button>
        <button @click.stop="$refs.picker.togglePicker()" class="btn btn-secondary ml-1">Toggle</button>
      </div>
    </div>

    <div class="form-row pt-3 bg-light tip custom-block">
      <p class="custom-block-title">dateRange: { startDate, endDate }</p>
      <p></p>

      <div class="flex">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="startDate">startDate</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="startDate" v-model="dateRange.startDate">
          </div>
        </div>
        <div class="ml-1 form-group row">
          <label class="col-sm-4 col-form-label" for="endDate">endDate</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="endDate" v-model="dateRange.endDate">
          </div>
        </div>
      </div>

      <div class="flex">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="minDate">minDate</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="minDate" v-model="minDate">
          </div>
        </div>
        <div class="ml-1 form-group row">
          <label class="col-sm-4 col-form-label" for="maxDate">maxDate</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="maxDate" v-model="maxDate">
          </div>
        </div>
      </div>
    </div>

    <h3>Other props: </h3>
    <p>
    <div class="flex">
      <label>opens: </label>
      <div class="form-check form-check-inline ml-1">
        <input class="form-check-input" type="radio" name="options" id="option1" value="left"
               v-model="opens">
        <label class="form-check-label">left</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="options" id="option2" value="center"
               v-model="opens">
        <label class="form-check-label">center</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="options" id="option3" value="right"
               v-model="opens">
        <label class="form-check-label">right</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="options" id="option4" value="inline"
               v-model="opens">
        <label class="form-check-label">inline</label>
      </div>
    </div>
    <small class="form-text text-muted">Whether the picker appears aligned to the left, to the right, or
      centered relative to the HTML element it's attached to. Or inline to display it inline.
    </small>
    </p>

    <div>
      <p class="form-check form-inline">
        <div class=" flex">
          <label class="form-check-label" for="singleDatePicker">
            singleDatePicker:
          </label>
          <select v-model="singleDatePicker" id="singleDatePicker" class="form-control ml-1">
            <option>single</option>
            <option>range</option>
            <option :value="false">default</option>
          </select>
        </div>
        <small class="form-text text-muted">Select the calendar mode single selects only single date with 1 calendar.
          Range is single calendar with ranges. default are 2 calendars with range selection.</small>
      </p>

      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="showWeekNumbers" v-model="showWeekNumbers">
        <label class="form-check-label" for="showWeekNumbers">
          showWeekNumbers
        </label>
        <small class="form-text text-muted">
          Show the ISO weeknumbers on the side of the calendar
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="timePicker" v-model="timePicker">
        <label class="form-check-label" for="timePicker">
          timePicker
        </label>
        <small class="form-text text-muted">
          Allow the user to select time.
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="timePicker24Hour"
               v-model="timePicker24Hour">
        <label class="form-check-label" for="timePicker24Hour">
          timePicker24Hour
        </label>
        <small class="form-text text-muted">
          The time selection uses the 24 hour format
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="showDropdowns" v-model="showDropdowns">
        <label class="form-check-label" for="showDropdowns">
          showDropdowns
        </label>
        <small class="form-text text-muted">
          Show dropdown/input for faster selection of year and month.
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="autoApply" v-model="autoApply">
        <label class="form-check-label" for="autoApply">
          autoApply
        </label>
        <small class="form-text text-muted">
          Automatically select the range once the second date is selected ( otherwise you need to
          click the apply button)
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="show_ranges" v-model="show_ranges">
        <label class="form-check-label" for="show_ranges">
          show ranges
        </label>
        <small class="form-text text-muted">
          You can set this to false in order to hide the ranges selection. Otherwise it is an object
          with key/value.
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="linkedCalendars" v-model="linkedCalendars">
        <label class="form-check-label" for="linkedCalendars">
          linkedCalendars
        </label>
        <small class="form-text text-muted">
          Each calendar has separate navigation
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="alwaysShowCalendars" v-model="alwaysShowCalendars">
        <label class="form-check-label" for="alwaysShowCalendars">
          alwaysShowCalendars
        </label>
        <small class="form-text text-muted">
          Defaults to true. If set to false only the ranges will be visible if one of them is selected. If no range
          is selected or you have clicked the "Custom ranges" then the calendar selectors are shown.
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="appendToBody" v-model="appendToBody">
        <label class="form-check-label" for="appendToBody">
          appendToBody
        </label>
        <small class="form-text text-muted">
          Defaults to false. Append the dropdown element to the end of the body
          * and size/position it dynamically.
        </small>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="closeOnEsc" v-model="closeOnEsc">
        <label class="form-check-label" for="closeOnEsc">
          closeOnEsc
        </label>
        <small class="form-text text-muted">
          Defaults to true. Close the dropdown on escape key pressed.
        </small>
      </div>
    </div>

    <div class="pt-5">
      <h5>Override date formatting :</h5>
      <dt>dateFormat: function(classes, date) -
        <small>special prop type function which accepts 2 params:</small>
      </dt>
      <ul>
        <li>"classes" - the classes that the component's logic has defined,</li>
        <li>"date" - tha date currently processed.</li>
      </ul>

      <p><b>@return:</b> you should return Vue class object which should be applied to the date rendered.</p>
      <p>in the demo this function is used to disable "yesterday" date</p>

    </div>
  </div>
</template>

<script>
import DateRangePicker from '../../../src/components/DateRangePicker'
import dateUtil from '../../../src/components/date_util/native'

export default {
  components: {DateRangePicker},
  name: 'DateRangePickerDemo',
  filters: {
    date (value) {
      if (!value)
        return ''

      let options = {year: 'numeric', month: 'long', day: 'numeric'};
      return Intl.DateTimeFormat('en-US', options).format(value)
    }
  },
  data () {
    //                    :locale-data="{ daysOfWeek: [ 'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ] }"
    return {
      opens: 'center',
      minDate: '2019-05-02 04:00:00',
      maxDate: '2020-12-26 14:00:00',
      // minDate: '',
      // maxDate: '',
      dateRange: {
        startDate: '2019-12-10',
        endDate: '2019-12-20',
      },
      single_range_picker: false,
      show_ranges: true,
      singleDatePicker: false,
      timePicker: true,
      timePicker24Hour: true,
      showDropdowns: true,
      autoApply: false,
      showWeekNumbers: true,
      linkedCalendars: true,
      alwaysShowCalendars: true,
      appendToBody: false,
      closeOnEsc: true,
    }
  },
  mounted () {
    // this.$refs.picker.open = true
  },
  methods: {
    updateValues (values) {
      console.log('event: update', {...values})
      this.dateRange.startDate = dateUtil.format(values.startDate, 'yyyy-mm-dd HH:MM:ss');
      this.dateRange.endDate = dateUtil.format(values.endDate, 'yyyy-mm-dd HH:MM:ss');
    },
    checkOpen (open) {
      console.log('event: open', open)
    },
    dateFormat (classes, date) {
      let yesterday = new Date();
      let d1 = dateUtil.format(date, 'isoDate')
      let d2 = dateUtil.format(yesterday.setDate(yesterday.getDate() - 1), 'isoDate')
      if (!classes.disabled) {
        classes.disabled = d1 === d2
      }
      return classes
    }
  }
}
</script>

<style scoped>
.py-5 {
  padding: 3rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: inline-block;
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
}

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.form-control {
  display: block;
  max-width: 100%;
  padding: .3rem .75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: .25rem;
}

.flex {
  display: flex;
  align-items: center;
}

.ml-1 {
  margin-left: 0.25rem;
}
.text-muted {
  color: #6c757d!important;
}
</style>
