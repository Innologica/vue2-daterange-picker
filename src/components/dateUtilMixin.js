import {getDateUtil} from "./util";

export default {
  props: {
    dateUtil: {
      type: [Object, String],
      default: 'native'
    },
  },
  beforeCreate () {
    this.$dateUtil = getDateUtil('native')
  }
}
