# Vue date range picker

> Vue2 date range picker based on https://github.com/dangrossman/bootstrap-daterangepicker (no jQuery)

Date range picker component for vue made without jQuery dependency. Heavily inspired by bootstrap-daterangepicker. 


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
//you need to import the CSS manually (in case you want to override it)
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
    components: { DateRangePicker },
}
```

```vue
    <date-range-picker
            ref="picker"
            :opens="opens"
            :locale-data="{ firstDay: 1, format: 'DD-MM-YYYY HH:mm:ss' }"
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
    format: moment.localeData().longDateFormat('L'),
    separator: ' - ',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    weekLabel: 'W',
    customRangeLabel: 'Custom Range',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek()
}
```
* default ranges object (set to false to hide ranges)
```JS
{
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'This month': [moment().startOf('month'), moment().endOf('month')],
    'This year': [moment().startOf('year'), moment().endOf('year')],
    'Last week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
}
```

## Events

<component-events component="DateRangePicker"/>

## Slots

<component-slots component="DateRangePicker"/>
