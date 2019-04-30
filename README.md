# vue2-daterange-picker

> Vue2 date range picker base on https://github.com/dangrossman/bootstrap-daterangepicker (no jQuery)

The component is in its early stages so if there is something wrong - write an issue or create a pull request.

## Demo
You can see a demo here: 
https://innologica.github.io/vue2-daterange-picker/

## Installlation

``` bash
# install via npm
npm i vue2-daterange-picker --save
```

## Usage

```javascript
import DateRangePicker from 'vue2-daterange-picker'
//you need to import the CSS manually (in case you want to override it)
import 'vue2-daterange-picker/dist/lib/vue-daterange-picker.min.css'

export default {
    components: { DateRangePicker },
    data() {
        return {
            dateRange: { // used for v-model prop
                startDate: '2017-09-05',
                endDate: '2017-09-15',
            },
            opens: "center",//which way the picker opens, default "center", can be "left"/"right"
            locale: {
                direction: 'ltr', //direction of text
                format: 'DD-MM-YYYY', //fomart of the dates displayed
                separator: ' - ', //separator between the two ranges
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: moment.weekdaysMin(), //array of days - see moment documenations for details
                monthNames: moment.monthsShort(), //array of month names - see moment documenations for details
                firstDay: 1, //ISO first day of week - see moment documenations for details
                showWeekNumbers: true //show week numbers on each row of the calendar
            },
            ranges: { //default value for ranges object (if you set this to false ranges will no be rendered)
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'This month': [moment().startOf('month'), moment().endOf('month')],
                'This year': [moment().startOf('year'), moment().endOf('year')],
                'Last week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            }
        }
    }
}
```

```html
<template>
    <date-range-picker 
        v-model="dateRange" 
        @update="console.log(value)"
        :locale-data="locale"
        :opens="opens"       
    >
    <!--Optional scope for the input displaying the dates -->
    <div slot="input" slot-scope="picker">...</div>
</date-range-picker>
</template>
```
### Slots
-------
Slot "input" is used to display the currently selected date range. You can use it to format the date as you like. If you add clickable elements you need to stop the event from propagating to the parent if you dont want to open the picker e.g. with @click.stop.

Props: 
- startDate - the start date currently selected
- endDate - the end date currently selected
- minDate - the minimum date that can be selected
- maxDate - the maximum date that can be selected
- ranges - the ranges object (set to false if you want to hide the ranges),
default ranges: 
````
{
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'This month': [moment().startOf('month'), moment().endOf('month')],
    'This year': [moment().startOf('year'), moment().endOf('year')],
    'Last week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
    'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
}
````

See the demo source or the code snippet above for example.

Slot "ranges" can be used to override the default ranges panel. If you utilize this slot it's your responsibility to set start and end date based on selection. 

If not specified the default CalendarRanges component is used

### Properties
-------
 You can define format and display options via the localeData prop. This is the default locale
 object :
 
```
      let default_locale = {
        direction: 'ltr', //direction of text
        format: moment.localeData().longDateFormat('L'), //fomart of the dates displayed
        separator: ' - ', //separator between the two ranges
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(), //array of days - see moment documenations for details
        monthNames: moment.monthsShort(), //array of month names - see moment documenations for details
        firstDay: moment.localeData().firstDayOfWeek() //ISO first day of week - see moment documenations for details
      }
```

## TODO

- [x] documentation
- [x] tests
- [x] disabled dates
- [ ] export single components


### Run local demo

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Publish
Bump the version the publish the package
```
npm version patch/minor/major
npm publish
```
