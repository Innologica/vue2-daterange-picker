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

<script lang="ts">
  import dateUtilMixin from './dateUtilMixin'

  import Vue from "vue";

import mixins from "vue-typed-mixins";

// export default Vue.extend({
  export default mixins(dateUtilMixin).extend({
    // mixins: [dateUtilMixin],
    name: 'calendar-ranges',
    props: {
      ranges:  Array as () => any[],
      selected: Object,
      localeData: Object,
      alwaysShowCalendars: Boolean,
    },
    data () {
      return {
        test: false,
        customRangeActive: false
      }
    },
    methods: {
      clickRange (range: any) {
        const vm: any = this;
        vm.customRangeActive = false
        this.$emit('clickRange', range)
      },
      clickCustomRange () {
        const vm: any = this;
        vm.customRangeActive = true
        this.$emit('showCustomRange')
      },
      range_class (range: any) {
        return { active: range.selected === true };
      }
    },
    computed: {
      listedRanges () {
        if(!this.ranges)
          return false
        return Object.keys(this.ranges).map((value: any) => {
          return {
            label: value,
            value: (this.ranges as any)[value],
            selected:
              this.$dateUtil.isSame(this.selected.startDate, this.ranges[value][0]) &&
              this.$dateUtil.isSame(this.selected.endDate, this.ranges[value][1])
          };
        })
      },
      selectedRange () {
        const vm: any = this;
        return vm.listedRanges.find((r: any) => r.selected === true)
      },
      showCustomRangeLabel () {
        return !this.alwaysShowCalendars;
      }
    },
  })
</script>
