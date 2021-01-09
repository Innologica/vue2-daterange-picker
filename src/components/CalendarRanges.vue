<template>
    <div class="ranges">
        <ul v-if="ranges">
            <li
                    v-for="range in listedRanges"
                    @click="clickRange(range.value)"
                    :data-range-key="range.label"
                    :key="range.label"
                    :class="range_class(range)"
                    tabindex="0"
            >{{range.label}}
            </li>
            <li
              v-if="showCustomRangeLabel"
              :class="{ active: customRangeActive || !selectedRange }"
              @click="clickCustomRange"
              tabindex="0"
            >
              {{localeData.customRangeLabel}}
            </li>
        </ul>
    </div>
</template>

<script>
  import dateUtilMixin from './dateUtilMixin'

  export default {
    mixins: [dateUtilMixin],
    props: {
      ranges: Object,
      selected: Object,
      localeData: Object,
      alwaysShowCalendars: Boolean,
    },
    data () {
      return {
        customRangeActive: false
      }
    },
    methods: {
      clickRange (range) {
        this.customRangeActive = false
        this.$emit('clickRange', range)
      },
      clickCustomRange () {
        this.customRangeActive = true
        this.$emit('showCustomRange')
      },
      range_class (range) {
        return { active: range.selected === true };
      }
    },
    computed: {
      listedRanges () {
        if(!this.ranges)
          return false
        return Object.keys(this.ranges).map(value => {
          return {
            label: value,
            value: this.ranges[value],
            selected:
              this.$dateUtil.isSame(this.selected.startDate, this.ranges[value][0]) &&
              this.$dateUtil.isSame(this.selected.endDate, this.ranges[value][1])
          };
        })
      },
      selectedRange () {
        return this.listedRanges.find(r => r.selected === true)
      },
      showCustomRangeLabel () {
        return !this.alwaysShowCalendars;
      }
    },
  }
</script>
