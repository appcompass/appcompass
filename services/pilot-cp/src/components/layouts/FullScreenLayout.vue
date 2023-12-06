<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template lang="pug">
.site
  transition(name="fade", mode="out-in")
    RouterView
</template>

<style scoped></style>
