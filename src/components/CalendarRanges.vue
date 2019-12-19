<template>
    <div class="ranges">
        <ul v-if="ranges">
            <li
                    v-for="(value, key) in ranges"
                    @click="clickRange(value)"
                    :data-range-key="key"
                    :key="key"
                    :class="range_class(value)"
            >{{key}}
            </li>
            <li
              v-if="showCustomRangeLabel"
              :class="{ active: customRangeActive || !selectedRange }"
              @click="clickCustomRange"
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
        return { active: !this.customRangeActive && range === this.ranges[this.selectedRange] };
      }
    },
    computed: {
      selectedRange () {
        return Object.keys(this.ranges).find(key => this.$dateUtil.isSame(this.selected.startDate, this.ranges[key][0], 'date') && this.$dateUtil.isSame(this.selected.endDate, this.ranges[key][1], 'date'))
      },
      showCustomRangeLabel () {
        return !this.alwaysShowCalendars;
      }
    },
  }
</script>
