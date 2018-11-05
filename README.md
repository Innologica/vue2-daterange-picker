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

export default {
    components: { DateRangePicker },
    data() {
        return {
            startDate: '2017-09-05',
            endDate: '2017-09-15',
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
                firstDay: 1 //ISO first day of week - see moment documenations for details
            }
        }
    }
}
```

```html
<template>
    <date-range-picker 
        :startDate="startDate" 
        :endDate="endDate" 
        @update="console.log(value)"
        :locale-data="locale"
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
- ranges - the ranges object

See the demo source or the code snippet above for example.

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

- [ ] documentation
- [ ] tests
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
