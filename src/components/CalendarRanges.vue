<template>
    <div class="ranges">
        <ul v-if="ranges">
            <li
                    v-for="(value, key) in ranges"
                    @click="$emit('clickRange', value)"
                    :data-range-key="key"
                    :key="key"
                    :class="range_class(value)"
            >{{key}}
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
      selected: Object
    },
    methods: {
      range_class (range) {
        return { active: this.$dateUtil.isSame(this.selected.startDate, range[0], 'date') && this.$dateUtil.isSame(this.selected.endDate, range[1], 'date') };
      }
    },
  }
</script>
