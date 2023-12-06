<script setup lang="ts">
import { computed } from 'vue';

import { RouterLink } from 'vue-router';

const side_nav = computed(() => ({
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
}));
</script>

<template lang="pug">
div.sidebar(v-if="side_nav.children")
  nav.sidebar-nav-container
    h3.sidebar-nav-heading {{ side_nav.title }}
    ul.sidebar-nav
      li(v-for="item in side_nav.children")
        RouterLink(:to="{path: item.url}")
          span.icon(:class="'icon-' + item.icon")
          | {{ item.title }}

</template>

<style scoped></style>
