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

<script lang="ts">
 import Vue from "vue";

export default Vue.extend({
    filters: {
      formatNumber: (value: number) => {
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
        type:Date,
        default: new Date()
        // default () {
        //   return new Date()
        // }
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const current: Date = this.currentTime ? new Date(this.currentTime) : new Date()
      const hours = current.getHours();
      return {
        hour: this.hour24 ? hours : hours % 12 || 12,
        minute: current.getMinutes() - (current.getMinutes() % this.miniuteIncrement),
        second: current.getSeconds(),
        ampm: hours < 12 ? 'AM' : 'PM',
      };
    },
    computed: {
      hours () {
        const values = [];
        const max = this.hour24? 24:12;
        for(let i=0; i< max; i++) {
          values.push(this.hour24? i:i+1);
        }
        return values;
      },
      minutes () {
        const values = [];
        const max = 60;
        const mI: number = this.miniuteIncrement as number;
        for(let i=0; i< max; i=i + mI) {
          values.push(i);
        }
        return values;
      },
    },
    watch: {
      hour () {
        const vm: any = this;
        vm.onChange();
      },
      minute () {
        const vm: any = this;
        vm.onChange();
      },
      second () {
         const vm: any = this;
        vm.onChange();
      },
      ampm () {
         const vm: any = this;
        vm.onChange();
      },
    },
    methods: {
      getHour() {
        const vm: any = this;
        if (vm.hour24) {
          return vm.hour;
        } else {
         if (vm.hour === 12) {
           return vm.ampm === 'AM' ? 0 : 12;
         } else {
           return vm.hour + (vm.ampm === 'PM' ? 12 : 0);
         }
        }
      },
      onChange () {
        const vm: any = this;
        this.$emit('update', {
          hours: vm.getHour(),
          minutes: vm.minute,
          seconds: vm.second,
        });
      }
    },
  })
</script>
