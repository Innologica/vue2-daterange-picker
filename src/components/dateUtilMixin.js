import {getDateUtil} from "./util";

export default {
  props: {
    dateUtil: {
      type: [Object, String],
      default: 'native'
    },
  },
  created () {
    this.$dateUtil = getDateUtil('native')
  }
}
