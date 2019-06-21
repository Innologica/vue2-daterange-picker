<template>
    <div class="demo container">
        <div class="text-center">
            <img src="./assets/logo.png">

            <h1>Vue Date Range Picker</h1>
            <p>
                Based on <a href="http://www.daterangepicker.com" target="_blank">http://www.daterangepicker.com</a>
            </p>

            <p>
                The component is rewritten without jQuery dependancy. Requires only bootstrap and the original
                datepicker CSS (included).
            </p>
        </div>

        <div class="card bg-light" style="margin-bottom: 300px;">
            <div class=" card-body">
                <div class="row">
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

                <div class="form-group">
                    <label class="col-form-label">Opens: </label>
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
                    <span class="form-text text-muted">(string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to</span>
                </div>

                <h4>Other options:</h4>
                <div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="singleDatePicker" v-model="singleDatePicker">
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
                        <input class="form-check-input" type="checkbox" id="timePicker24Hour" v-model="timePicker24Hour">
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
                            Automatically select the range once the second date is selected ( otherwise you need to click the apply button)
                        </small>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="show_ranges" v-model="show_ranges">
                        <label class="form-check-label" for="show_ranges">
                            show ranges
                        </label>
                        <small class="form-text text-muted">
                            You can set this to false in order to hide the ranges selection. Otherwise it is an object with key/value.
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

                <div class="py-5">
                    <h2>Demo <small class="text-muted">(overridden slot "input")</small></h2>
                    <div class="form-group">
                        <label>Select range: </label>
                        <date-range-picker
                                ref="picker"
                                :opens="opens"
                                :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY HH:mm:ss' }"
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
                        >
                            <div slot="input" slot-scope="picker" style="min-width: 350px;">
                                {{ picker.startDate | date }} - {{ picker.endDate | date }}
                            </div>
                        </date-range-picker>

                        <button class="btn btn-info" @click="dateRange.startDate = null, dateRange.endDate = null">Clear</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import DateRangePicker from './components/DateRangePicker'
  import moment from 'moment'

  export default {
    components: {DateRangePicker},
    name: 'DateRangePickerDemo',
    filters: {
      date (value) {
        if(!value)
          return ''

        let options = {year: 'numeric', month: 'long', day: 'numeric'};
        return Intl.DateTimeFormat('en-US', options).format(value)
      }
    },
    data () {
      //                    :locale-data="{ daysOfWeek: [ 'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ] }"
      return {
        opens: 'center',
        minDate: '2017-08-02',
        maxDate: '2017-11-02',
        // minDate: '',
        // maxDate: '',
        dateRange: {
          startDate: '2017-09-10',
          endDate: '2017-9-20',
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
        this.dateRange.endDate =  moment(values.endDate).format('YYYY-MM-DD');

        console.log('event: update', values)
      },
      checkOpen (open) {
        console.log('event: open', open)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        /*margin: 0 10px;*/
        width: 100%;
    }

    a {
        color: #42b983;
    }

    label {
        width: 200px;
    }

    small.form-text {
        display: initial;

        &::before {
            content: ' - ';
        }
    }
</style>
