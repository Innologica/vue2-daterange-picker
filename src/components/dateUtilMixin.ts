import {getDateUtil} from "./util";
import Vue from "vue";
export default Vue.extend({
  props: {
    dateUtil: {
      type: [Object, String],
      default: 'native'
    },
  },
  data(){
    return {
      $dateUtil: getDateUtil('native')
    }
  }
  // methods:{
  //   $dateUtil: getDateUtil('native')
  // }
  // created () {
  //   this.$dateUtil = getDateUtil('native')
  // }
});
