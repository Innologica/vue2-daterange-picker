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
                                <input type="text" class="form-control" id="startDate" v-model="startDate">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label" for="endDate">EndDate</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" id="endDate" v-model="endDate">
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
                </div>
                <span class="form-text text-muted">(string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to</span>

                <div class="py-5">
                    <h1>Demo</h1>
                    <div class="form-group">
                        <label>Select range: </label>
                        <date-range-picker
                                :opens="opens"
                                :startDate="startDate"
                                :endDate="endDate"
                                @update="updateValues"
                                :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"
                                :minDate="minDate" :maxDate="maxDate"
                                :showRanges="true"
                                :singleDatePicker="false"
                                :timePicker="true"
                                :timePicker24Hour="true"
                                :show-dropdowns="true"
                                :autoApply="false"
                                v-model="dateRange"
                        >
                            <div slot="input" slot-scope="picker">
                                {{ picker.startDate | date }} - {{ picker.endDate | date }}
                            </div>
                        </date-range-picker>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import DateRangePicker from './components/DateRangePicker'

  export default {
    components: {DateRangePicker},
    name: 'DateRangePickerDemo',
    filters: {
      date (value) {
        let options = {year: 'numeric', month: 'long', day: 'numeric'};
        return Intl.DateTimeFormat('en-US', options).format(value)
      }
    },
    data () {
      //                    :locale-data="{ daysOfWeek: [ 'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб' ] }"
      return {
        opens: 'center',
        startDate: '2017-09-19',
        endDate: '2017-10-09',
        minDate: '2017-09-02',
        maxDate: '2017-10-02',
        dateRange: {
            startDate: '2017-09-1',
            endDate: '2017-9-20',
        }
      }
    },
    methods: {
      updateValues (values) {
        console.log(values, this.dateRange)
        this.startDate = values.startDate.toISOString().slice(0, 10)
        this.endDate = values.endDate.toISOString().slice(0, 10)
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
</style>
