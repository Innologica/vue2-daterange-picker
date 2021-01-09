<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>Event</th>
                <th>Params</th>
                <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="event in events">
                <td nowrap class="text-sm">{{event.name}}</td>
                <td>
                    <ul v-if="event.params && event.params.length > 0">
                        <li v-for="param in event.params"><span class="small">({{param.type}}) {{param.name}} - {{param.desc}}</span></li>
                    </ul>
                </td>
                <td>{{event.description}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  export default {
    name: "ComponentEvents",
    props: {
      component: {
        type: String,
        required: true
      }
    },
    data () {
      let meta = require('../../docs')
      // console.log(meta[0].events)
      return {
        events: meta[0].events
      }
    },
  }
</script>

<style scoped>

</style>
