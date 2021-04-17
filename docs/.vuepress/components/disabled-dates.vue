<template>
  <date-range-picker
    v-model="dateRange"
    :date-format="dateFormat"
  ></date-range-picker>
</template>

<script>
  import DateRangePicker from '../../../src/components/DateRangePicker'

  export default {
    name: "disabled_dates",
    components: {DateRangePicker},
    data () {
      return {
        dateRange: {
          startDate: '2019-12-26',
          endDate: '2019-12-28',
        },
      }
    },
    methods: {
      dateFormat (classes, date) {
        if (!classes.disabled) {
          classes.disabled = date.getTime() < new Date()
        }
        return classes
      }
    },
  }
</script>
