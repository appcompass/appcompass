<script setup lang="ts">
import { computed } from 'vue';

import { RouterLink } from 'vue-router';

const navigation = computed(() => [
  {
    title: 'Home',
    url: '/',
    children: [
      {
        title: 'Test Sub',
        url: '/'
      },
      {
        title: 'Second Test',
        url: '/'
      }
    ]
  }
]);
</script>

<template lang="pug">
ul.header-nav.header-nav-primary(v-if="navigation")
  li(v-for="cat in navigation")
    RouterLink(:to="cat.url" exact, v-if="cat.url") {{ cat.title }}
    a(v-else) {{ cat.title }}
    ul(v-if="cat.children")
      li(v-for="item in cat.children")
        RouterLink(:to="{path: item.url}") {{ item.title }}

</template>

<style scoped></style>
