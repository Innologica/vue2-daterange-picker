<template>
    <div class="demo">

        <div class="py-5">
            <div class="form-group">
                <label>Select range: </label>
                <date-range-picker
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
                >
                    <div slot="input" slot-scope="picker" style="min-width: 350px;">
                        {{ picker.startDate | date }} - {{ picker.endDate | date }}
                    </div>
                </date-range-picker>

                <button class="btn btn-info" @click="dateRange.startDate = null, dateRange.endDate = null">
                    Clear
                </button>
            </div>
        </div>

        <div class="form-row pt-3 bg-light">
            <div class="col-md-6">
                <div class="form-group row">
                    <label class="col-sm-4 col-form-label" for="startDate">StartDate</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="startDate" v-model="dateRange.startDate">
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-4 col-form-label" for="endDate">EndDate</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="endDate" v-model="dateRange.endDate">
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group row">
                    <label class="col-sm-4 col-form-label" for="minDate">minDate</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="minDate" v-model="minDate">
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-4 col-form-label" for="maxDate">maxDate</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="maxDate" v-model="maxDate">
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div class="form-check form-check-inline">
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
            <small class="form-text text-muted">Whether the picker appears aligned to the left, to the right, or
                centered relative to the HTML element it's attached to
            </small>
        </div>

        <div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="singleDatePicker"
                       v-model="singleDatePicker">
                <label class="form-check-label" for="singleDatePicker">
                    singleDatePicker
                </label>
            </div>
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
  import moment from 'moment'

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
        minDate: '2019-08-02',
        maxDate: '2020-11-02',
        // minDate: '',
        // maxDate: '',
        dateRange: {
          startDate: '2019-12-10',
          endDate: '2019-12-20',
        },
        show_ranges: true,
        singleDatePicker: false,
        timePicker: true,
        timePicker24Hour: true,
        showDropdowns: true,
        autoApply: false,
        showWeekNumbers: true,
        linkedCalendars: true,
      }
    },
    mounted () {
      // this.$refs.picker.open = true
    },
    methods: {
      updateValues (values) {
        this.dateRange.startDate = moment(values.startDate).format('YYYY-MM-DD');
        this.dateRange.endDate = moment(values.endDate).format('YYYY-MM-DD');

        console.log('event: update', values)
      },
      checkOpen (open) {
        console.log('event: open', open)
      },
      dateFormat (classes, date) {
        let yesterday = moment().subtract(1, 'day');
        if (!classes.disabled) {
          classes.disabled = moment(date).isSame(yesterday, 'day')
        }
        return classes
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    h1, h2 {
        font-weight: normal;
    }

    a {
        color: #42b983;
    }

    small.form-text {
        display: initial;

        &::before {
            content: ' - ';
        }
    }
</style>

<style>
    @import "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
</style>
