# Date range picker

> Vue2 date range picker based on https://github.com/dangrossman/bootstrap-daterangepicker (no jQuery)

Date range picker component for vue made without jQuery dependency. Heavily inspired by bootstrap-daterangepicker.
The component has NO dependency except vue.


## Installation

```sh
npm i vue2-daterange-picker --save
```

or

```sh
yarn add vue2-daterange-picker
```

import to use:

```JS
import DateRangePicker from 'vue2-daterange-picker'
```

## Usage

Register the component
```JS
import DateRangePicker from 'vue2-daterange-picker'
//you need to import the CSS manually
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    components: { DateRangePicker },
}
```

```vue
    <date-range-picker
            ref="picker"
            :opens="opens"
            :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy HH:mm:ss' }"
            :minDate="minDate" :maxDate="maxDate"
            :singleDatePicker="singleDatePicker"
            :timePicker="timePicker"
            :timePicker24Hour="timePicker24Hour"
            :showWeekNumbers="showWeekNumbers"
            :showDropdowns="showDropdowns"
            :autoApply="autoApply"
            v-model="dateRange"
            @update="updateValues"
            @toggle="checkOpen"
            :linkedCalendars="linkedCalendars"
            :dateFormat="dateFormat"
    >
        <template v-slot:input="picker" style="min-width: 350px;">
            {{ picker.startDate | date }} - {{ picker.endDate | date }}
        </template>
    </date-range-picker>
```

## Example / playground

<demo />

## Props

<component-props component="DateRangePicker"/>

* sample locale data
```JS
{
    direction: 'ltr',
    format: 'mm/dd/yyyy',
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    weekLabel: 'W',
    customRangeLabel: 'Custom Range',
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    firstDay: 0
}
```

See this link for details on date format - [https://blog.stevenlevithan.com/archives/date-time-format](https://blog.stevenlevithan.com/archives/date-time-format)

* default ranges object (set to false to hide ranges)

To specify ranges you need to pass and array where each element is an array with exactly two Date objects (from, to) or their timestamp equivalent.
```JS
let today = new Date()
today.setHours(0, 0, 0, 0)

let yesterday = new Date()
yesterday.setDate(today.getDate() - 1)
yesterday.setHours(0, 0, 0, 0);
{
    'Today': [today, today],
    'Yesterday': [yesterday, yesterday],
    'This month': [thisMonthStart, thisMonthEnd],
    'This year': [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
    'Last month': [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)],
}
```

## Events

<component-events component="DateRangePicker"/>

## Slots

<component-slots component="DateRangePicker"/>
