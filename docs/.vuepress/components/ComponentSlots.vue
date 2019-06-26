<template>
    <div>
        <div v-for="slot in slots">
            <h3>{{slot.name}}</h3>
            <p style="white-space: pre">{{slot.description}}</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ComponentSlots",
    props: {
      component: {
        type: String,
        required: true
      }
    },
    data () {
      let meta = require('../../docs')
      return {
        slots: meta[0].slots
      }
    },
  }
</script>