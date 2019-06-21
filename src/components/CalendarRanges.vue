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
  import moment from 'moment'

  export default {
    props: {
      ranges: Object,
      selected: Object
    },
    methods: {
      range_class (range) {
        return { active: moment(this.selected.startDate).isSame(range[0], 'date') && moment(this.selected.endDate).isSame(range[1], 'date') };
      }
    },
  }
</script>
