<template>
  <date-range-picker v-model="dateRange">
    <!--    header slot-->
    <div slot="header" slot-scope="header" class="slot">
      <h3>Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
    </div>
    <!--    input slot (new slot syntax)-->
    <template #input="picker" style="min-width: 350px;">
      {{ picker.startDate | date }} - {{ picker.endDate | date }}
    </template>
    <!--    date slot-->
    <template #date="data">
      <span class="small">{{ data.date | dateCell }}</span>
    </template>
    <!--    ranges (new slot syntax) -->
    <template #ranges="ranges">
      <div class="ranges">
        <ul>
          <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
            <b>{{ name }}</b> <small class="text-muted">{{ range[0].toDateString() }} -
            {{ range[1].toDateString() }}</small>
          </li>
        </ul>
      </div>
    </template>
    <!--    footer slot-->
    <div slot="footer" slot-scope="data" class="slot">
      <div>
        <b class="text-black">Calendar footer</b> {{ data.rangeText }}
      </div>
      <div style="margin-left: auto">
        <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
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
    dateCell (value) {
      let dt = new Date(value)

      return dt.getDate()
    },
    date (val) {
      return val ? val.toLocaleString() : ''
    }
  }
}
</script>

<style scoped>
.slot {
  background-color: #aaa;
  padding: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-black {
  color: #000;
}
</style>
