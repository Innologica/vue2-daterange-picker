import dayjs from 'dayjs'
import dayjsLocaleData from 'dayjs/plugin/localeData'
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjsWeekOfYear from 'dayjs/plugin/weekOfYear'
import dayjsWeekday from 'dayjs/plugin/weekday'

dayjs.extend(dayjsLocaleData)
dayjs.extend(dayjsLocalizedFormat)
dayjs.extend(dayjsWeekOfYear)
dayjs.extend(dayjsWeekday)

import DateRangePicker from './components/DateRangePicker.vue'

export default DateRangePicker
