# Advanced

> Common use cases by example.

## Disabled dates

You can accomplish disabled dates via the date-format property which accepts a function with 2 params (classes, date). You can add to the classes object a "disabled" class which makes the date look disabled and not clickable.

#### Demo
<disabled-dates />

#### Source
<<< @/docs/.vuepress/components/disabled-dates.vue

## Slots demo

You can accomplish disabled dates via the date-format property which accepts a function with 2 params (classes, date). You can add to the classes object a "disabled" class which makes the date look disabled and not clickable.

#### Demo
<slots-demo />

#### Source
<<< @/docs/.vuepress/components/SlotsDemo.vue

<script>
  import SlotsDemo from "../.vuepress/components/SlotsDemo";
  export default {
    components: {SlotsDemo}
  }
</script>
