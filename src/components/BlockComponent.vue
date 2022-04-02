<template>

    <p>{{ props.value }}</p>

</template>

<script setup>
import { ref, reactive } from 'vue' //ref for primitives, reactive for objects

const props = defineProps({
  value: Object
})

</script>

<style lang="scss"></style>
