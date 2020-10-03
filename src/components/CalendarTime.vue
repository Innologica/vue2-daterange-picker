<template>
  <div class="calendar-time">
    <select v-model="hour" class="hourselect form-control mr-1" :disabled="readonly">
      <option v-for="h in hours"
        :key="h" :value="h">{{h | formatNumber}}</option>
    </select>
    :<select v-model="minute" class="minuteselect form-control ml-1" :disabled="readonly">
      <option v-for="m in minutes"
        :key="m" :value="m" >{{m | formatNumber}}</option>
    </select>
    <template v-if="secondPicker">
      :<select v-model="second" class="secondselect form-control ml-1" :disabled="readonly">
        <option v-for="s in 60"
          :key="s-1" :value="s-1">{{s-1 | formatNumber}}</option>
      </select>
    </template>
    <select v-if="!hour24" v-model="ampm" class="ampmselect" :disabled="readonly">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>

<script>
  export default {
    filters: {
      formatNumber: (value) => {
        if (value < 10) {
          return '0'+value.toString();
        }
        return value.toString();
      },
    },
    props: {
      miniuteIncrement: {
        type: Number,
        default: 5,
      },
      hour24: {
        type: Boolean,
        default: true,
      },
      secondPicker: {
        type: Boolean,
        default: false,
      },
      currentTime: {
        default () {
          return new Date()
        }
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      let current = this.currentTime ? this.currentTime : new Date()
      let hours = current.getHours();
      return {
        hour: this.hour24 ? hours : hours % 12 || 12,
        minute: current.getMinutes() - (current.getMinutes() % this.miniuteIncrement),
        second: current.getSeconds(),
        ampm: hours < 12 ? 'AM' : 'PM',
      };
    },
    computed: {
      hours () {
        let values = [];
        let max = this.hour24? 24:12;
        for(let i=0; i< max; i++) {
          values.push(this.hour24? i:i+1);
        }
        return values;
      },
      minutes () {
        let values = [];
        let max = 60;
        for(let i=0; i< max; i=i+this.miniuteIncrement) {
          values.push(i);
        }
        return values;
      },
    },
    watch: {
      hour () {
        this.onChange();
      },
      minute () {
        this.onChange();
      },
      second () {
        this.onChange();
      },
      ampm () {
        this.onChange();
      },
    },
    methods: {
      getHour() {
        if (this.hour24) {
          return this.hour;
        } else {
         if (this.hour === 12) {
           return this.ampm === 'AM' ? 0 : 12;
         } else {
           return this.hour + (this.ampm === 'PM' ? 12 : 0);
         }
        }
      },
      onChange () {
        this.$emit('update', {
          hours: this.getHour(),
          minutes: this.minute,
          seconds: this.second,
        });
      }
    },
  }
</script>
