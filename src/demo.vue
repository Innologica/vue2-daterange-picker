<template>
    <div class="demo container">
        <h1>Vue Date Range Picker</h1>
        <p>
            Based on <a href="http://www.daterangepicker.com" target="_blank">http://www.daterangepicker.com</a>
        </p>

        <p>
            The component is rewritten without jQuery dependancy. Requires only bootstrap and the original datepicker
            CSS (included).
        </p>
        <div class="well">
            <div class="form-horizontal">
                <div class="form-group">
                    <label class="col-sm-2 control-label" for="startDate">StartDate</label>
                    <div class="col-sm-4">
                        <input type="text" class="form-control" id="startDate" v-model="startDate">
                    </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="endDate">EndDate</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="endDate" v-model="endDate">
                    </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Opens: </label>
                            <div class="">
                                <label class="radio-inline">
                                    <input type="radio" name="options" id="option1" value="left" v-model="opens">left
                        </label>
                                    <label class="radio-inline">
                                        <input type="radio" name="options" id="option2" value="center" v-model="opens">center
                        </label>
                                        <label class="radio-inline">
                                            <input type="radio" name="options" id="option3" value="right" v-model="opens">right
                        </label>
                            </div>
                            <span class="help-block">(string: 'left'/'right'/'center') Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to</span>
                        </div>

                        <div class="form-group">
                            <div class="checkbox-inline">
                                <label for="showRangeLabel">
                                    Show Range Label
                                    <input type="checkbox" id="showRangeLabel" v-model="showRangeLabel"/>
                       </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="height: 400px;">
                    <date-range-picker :opens="opens" :startDate="startDate" :endDate="endDate" :showRangeLabel="showRangeLabel" @update="updateValues" :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY' }"></date-range-picker>
                </div>
            </div>
</template>

<script>
import moment from "moment";
import DateRangePicker from "./components/DateRangePicker";

export default {
  components: { DateRangePicker },
  name: "DateRangePickerDemo",
  data() {
    return {
      opens: "center",
      startDate: moment().startOf("year").toISOString().slice(0, 10),
      endDate: moment().endOf("year").toISOString().slice(0, 10),
      showRangeLabel: false
    };
  },
  methods: {
    updateValues(values) {
      this.startDate = values.startDate.toISOString().slice(0, 10);
      this.endDate = values.endDate.toISOString().slice(0, 10);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
