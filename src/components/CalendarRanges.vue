<template>
    <div class="ranges">
        <ul v-if="ranges" class="hidden-xs">
            <li v-for="(value, key) in ranges" @click="$emit('clickRange', value)" :key="key" :data-range-key="key">{{key}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['ranges']
    }
</script>
