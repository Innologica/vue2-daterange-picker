<template>
    <div class="ranges">
        <div class="range_inputs">
            <button class="applyBtn btn btn-sm btn-success" :disabled="canSelect" type="button" @click="$emit('clickApply')">Apply</button>
            <button class="cancelBtn btn btn-sm btn-default" type="button" @click="$emit('clickCancel')">Cancel</button>
        </div>

        <ul v-if="ranges">
            <li v-for="(value, key) in ranges">{{key}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: ['canSelect', 'ranges']
    }
</script>