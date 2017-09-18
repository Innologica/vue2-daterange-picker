<template>
    <div class="hello">
        <h1>Vue Date Range Picker</h1>
        <p>
            Based on <a href="http://www.daterangepicker.com" target="_blank">http://www.daterangepicker.com</a>
        </p>

        <p>
            The component is rewritten without jQuery dependancy. Requires only bootstrap and the original datepicker CSS (included).
        </p>

        <date-range-picker></date-range-picker>
    </div>
</template>

<script>
    import DateRangePicker from './components/DateRangePicker'

    export default {
        components: {DateRangePicker},
        name: 'hello',
        data() {
            return {}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
