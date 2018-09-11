# vue2-daterange-picker

> Vue2 date range picker base on https://github.com/dangrossman/bootstrap-daterangepicker (no jQuery)

NOT READY FOR PRODUCTION YET

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
import DateRangePicker from 'vue2-daterange-picker/src/components/DateRangePicker'

export default {
    components: { DateRangePicker },
    data() {
        return {
            startDate: '2017-09-05',
            endDate: '2017-09-15'
        }
    }
}
```

```html
<template>
    <date-range-picker :startDate="startDate" :endDate="endDate" @update="console.log(value)"></date-range-picker>
</template>
```

### Properties
-------
 You can define format and display options via the localeData prop:
 
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
- [ ] disabled dates
- [ ] make install function
- [ ] export single components


### Run local demo

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Publish
Bump the version the publish the package
```
npm version patch/minor/major
npm publish
```