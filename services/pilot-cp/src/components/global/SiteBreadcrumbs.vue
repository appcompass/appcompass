<script setup lang="ts">
import { computed } from 'vue';

import { RouterLink } from 'vue-router';

const breadcrumbs = computed(() => [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Test Sub',
    url: '/'
  },
  {
    label: 'Second Test'
  }
]);
</script>

<template lang="pug">
nav.breadcrumbs
  ul
    li(v-for="crumb in breadcrumbs")
      RouterLink(v-if="crumb.url", :to="crumb.url") {{ crumb.label }}
      span(v-else) {{ crumb.label }}

</template>

<style scoped></style>
