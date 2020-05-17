<template>
  <date-range-picker v-model="dateRange">
    <!--    header slot-->
    <div slot="header" class="slot">Calendar header</div>
    <!--    input slot-->
    <template #input="picker" style="min-width: 350px;">
      {{ picker.startDate | date }} - {{ picker.endDate | date }}
    </template>
    <!--    ranges (new slot syntax) -->
    <template #ranges="ranges">
      <div class="col-12 col-md-auto ranges">
        <ul>
          <li v-for="(range, name) in ranges.ranges" :key="name" @click="dateRange={ startDate: range[0], endDate: range[1] }">
            {{name}} => {{range[0].toDateString()}} - {{range[1].toDateString()}}</li>
        </ul>
      </div>
    </template>
    <!--    footer slot-->
    <div slot="footer" slot-scope="data" class="slot d-flex justify-content-between">
      <div>
        Calendar footer {{data.rangeText}}
      </div>
      <div style="margin-left: auto">
        <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Select ...</a>
      </div>
    </div>
  </date-range-picker>
</template>

<script>
  import DateRangePicker from "../../../src/components/DateRangePicker";

  export default {
    name: "SlotsDemo",
    components: {DateRangePicker},
    data () {
      let startDate = new Date();
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 6)
      return {
        dateRange: {startDate, endDate}
      }
    },
    filters: {
      date(val) {
        return val.toLocaleString()
      }
    }
  }
</script>

<style scoped>
  .slot {
    background-color: #666;
    padding: 0.5rem;
    color: white;
  }
</style>
