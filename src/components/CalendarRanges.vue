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
  import { isSameDay } from 'date-fns'

  export default {
    props: {
      ranges: Object,
      selected: Object
    },
    methods: {
      range_class (range) {
        return { active: isSameDay(this.selected.startDate, range[0]) && isSameDay(this.selected.endDate, range[1]) };
      }
    },
  }
</script>
