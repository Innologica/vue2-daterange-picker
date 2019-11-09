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
  import dayjs from 'dayjs'

  export default {
    props: {
      ranges: Object,
      selected: Object
    },
    methods: {
      range_class (range) {
        return { active: dayjs(this.selected.startDate).isSame(range[0], 'date') && dayjs(this.selected.endDate).isSame(range[1], 'date') };
      }
    },
  }
</script>
